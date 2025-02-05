"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MetricData {
    timestamp: number
    value: number
}

interface MetricChartProps {
    metricKey: string
    title: string
    description: string
    yAxisLabel: string
    dataMultiplier?: number
    data: MetricData[]
}

export default function MetricChart({
                                        metricKey,
                                        title,
                                        description,
                                        yAxisLabel,
                                        dataMultiplier = 1,
                                        data,
                                    }: MetricChartProps) {
    const formattedData = data.map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        value: item.value * dataMultiplier,
    }))

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {formattedData.length > 0 ? (
                    <ChartContainer
                        config={{
                            [metricKey]: {
                                label: title,
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="h-[300px] sm:h-[400px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedData}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-chart-1)"
                                    fill="var(--color-chart-1)"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">No data available</div>
                )}
            </CardContent>
        </Card>
    )
}

