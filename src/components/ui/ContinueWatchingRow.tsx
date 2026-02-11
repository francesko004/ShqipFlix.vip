"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ContentRow } from "@/components/ui/ContentRow";
import { MediaItem } from "@/types/tmdb";

interface HistoryWithProgress {
    tmdbId: number;
    title: string;
    posterPath: string | null;
    mediaType: string;
    progress: number;
}

export function ContinueWatchingRow() {
    const { data: session } = useSession();
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        fetch("/api/history")
            .then((res) => res.json())
            .then((data: HistoryWithProgress[]) => {
                // Filter items with progress > 0 and < 90 (not finished)
                const inProgress = data.filter((item) => item.progress > 0 && item.progress < 90);

                // Convert to MediaItem format
                const mediaItems: MediaItem[] = inProgress.map((item) => ({
                    id: item.tmdbId,
                    title: item.mediaType === "movie" ? item.title : undefined,
                    name: item.mediaType === "tv" ? item.title : undefined,
                    poster_path: item.posterPath,
                    backdrop_path: null,
                    overview: "",
                    vote_average: 0,
                    media_type: item.mediaType as "movie" | "tv",
                    genre_ids: [],
                    popularity: 0,
                }));

                setItems(mediaItems);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [session]);

    if (!session || loading || items.length === 0) return null;

    return <ContentRow title="Vazhdo të Shikosh" items={items} />;
}
