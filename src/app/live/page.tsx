"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveVideoPlayer } from "@/components/LiveVideoPlayer";
import { Tv, Trophy, Calendar, Play, Signal, Search, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CategoryGroup {
    category: string;
    channels: any[];
}

export default function LiveTVPage() {
    const [groupedChannels, setGroupedChannels] = useState<CategoryGroup[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"channels" | "sports">("channels");

    useEffect(() => {
        fetchChannels();

        // Load ScoreBat script
        const script = document.createElement('script');
        script.src = "https://www.scorebat.com/embed/embed.js?v=arr";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchChannels = async () => {
        try {
            const response = await fetch("/api/channels");
            const data = await response.json();
            setGroupedChannels(data.groupedChannels || []);
            if (data.groupedChannels?.length > 0 && data.groupedChannels[0].channels.length > 0) {
                setSelectedChannel(data.groupedChannels[0].channels[0]);
            }
        } catch (error) {
            console.error("Error fetching channels:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        {/* Hero Section / Player */}
                        {selectedChannel ? (
                            <div className="space-y-4">
                                <LiveVideoPlayer
                                    streamUrl={selectedChannel.streamUrl}
                                    isIframe={selectedChannel.isIframe}
                                    name={selectedChannel.name}
                                    logo={selectedChannel.logo}
                                />
                                <div className="flex items-center justify-between p-6 bg-[#0b0c15] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        {selectedChannel.logo && (
                                            <div className="relative w-12 h-12 rounded-xl bg-black/50 p-2 border border-white/10 overflow-hidden">
                                                <Image
                                                    src={selectedChannel.logo}
                                                    alt={selectedChannel.name}
                                                    fill
                                                    className="object-contain p-2"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">{selectedChannel.name}</h1>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                                Live • {selectedChannel.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                            <Signal className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-[#0b0c15] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                                <Tv className="w-16 h-16 text-gray-700 mb-4" />
                                <h2 className="text-xl font-bold text-gray-500">No Channels Available</h2>
                                <p className="text-gray-600 max-w-sm mt-2">Select a channel from the list to start watching live TV.</p>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex items-center gap-4 border-b border-white/5">
                            <button
                                onClick={() => setActiveTab("channels")}
                                className={`relative pb-4 text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === "channels" ? "text-red-500" : "text-gray-500 hover:text-white"}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Tv className="w-4 h-4" />
                                    Live Channels
                                </div>
                                {activeTab === "channels" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("sports")}
                                className={`relative pb-4 text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === "sports" ? "text-red-500" : "text-gray-500 hover:text-white"}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    Sports Center
                                </div>
                                {activeTab === "sports" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />}
                            </button>
                        </div>

                        {/* Dynamic Content */}
                        {activeTab === "channels" ? (
                            <div className="space-y-12">
                                {groupedChannels.map((group) => (
                                    <section key={group.category} className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold flex items-center gap-3">
                                                <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                                                {group.category}
                                            </h2>
                                            <span className="text-gray-500 text-sm font-medium">{group.channels.length} Channels</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {group.channels.map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => setSelectedChannel(channel)}
                                                    className={`group relative aspect-video rounded-xl overflow-hidden border transition-all duration-300 ${selectedChannel?.id === channel.id
                                                        ? "border-red-600 ring-2 ring-red-600/20"
                                                        : "border-white/5 hover:border-white/20 bg-[#0b0c15]"
                                                        }`}
                                                >
                                                    {channel.logo ? (
                                                        <Image
                                                            src={channel.logo}
                                                            alt={channel.name}
                                                            fill
                                                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                                                            <Tv className="w-10 h-10 text-gray-700" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                        <p className="text-white text-xs font-bold truncate">{channel.name}</p>
                                                    </div>
                                                    {selectedChannel?.id === channel.id && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-300">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                            Live Scores & Highlights
                                        </h3>
                                        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#0b0c15]">
                                            <iframe
                                                src="https://www.scorebat.com/embed/livescore/"
                                                className="w-full h-[600px] border-none"
                                                allow="autoplay; fullscreen"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-300">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            Video Highlights
                                        </h3>
                                        <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#0b0c15]">
                                            <iframe
                                                src="https://www.scorebat.com/embed/g/"
                                                className="w-full h-[600px] border-none"
                                                allow="autoplay; fullscreen"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Schedule */}
                    <div className="lg:w-80 space-y-8">
                        <div className="bg-[#0b0c15] border border-white/5 rounded-2xl p-6 space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-red-500">
                                <Signal className="w-5 h-5" />
                                Up Next
                            </h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer">
                                        <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                                            <Play className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-wider">20:45 CET</p>
                                            <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white">Champions League: Finale</h4>
                                            <p className="text-[10px] text-gray-500 truncate">SuperSport 1 HD</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-gray-300 border-none rounded-xl h-11 text-xs font-bold uppercase tracking-widest">
                                Full Schedule
                            </Button>
                        </div>

                        <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="relative z-10 space-y-2">
                                <p className="text-white/80 text-[10px] uppercase font-bold tracking-[0.2em]">Premium Access</p>
                                <h3 className="text-xl font-black text-white leading-tight">UCL 2026 LIVE STREAMING</h3>
                                <p className="text-white/60 text-xs">Don&apos;t miss a single match. Watch all matches in Ultra HD 4K.</p>
                                <Button className="mt-4 bg-white text-red-600 hover:bg-white/90 font-bold rounded-xl h-10 px-6 text-xs uppercase tracking-wider">
                                    Get Notified
                                </Button>
                            </div>
                            <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
