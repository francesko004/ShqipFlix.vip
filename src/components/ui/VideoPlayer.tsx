"use client";

import { AdBlockWarning } from "@/components/ui/AdBlockWarning";

interface VideoPlayerProps {
    tmdbId: number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
}

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1 }: VideoPlayerProps) {
    let src = "";
    if (type === "movie") {
        src = `https://vidking.net/embed/movie/${tmdbId}`;
    } else {
        src = `https://vidking.net/embed/tv/${tmdbId}/${season}/${episode}`;
    }

    // Add customization/color params if needed, e.g. ?color=ff0000
    // src += "?color=e50914"; 

    return (
        <div className="w-full relative z-20">
            <AdBlockWarning />
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/10 border border-white/10">
                <iframe
                    src={src}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                />
            </div>
        </div>
    );
}
