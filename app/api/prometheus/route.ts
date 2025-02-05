import { NextResponse } from "next/server"

interface PrometheusResponse {
    status: "success" | "error"
    data: {
        resultType: "vector" | "matrix" | "scalar" | "string"
        result: Array<{
            metric: { [key: string]: string }
            values?: [number, string][]
            value?: [number, string]
        }>
    }
}

async function queryPrometheus(query: string): Promise<PrometheusResponse> {
    const baseUrl = "http://34.87.59.148:32767" // Replace with your actual Prometheus URL
    const url = `${baseUrl}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${encodeURIComponent(getStartTime())}&end=${encodeURIComponent(getEndTime())}&step=86400`

    console.log("Querying Prometheus with URL:", url)

    const response = await fetch(url)
    if (!response.ok) {
        const errorText = await response.text()
        console.error("Prometheus query failed:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    const data: PrometheusResponse = await response.json()
    console.log("Prometheus response:", JSON.stringify(data, null, 2))
    return data
}

function getStartTime(): string {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toISOString()
}

function getEndTime(): string {
    return new Date().toISOString()
}

export async function GET() {
    const queries = {
        cpuUsage: 'sum(avg(rate(node_cpu_seconds_total{mode!="idle"}[1h])) by (instance))',
        memoryUsage: "sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes)",
        diskIO: "sum(rate(node_disk_io_time_seconds_total[1h]))",
        networkTraffic: "sum(rate(node_network_receive_bytes_total[1h]) + rate(node_network_transmit_bytes_total[1h]))",
        podCount: "count(kube_pod_info) by (node)",
        serviceCount: "count(kube_service_info)",
        topPodsCPU: "topk(5, sum(rate(container_cpu_usage_seconds_total[5m])) by (pod))",
        topPodsMemory: "topk(5, sum(container_memory_usage_bytes) by (pod))",
        clusterHealth:
            'sum(kube_node_status_condition{condition="Ready", status="true"}) / count(kube_node_status_condition{condition="Ready"})',
    }

    try {
        const results = await Promise.all(
            Object.entries(queries).map(async ([key, query]) => {
                const data = await queryPrometheus(query)
                return { [key]: data }
            }),
        )

        const combinedResults = Object.assign({}, ...results)
        return NextResponse.json(combinedResults)
    } catch (error) {
        console.error("Error querying Prometheus:", error)
        return NextResponse.json({ error: "Failed to query Prometheus" }, { status: 500 })
    }
}

