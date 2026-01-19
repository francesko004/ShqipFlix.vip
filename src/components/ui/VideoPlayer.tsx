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
    // Customization parameters to match ShqipFlix theme
    const themeParams = new URLSearchParams({
        color: "dc2626", // Red-600 to match site accent
        primaryColor: "dc2626", // Alternate parameter name
        secondaryColor: "0b0c15", // Site background color
        iconColor: "ffffff",
        autoplay: "0",
    }).toString();

    if (type === "movie") {
        src = `https://vidking.net/embed/movie/${tmdbId}?${themeParams}`;
    } else {
        src = `https://vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${themeParams}`;
    }

    return (
        <div className="w-full relative z-20">
            <AdBlockWarning />
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/10 border border-white/10">
                <iframe
                    src={src}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-encrypted-media allow-popups"
                    frameBorder="0"
                />
            </div>
        </div>
    );
}
