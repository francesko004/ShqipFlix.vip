"use client";

import { useEffect } from "react";
import { MediaItem } from "@/types/tmdb";
import { useSession } from "next-auth/react";

export function WatchTracker({ item }: { item: MediaItem }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (session && item) {
            // Track view after 5 seconds to avoid noise
            const timer = setTimeout(() => {
                fetch("/api/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tmdbId: item.id,
                        title: item.title || item.name,
                        posterPath: item.poster_path,
                        mediaType: item.media_type,
                        progress: 0,
                    }),
                });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [item, session]);

    return null;
}
