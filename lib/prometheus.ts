export interface PrometheusValue {
    metric: {
        [key: string]: string
    }
    value: [number, string]
}

export interface PrometheusResult {
    metric: { [key: string]: string }
    values: [number, string][]
}

export interface PrometheusData {
    resultType: "vector" | "matrix" | "scalar" | "string"
    result: PrometheusResult[]
}

export interface PrometheusResponse {
    status: string
    data: {
        resultType: string
        result: PrometheusResult[]
    }
}

export interface PrometheusQueryResult {
    [key: string]: PrometheusResponse
}

