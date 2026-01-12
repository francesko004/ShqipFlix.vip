"use client";

import { MediaItem } from "@/types/tmdb";
import { useState, useEffect } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WatchlistButtonProps {
    item: MediaItem;
    showLabel?: boolean;
    className?: string;
}

export function WatchlistButton({ item, showLabel = true, className }: WatchlistButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetch("/api/watchlist")
                .then((res) => res.json())
                .then((data) => {
                    const exists = data.some((i: any) => i.tmdbId === item.id && i.mediaType === item.media_type);
                    setIsInWatchlist(exists);
                });
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
                        title: item.title || item.name,
                        posterPath: item.poster_path,
                        mediaType: item.media_type,
                    }),
                });
                setIsInWatchlist(true);
            }
        } catch (err) {
            console.error("Watchlist error:", err);
        } finally {
            setIsLoading(false);
            // Optional: dispatch event for other components
            window.dispatchEvent(new Event("watchlist-updated"));
        }
    };

    return (
        <Button
            size="lg"
            variant="secondary"
            disabled={isLoading}
            className={`gap-2 text-base font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-transform hover:scale-105 ${className}`}
            onClick={toggleWatchlist}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isInWatchlist ? (
                <>
                    <Check className="w-5 h-5 text-red-500" />
                    {showLabel && "In My List"}
                </>
            ) : (
                <>
                    <Plus className="w-5 h-5" />
                    {showLabel && "Add to List"}
                </>
            )}
        </Button>
    );
}
