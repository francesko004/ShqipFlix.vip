"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

interface StatsChartsProps {
    data: {
        name: string;
        users: number;
        views: number;
    }[];
}

export function StatsCharts({ data }: StatsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Trend */}
            <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-6 text-white">Registration Trend</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: "#3b82f6", r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Views Trend */}
            <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-6 text-white">Watching Activity</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Bar
                                dataKey="views"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
