"use client";

import Image from "next/image";
import Link from "next/link";
import { MediaItem } from "@/types/tmdb";
import { tmdb } from "@/lib/tmdb";
import { Play, Plus, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface MovieCardProps {
    item: MediaItem;
}

export function MovieCard({ item }: MovieCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const title = item.title || item.name || "Untitled";
    const link = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

    useEffect(() => {
        if (session) {
            // We could optimize this by passing watchlist down or using a context
            const handleUpdate = () => {
                fetch("/api/watchlist")
                    .then((res) => res.json())
                    .then((data) => {
                        const exists = data.some((i: any) => i.tmdbId === item.id && i.mediaType === item.media_type);
                        setIsInWatchlist(exists);
                    });
            };

            handleUpdate();
            window.addEventListener("watchlist-updated", handleUpdate);
            return () => window.removeEventListener("watchlist-updated", handleUpdate);
        }
    }, [item.id, item.media_type, session]);

    const toggleWatchlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            if (isInWatchlist) {
                await fetch("/api/watchlist", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tmdbId: item.id, mediaType: item.media_type }),
                });
                setIsInWatchlist(false);
            } else {
                await fetch("/api/watchlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tmdbId: item.id,
                        title,
                        posterPath: item.poster_path,
                        mediaType: item.media_type,
                    }),
                });
                setIsInWatchlist(true);
            }
            window.dispatchEvent(new Event("watchlist-updated"));
        } catch (err) {
            console.error("Watchlist error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link href={link} className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a2e] ring-1 ring-white/10 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:ring-red-600/50">
            <Image
                src={tmdb.getImageUrl(item.poster_path)}
                alt={title}
                fill
                className="object-cover transition-all duration-500 group-hover:opacity-40 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Hover content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.6)] transform group-hover:scale-110 active:scale-95 transition-all duration-300">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-current translate-x-0.5" />
                </div>

                <button
                    onClick={toggleWatchlist}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-2 md:p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-white hover:text-black transition-all disabled:opacity-50 touch-target"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isInWatchlist ? (
                        <Check className="w-4 h-4 text-red-500" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-white font-bold text-xs md:text-sm line-clamp-1">{title}</h3>
                <div className="flex items-center gap-2 mt-1 text-[10px] md:text-xs text-gray-300">
                    <span>{item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date || "").getFullYear() : "N/A"}</span>
                    <span className="uppercase border border-white/20 px-1 rounded text-[9px] md:text-[10px]">{item.media_type}</span>
                    <span className="text-yellow-500 font-bold ml-auto">{(item.vote_average || 0).toFixed(1)}</span>
                </div>
            </div>
        </Link>
    );
}
