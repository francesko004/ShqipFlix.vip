"use client";

import { useSession, signOut } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar, LogOut, ChevronRight, Play, Clock, Film, Tv } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            Promise.all([
                fetch("/api/watchlist").then(res => res.json()),
                fetch("/api/history").then(res => res.json())
            ]).then(([wData, hData]) => {
                setWatchlist(Array.isArray(wData) ? wData : []);
                setHistory(Array.isArray(hData) ? hData : []);
                setIsLoading(false);
            }).catch(err => {
                console.error("Failed to load profile data", err);
                setIsLoading(false);
            });
        }
    }, [session]);

    if (!session) return null;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 md:pt-32 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#0b0c15] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mb-8">
                        {/* Header Banner */}
                        <div className="h-32 md:h-48 bg-gradient-to-r from-red-900/40 via-red-600/20 to-transparent relative">
                            <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-red-600 to-red-500 border-4 border-[#0b0c15] shadow-2xl flex items-center justify-center text-3xl md:text-4xl font-black">
                                    {session.user.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="mb-2 md:mb-4 text-center md:text-left">
                                    <h1 className="text-2xl md:text-4xl font-black tracking-tight">{session.user.username}</h1>
                                    <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{session.user.role} Account</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 md:pt-20 p-4 md:p-8 flex flex-col md:flex-row gap-8 md:gap-12">
                            {/* Left Column: Stats & Actions */}
                            <div className="w-full md:w-1/3 space-y-4 md:space-y-6">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Plan</p>
                                            <p className="text-white font-medium capitalize">Free Tier</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Member Since</p>
                                            <p className="text-white font-medium">January 2026</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => signOut()}
                                        className="w-full flex items-center justify-start gap-3 md:gap-4 p-3 md:p-4 h-auto bg-red-600/5 hover:bg-red-600/10 rounded-2xl border border-red-600/10 text-red-500 font-bold transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        Sign Out
                                    </Button>

                                    {session.user.role === "ADMIN" && (
                                        <Link href="/admin">
                                            <Button
                                                variant="ghost"
                                                className="w-full flex items-center justify-start gap-3 md:gap-4 p-3 md:p-4 h-auto bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-gray-300 font-bold transition-all mt-2"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                Admin Dashboard
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Watchlist & History */}
                            <div className="flex-1 space-y-6 md:space-y-8">
                                {/* Watchlist Section */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                                            <Play className="w-5 h-5 text-red-500" />
                                            My Watchlist
                                            <span className="text-sm font-normal text-gray-500 ml-2">({watchlist.length})</span>
                                        </h2>
                                    </div>

                                    {isLoading ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />)}
                                        </div>
                                    ) : watchlist.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            {watchlist.map((item) => (
                                                <Link href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.tmdbId}`} key={item.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                                                    {item.posterPath ? (
                                                        <Image
                                                            src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-500 text-xs text-center p-2">{item.title}</div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="w-8 h-8 text-white fill-white" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 md:p-8 text-center border border-white/5 rounded-xl bg-white/5 text-gray-500">
                                            Your watchlist is empty.
                                        </div>
                                    )}
                                </section>

                                {/* History Section */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            Continue Watching
                                        </h2>
                                    </div>

                                    {isLoading ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />)}
                                        </div>
                                    ) : history.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            {history.map((item) => (
                                                <Link href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.tmdbId}`} key={item.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                                                    {item.posterPath ? (
                                                        <Image
                                                            src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-500 text-xs text-center p-2">{item.title}</div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                        <div className="h-full bg-red-600" style={{ width: `${Math.min(item.progress || 0, 100)}%` }} />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 md:p-8 text-center border border-white/5 rounded-xl bg-white/5 text-gray-500">
                                            You haven't watched anything yet.
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
