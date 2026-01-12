"use client";

import { useEffect, useState } from "react";
import { ContentRow } from "./ContentRow";
import { MediaItem } from "@/types/tmdb";
import { useSession } from "next-auth/react";

export function HistoryRow() {
    const { data: session } = useSession();
    const [history, setHistory] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetch("/api/history")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        const mapped: MediaItem[] = data.map((item: any) => ({
                            id: item.tmdbId,
                            title: item.mediaType === "movie" ? item.title : undefined,
                            name: item.mediaType === "tv" ? item.title : undefined,
                            poster_path: item.posterPath,
                            backdrop_path: null,
                            media_type: item.mediaType,
                            vote_average: 0,
                            release_date: "",
                            overview: "",
                            genre_ids: [],
                            popularity: 0,
                        }));
                        setHistory(mapped);
                    } else {
                        console.error("History data is not an array:", data);
                        setHistory([]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching history:", err);
                    setHistory([]);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [session]);

    if (!session || history.length === 0) return null;

    return (
        <ContentRow
            title="Continue Watching"
            items={history}
        />
    );
}
