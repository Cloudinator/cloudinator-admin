"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts"

const data = [
    { name: "Backend", value: 30 },
    { name: "Frontend", value: 25 },
    { name: "Database", value: 25 },
    { name: "Full-workspace", value: 20 },
]

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']

export function ProjectOverview() {
    return (
        <div className="space-y-4">
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

