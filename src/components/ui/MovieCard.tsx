"use client";

import Image from "next/image";
import Link from "next/link";
import { MediaItem } from "@/types/tmdb";
import { tmdb } from "@/lib/tmdb";
import { Play, Plus, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { watchlist } from "@/lib/watchlist";

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
    const year = item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date || "").getFullYear() : "N/A";
    const rating = (item.vote_average || 0).toFixed(1);

    useEffect(() => {
        if (session) {
            const checkStatus = async () => {
                const exists = await watchlist.isInList(item.id, item.media_type);
                setIsInWatchlist(exists);
            };

            checkStatus();
            window.addEventListener("watchlist-updated", checkStatus);
            return () => window.removeEventListener("watchlist-updated", checkStatus);
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
                await watchlist.remove(item.id, item.media_type);
            } else {
                await watchlist.add(item);
            }
            // watchlist.add/remove already dispatches "watchlist-updated"
        } catch (err) {
            console.error("Watchlist error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link
            href={link}
            className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-sm hover:shadow-xl hover:shadow-red-900/10 hover:border-red-500/20 transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Poster Image */}
            <div className="absolute inset-0">
                <Image
                    src={tmdb.getImageUrl(item.poster_path)}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={false}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Top Stats & Watchlist - Always visible on desktop hover, visible on mobile */}
            <div className="absolute top-0 right-0 p-3 flex justify-end w-full z-10">
                <button
                    onClick={toggleWatchlist}
                    disabled={isLoading}
                    className={`
                        w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md 
                        transition-all duration-300 border 
                        ${isInWatchlist
                            ? 'bg-red-600/90 text-white border-red-500 shadow-lg shadow-red-900/30'
                            : 'bg-black/30 text-white border-white/10 hover:bg-white hover:text-black hover:border-white'
                        }
                        ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
                    `}
                    aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isInWatchlist ? (
                        <Check className="w-4 h-4 text-white" />
                    ) : (
                        <Plus className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Hover Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_25px_rgba(220,38,38,0.2)] group-active:scale-95 transition-transform duration-200">
                    <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left z-10">
                <h3 className="text-white font-semibold text-sm sm:text-[15px] leading-tight line-clamp-1 mb-1.5 group-hover:text-red-400 transition-colors duration-300">
                    {title}
                </h3>

                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <div className="flex items-center gap-2 text-zinc-300 font-medium">
                        <span>{year}</span>
                        <span className="w-0.5 h-0.5 bg-zinc-400 rounded-full" />
                        <span className="uppercase text-[10px] tracking-wider border border-white/10 px-1.5 py-0.5 rounded bg-white/5 text-zinc-200">
                            {item.media_type}
                        </span>
                    </div>

                    {item.vote_average > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500 font-bold bg-black/40 px-1.5 py-0.5 rounded-md border border-white/5 backdrop-blur-sm">
                            <span className="text-[10px]">★</span>
                            <span>{rating}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
