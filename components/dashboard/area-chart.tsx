"use client"

import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
    { date: "Apr 15", Success: 4000, Fail: 2400 },
    { date: "Apr 20", Success: 3000, Fail: 1398 },
    { date: "Apr 25", Success: 2000, Fail: 9800 },
    { date: "Apr 30", Success: 2780, Fail: 3908 },
    { date: "May 5", Success: 1890, Fail: 4800 },
    { date: "May 10", Success: 2390, Fail: 3800 },
    { date: "May 15", Success: 3490, Fail: 4300 },
    { date: "May 20", Success: 2000, Fail: 9800 },
    { date: "May 25", Success: 2780, Fail: 3908 },
    { date: "May 30", Success: 1890, Fail: 4800 },
    { date: "Jun 4", Success: 2390, Fail: 3800 },
    { date: "Jun 9", Success: 3490, Fail: 4300 },
]

export function AreaChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
                data={data}
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
                    dataKey="Success"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                    strokeWidth={2}
                />
                <Area
                    type="monotone"
                    dataKey="Fail"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorFail)"
                    strokeWidth={2}
                />
            </RechartsAreaChart>
        </ResponsiveContainer>
    )
}

