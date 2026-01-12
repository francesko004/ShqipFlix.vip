
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Play, Film, Tv } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
    const userCount = await prisma.user.count();
    const movieCount = await prisma.mediaContent.count({ where: { mediaType: "movie" } });
    const tvCount = await prisma.mediaContent.count({ where: { mediaType: "tv" } });
    const totalViews = await prisma.historyItem.count();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-red-500" />
                        Analytics
                    </h2>
                    <p className="text-gray-400">System performance and usage statistics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: userCount.toString(), icon: Users, color: "text-blue-500" },
                    { label: "Movies", value: movieCount.toString(), icon: Film, color: "text-purple-500" },
                    { label: "TV Shows", value: tvCount.toString(), icon: Tv, color: "text-orange-500" },
                    { label: "Total Plays", value: totalViews.toString(), icon: Play, color: "text-green-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0b0c15] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#0b0c15] border border-white/5 rounded-xl p-8 text-center text-gray-500 h-64 flex items-center justify-center">
                <p>Usage trends and charts coming soon.</p>
            </div>
        </div>
    );
}
