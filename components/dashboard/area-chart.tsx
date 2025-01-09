"use client"

import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {BuildAnalysisResponse} from "@/components/dashboard/DashboardComponent";


type buildAnalysis = {
    buildAnalysis: BuildAnalysisResponse | undefined;
}

export function AreaChart({buildAnalysis}:buildAnalysis) {

    console.log("area chart ",buildAnalysis);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
                data={buildAnalysis}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 12 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 12 }}
                />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="success"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                    strokeWidth={2}
                />
                <Area
                    type="monotone"
                    dataKey="fail"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorFail)"
                    strokeWidth={2}
                />
            </RechartsAreaChart>
        </ResponsiveContainer>
    )
}

