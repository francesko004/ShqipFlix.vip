
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Play, Film, Tv } from "lucide-react";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
    const userCount = await prisma.user.count();
    const movieCount = await prisma.mediaContent.count({ where: { mediaType: "movie" } });
    const tvCount = await prisma.mediaContent.count({ where: { mediaType: "tv" } });
    const totalViews = await prisma.historyItem.count();

    // Prepare trend data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date,
            name: format(date, "EEE"),
            users: 0,
            views: 0,
        };
    });

    const trendData = await Promise.all(
        last7Days.map(async (day) => {
            const start = startOfDay(day.date);
            const end = endOfDay(day.date);

            const users = await prisma.user.count({
                where: {
                    createdAt: { gte: start, lte: end },
                },
            });

            const views = await prisma.historyItem.count({
                where: {
                    lastWatched: { gte: start, lte: end },
                },
            });

            return {
                ...day,
                users,
                views,
            };
        })
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <BarChart3 className="w-6 h-6 text-red-500" />
                        Analytics Overview
                    </h2>
                    <p className="text-gray-400">System performance and usage trends</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">
                    <TrendingUp className="w-4 h-4" />
                    Live System Stats
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: userCount.toLocaleString(), icon: Users, color: "text-blue-500" },
                    { label: "Movies", value: movieCount.toLocaleString(), icon: Film, color: "text-purple-500" },
                    { label: "TV Shows", value: tvCount.toLocaleString(), icon: Tv, color: "text-orange-500" },
                    { label: "Total Media Plays", value: totalViews.toLocaleString(), icon: Play, color: "text-green-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0b0c15]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Performance Trends</h3>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Last 7 Days</span>
                </div>
                <StatsCharts data={trendData} />
            </div>
        </div>
    );
}
