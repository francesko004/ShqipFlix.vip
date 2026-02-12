"use client";

import { useEffect, useState } from "react";
import { ContentRow } from "./ContentRow";
import { MediaItem } from "@/types/tmdb";
import { useSession } from "next-auth/react";
import { tmdb } from "@/lib/tmdb";

export function RecommendationRow() {
    const { data: session } = useSession();
    const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
    const [rowTitle, setRowTitle] = useState("Recommended for You");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                // First try genre-based recommendations
                const recoRes = await fetch("/api/recommendations");
                const recoData = await recoRes.json();

                if (recoData.results && recoData.results.length > 0) {
                    setRecommendations(recoData.results);
                    setRowTitle(`Top picks in ${recoData.genreName}`);
                } else {
                    // Fallback to similarity-based if no genre history
                    const historyRes = await fetch("/api/history");
                    const historyData = await historyRes.json();

                    if (Array.isArray(historyData) && historyData.length > 0) {
                        const lastItem = historyData[0];
                        const simData = await tmdb.getSimilar(lastItem.tmdbId, lastItem.mediaType);
                        if (simData?.results) {
                            setRecommendations(simData.results.slice(0, 15));
                            setRowTitle(`Because you watched ${lastItem.title}`);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [session]);

    if (loading) return null;

    if (session && recommendations.length === 0) {
        return (
            <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-red-600 pl-3 mb-4">
                    Recommended for You
                </h2>
                <div className="w-full h-[200px] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white/5 backdrop-blur-sm">
                    <p className="text-lg font-medium mb-2">Discovery starts here</p>
                    <p className="text-sm opacity-60 text-center px-4">Start watching movies and TV shows to get personalized picks.</p>
                </div>
            </section>
        );
    }

    if (!session || recommendations.length === 0) return null;

    return (
        <ContentRow
            title={rowTitle}
            items={recommendations}
        />
    );
}
