"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DetailedChartProps {
    title: string
    description: string
    data: { timestamp: number; value: number }[]
    valueFormatter: (value: number) => string
    color: string
}

export function DetailedChart({ title, description, data, valueFormatter, color }: DetailedChartProps) {
    const formattedData = data.map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        value: item.value,
    }))

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        [title]: {
                            label: title,
                            color: color,
                        },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedData}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={valueFormatter} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default DetailedChart