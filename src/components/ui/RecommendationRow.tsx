"use client";

import { useEffect, useState } from "react";
import { ContentRow } from "./ContentRow";
import { MediaItem } from "@/types/tmdb";
import { useSession } from "next-auth/react";
import { tmdb } from "@/lib/tmdb";

export function RecommendationRow() {
    const { data: session } = useSession();
    const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
    const [lastItemTitle, setLastItemTitle] = useState("");

    useEffect(() => {
        if (session) {
            fetch("/api/history")
                .then(res => res.json())
                .then(async data => {
                    if (data && data.length > 0) {
                        const lastItem = data[0];
                        setLastItemTitle(lastItem.title);

                        const recommendationsData = await tmdb.getSimilar(
                            lastItem.tmdbId,
                            lastItem.mediaType
                        );
                        setRecommendations(recommendationsData.results.slice(0, 15));
                    }
                });
        }
    }, [session]);

    if (session && recommendations.length === 0) {
        return (
            <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-red-600 pl-3 mb-4">
                    Recommended for You
                </h2>
                <div className="w-full h-[200px] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white/5">
                    <p className="text-lg font-medium mb-2">Your personalized picks will appear here</p>
                    <p className="text-sm opacity-60">Start watching movies and TV shows to get recommendations</p>
                </div>
            </section>
        );
    }

    if (!session || recommendations.length === 0) return null;

    return (
        <ContentRow
            title={`Because you watched ${lastItemTitle}`}
            items={recommendations}
        />
    );
}
