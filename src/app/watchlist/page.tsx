"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MediaItem } from "@/types/tmdb";
import { watchlist } from "@/lib/watchlist";
import { MovieCard } from "@/components/ui/MovieCard";
import { Bookmark, Eye } from "lucide-react";

export default function WatchlistPage() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setItems(watchlist.get());

        const handleUpdate = () => {
            setItems(watchlist.get());
        };

        window.addEventListener("watchlist-updated", handleUpdate);
        return () => window.removeEventListener("watchlist-updated", handleUpdate);
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-[#0b0c15]">
                <Navbar />
                <div className="container mx-auto px-4 pt-32">
                    <div className="h-12 w-48 bg-white/5 rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b0c15] flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                            <Bookmark className="w-8 h-8 text-red-600" />
                            My List
                        </h1>
                        <p className="text-gray-400 mt-2">Movies and TV shows you&apos;ve saved to watch later.</p>
                    </div>
                    {items.length > 0 && (
                        <div className="text-gray-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-full">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'}
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Bookmark className="w-12 h-12 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
                        <p className="text-gray-400 max-w-md mb-8">
                            Add movies and TV shows to your list to keep track of what you want to watch.
                        </p>
                        <a
                            href="/"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            Browse Content
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                        {items.map((item) => (
                            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <MovieCard item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
