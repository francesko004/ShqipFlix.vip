import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Users,
    Film,
    Eye,
    TrendingUp,
    Plus,
    MoreVertical,
    Activity,
    Tv,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentRefreshButton } from "@/components/admin/ContentRefreshButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const watchlistCount = await prisma.watchlistItem.count();
    const historyCount = await prisma.historyItem.count();
    const mediaCount = await prisma.mediaContent.count();
    const liveChannelCount = await (prisma as any).liveChannel.count();

    // Get recent users
    const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const stats = [
        { label: "Total Users", value: userCount, icon: Users, color: "blue" },
        { label: "Movies & TV", value: mediaCount, icon: Film, color: "purple" },
        { label: "Live Channels", value: liveChannelCount, icon: Tv, iconColor: "text-red-500", color: "red" },
        { label: "Total Views", value: historyCount, icon: Eye, color: "red" },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#0b0c15] border border-white/5 p-4 lg:p-6 rounded-2xl hover:border-red-600/20 transition-all hover:shadow-2xl hover:shadow-red-900/5 group">
                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                            <div className={`p-2 lg:p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <Activity className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-gray-500 text-xs lg:text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl lg:text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Users */}
                <div className="lg:col-span-2 bg-[#0b0c15] border border-white/5 rounded-2xl p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <h2 className="text-lg lg:text-xl font-bold">Recent Registrations</h2>
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs lg:text-sm">View All</Button>
                        </Link>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                        {recentUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs lg:text-sm flex-shrink-0">
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm lg:text-base truncate">{user.username}</p>
                                        <p className="text-[10px] lg:text-xs text-gray-500 truncate">{user.role} • Registered {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Link href="/admin/users">
                                    <Button variant="ghost" size="icon" className="flex-shrink-0"><MoreVertical className="w-4 h-4" /></Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0b0c15] border border-white/5 rounded-2xl p-4 lg:p-6">
                    <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Button className="w-full justify-start gap-3 bg-red-600 hover:bg-red-700 h-11 lg:h-12 rounded-xl shadow-lg shadow-red-900/10 text-sm lg:text-base" asChild>
                            <Link href="/admin/channels">
                                <Tv className="w-4 h-4 lg:w-5 lg:h-5" />
                                Manage Live Channels
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 bg-white/5 border-white/10 h-11 lg:h-12 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm lg:text-base" asChild>
                            <Link href="/admin/content">
                                <Film className="w-4 h-4 lg:w-5 lg:h-5" />
                                Content Management
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 bg-white/5 border-white/10 h-11 lg:h-12 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm lg:text-base" asChild>
                            <Link href="/admin/requests">
                                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                                Movie Requests
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 bg-white/5 border-white/10 h-11 lg:h-12 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-sm lg:text-base" asChild>
                            <Link href="/admin/support">
                                <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                                Support Tickets
                            </Link>
                        </Button>
                        <ContentRefreshButton />
                    </div>

                    <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-red-600/5 border border-red-600/10 rounded-xl">
                        <h4 className="text-red-500 font-bold text-xs lg:text-sm mb-1">System Health</h4>
                        <p className="text-[10px] lg:text-xs text-gray-400 leading-relaxed">Database: Connected • TMDB: Active • API: Operational</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { ShieldAlert } from "lucide-react";
