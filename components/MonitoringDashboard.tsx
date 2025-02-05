"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import { ClusterHealthIndicator } from "./ClusterHealthIndicator"
import { MetricsRadarChart } from "./MetricsRadarChart"
import { motion } from "framer-motion"
import { Activity, Server, HardDrive, Loader2 } from "lucide-react"
import type { PrometheusQueryResult, PrometheusResponse, PrometheusResult } from "@/lib/prometheus"
import ResourceDistributionChart from "@/components/ResourceDistributionChart"
import MetricChart from "@/components/MetricChart"
import useSWR from "swr"
import TopResourcePods from "@/components/TopResourcePods"

interface MetricData {
    timestamp: number
    value: number
}

interface DashboardData {
    cpuUsage: MetricData[]
    memoryUsage: MetricData[]
    diskIO: MetricData[]
    networkTraffic: MetricData[]
    podCount: number
    serviceCount: number
    topPodsCPU: { pod: string; value: number }[]
    topPodsMemory: { pod: string; value: number }[]
    clusterHealth: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MonitoringDashboard() {
    const { data, error } = useSWR<PrometheusQueryResult>("/api/prometheus", fetcher, {
        refreshInterval: 60000, // Refresh every minute
    })

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        cpuUsage: [],
        memoryUsage: [],
        diskIO: [],
        networkTraffic: [],
        podCount: 0,
        serviceCount: 0,
        topPodsCPU: [],
        topPodsMemory: [],
        clusterHealth: 0,
    })

    useEffect(() => {
        if (data) {
            const newData: DashboardData = {
                cpuUsage: [],
                memoryUsage: [],
                diskIO: [],
                networkTraffic: [],
                podCount: 0,
                serviceCount: 0,
                topPodsCPU: [],
                topPodsMemory: [],
                clusterHealth: 0,
            }

            // Helper function to process matrix data
            const processMatrixData = (metricData: PrometheusResponse): MetricData[] => {
                if (metricData?.data?.result?.[0]?.values) {
                    return metricData.data.result[0].values.map(([timestamp, value]: [number, string]) => ({
                        timestamp: timestamp * 1000, // Convert to milliseconds
                        value: Number.parseFloat(value),
                    }))
                }
                return []
            }

            // Process each metric
            newData.cpuUsage = processMatrixData(data.cpuUsage)
            newData.memoryUsage = processMatrixData(data.memoryUsage)
            newData.diskIO = processMatrixData(data.diskIO)
            newData.networkTraffic = processMatrixData(data.networkTraffic)

            // Process podCount
            if (data.podCount?.data?.result?.[0]?.values) {
                newData.podCount = Number.parseInt(
                    data.podCount.data.result[0].values[data.podCount.data.result[0].values.length - 1][1],
                )
            }

            // Process serviceCount
            if (data.serviceCount?.data?.result?.[0]?.values) {
                newData.serviceCount = Number.parseInt(
                    data.serviceCount.data.result[0].values[data.serviceCount.data.result[0].values.length - 1][1],
                )
            }

            // Process topPodsCPU and topPodsMemory
            const processTopPods = (metricData: PrometheusResponse): { pod: string; value: number }[] => {
                if (metricData?.data?.result) {
                    return metricData.data.result.map((item: PrometheusResult) => ({
                        pod: item.metric.pod,
                        value: Number.parseFloat(item.values[item.values.length - 1][1]),
                    }))
                }
                return []
            }

            newData.topPodsCPU = processTopPods(data.topPodsCPU)
            newData.topPodsMemory = processTopPods(data.topPodsMemory)

            // Process clusterHealth
            if (data.clusterHealth?.data?.result?.[0]?.values) {
                newData.clusterHealth = Number.parseFloat(
                    data.clusterHealth.data.result[0].values[data.clusterHealth.data.result[0].values.length - 1][1],
                )
            }

            setDashboardData(newData)
        }
    }, [data])

    if (error) return <div>Failed to load</div>
    if (!data) return <LoadingIndicator />

    // Sample data for ResourceDistributionChart
    const podDistribution = [
        { name: "Running", value: dashboardData.podCount * 0.8 },
        { name: "Pending", value: dashboardData.podCount * 0.15 },
        { name: "Failed", value: dashboardData.podCount * 0.05 },
    ]

    // Sample data for MetricsRadarChart
    const nodeComparison = [
        { subject: "CPU", A: 120, B: 110 },
        { subject: "Memory", A: 98, B: 130 },
        { subject: "Disk I/O", A: 86, B: 130 },
        { subject: "Network", A: 99, B: 100 },
        { subject: "Pods", A: 85, B: 90 },
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Cluster Health"
                    icon={<Activity className="h-6 w-6 text-purple-500" />}
                    content={<ClusterHealthIndicator health={dashboardData.clusterHealth} />}
                />
                <MetricCard
                    title="Pods"
                    icon={<Server className="h-6 w-6 text-purple-500" />}
                    content={
                        <motion.div
                            className="text-2xl font-bold text-purple-500"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {dashboardData.podCount}
                        </motion.div>
                    }
                />
                <MetricCard
                    title="Services"
                    icon={<HardDrive className="h-6 w-6 text-purple-500" />}
                    content={
                        <motion.div
                            className="text-2xl font-bold text-purple-500"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {dashboardData.serviceCount}
                        </motion.div>
                    }
                />
                <MetricCard
                    title="Network Traffic"
                    icon={<Activity className="h-6 w-6 text-purple-500" />}
                    content={
                        <div className="h-[80px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboardData.networkTraffic}>
                                    <defs>
                                        <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4B0082" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4B0082" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="url(#colorNetwork)"
                                        fill="url(#colorNetwork)"
                                        strokeWidth={2}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#00000030" />
                                    <XAxis
                                        dataKey="timestamp"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#00000080", fontSize: 10 }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#00000080", fontSize: 10 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    }
                />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <MetricChart
                    metricKey="cpuUsage"
                    title="CPU Usage"
                    description="Average CPU usage across all nodes over the past month"
                    yAxisLabel="CPU Usage (%)"
                    dataMultiplier={100}
                    data={dashboardData.cpuUsage}
                />
                <MetricChart
                    metricKey="memoryUsage"
                    title="Memory Usage"
                    description="Average memory usage across all nodes over the past month"
                    yAxisLabel="Memory Usage (%)"
                    dataMultiplier={100}
                    data={dashboardData.memoryUsage}
                />
                <MetricChart
                    metricKey="diskIO"
                    title="Disk I/O"
                    description="Total disk I/O operations across all nodes over the past month"
                    yAxisLabel="Disk I/O (ops/s)"
                    data={dashboardData.diskIO}
                />
                <MetricChart
                    metricKey="networkTraffic"
                    title="Network Traffic"
                    description="Total network traffic across all nodes over the past month"
                    yAxisLabel="Network Traffic (bytes/s)"
                    data={dashboardData.networkTraffic}
                />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <ResourceDistributionChart title="Pod Status Distribution" data={podDistribution} />
                <MetricsRadarChart title="Node Comparison" data={nodeComparison} />
            </div>

            <TopResourcePods cpuPods={dashboardData.topPodsCPU} memoryPods={dashboardData.topPodsMemory} />
        </div>
    )
}

function MetricCard({ title, icon, content }: { title: string; icon: React.ReactNode; content: React.ReactNode }) {
    return (
        <Card className="rounded-2xl shadow-lg border border-purple-200 p-6 transition-transform duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="mt-4">{content}</CardContent>
        </Card>
    )
}

function LoadingIndicator() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex gap-2">
                <Loader2 className="animate-spin text-purple-500 text-6xl" />
                <h1 className="text-xl text-purple-500">Loading</h1>
            </div>
        </div>
    )
}

export default MonitoringDashboard

