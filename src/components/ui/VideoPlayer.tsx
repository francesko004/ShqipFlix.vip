"use client";

import { useState, useEffect } from "react";
import { BumperPlayer } from "@/components/ui/BumperPlayer";
import { HlsPlayer } from "@/components/ui/HlsPlayer";

interface VideoPlayerProps {
    tmdbId: number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    hlsUrl?: string; // Optional direct HLS stream URL
}

export function VideoPlayer({ tmdbId, type, season, episode }: VideoPlayerProps) {
    const [showBumper, setShowBumper] = useState(true);
    const [videoStarted, setVideoStarted] = useState(false);

    useEffect(() => {
        if (videoStarted && type === "tv" && season && episode) {
            // Record watched status in background
            fetch("/api/episodes/history", {
                method: "POST",
                body: JSON.stringify({ tvId: tmdbId, season, episode }),
                headers: { "Content-Type": "application/json" }
            }).catch(console.error);
        }
    }, [videoStarted, type, tmdbId, season, episode]);

    const handleBumperComplete = () => {
        setShowBumper(false);
        setVideoStarted(true);
    };

    // Construct embed URL based on type
    let embedUrl = "";

    // Customization parameters to match ShqipFlix theme
    const themeParams = new URLSearchParams({
        color: "dc2626", // Red-600 to match site accent
        primaryColor: "dc2626", // Alternate parameter name
        secondaryColor: "0b0c15", // Site background color
        iconColor: "ffffff",
        autoplay: "0",
    }).toString();

    if (type === "movie") {
        embedUrl = `https://vidking.net/embed/movie/${tmdbId}?${themeParams}`;
    } else if (type === "tv" && season && episode) {
        embedUrl = `https://vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${themeParams}`;
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            {showBumper && <BumperPlayer onComplete={handleBumperComplete} />}

            {videoStarted && (
                hlsUrl ? (
                    <HlsPlayer src={hlsUrl} onComplete={() => console.log("HLS Video complete")} />
                ) : embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title="Video Player"
                    />
                ) : null
            )}

            {!videoStarted && !showBumper && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>Loading player...</p>
                </div>
            )}
        </div>
    );
}
