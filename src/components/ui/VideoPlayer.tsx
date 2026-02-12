"use client";

import { useState, useEffect, useRef } from "react";
import { BumperPlayer } from "@/components/ui/BumperPlayer";
import { HlsPlayer } from "@/components/ui/HlsPlayer";
import { AdBlockWarning } from "./AdBlockWarning";
import { Server, ChevronDown } from "lucide-react";
import { Button } from "./button";

interface VideoPlayerProps {
    tmdbId: number;
    type: "movie" | "tv";
    title?: string;
    posterPath?: string;
    season?: number;
    episode?: number;
    hlsUrl?: string; // Optional direct HLS stream URL
}

export function VideoPlayer({ tmdbId, type, title, posterPath, season, episode, hlsUrl }: VideoPlayerProps) {
    const [showBumper, setShowBumper] = useState(true);
    const [videoStarted, setVideoStarted] = useState(false);
    const [activeProvider, setActiveProvider] = useState("vidking");
    const currentProgressRef = useRef(0);


    const providers = [
        { id: "vidking", name: "Server 1 (VidKing)", info: "Default" },
        { id: "vidsrc_to", name: "Server 2 (Vidsrc.to)", info: "Fast" },
        { id: "vidsrc_me", name: "Server 3 (Vidsrc.me)", info: "Alternative" },
        { id: "embed_su", name: "Server 4 (Embed.su)", info: "Ad-Free Style" },
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (videoStarted) {
            // Heartbeat to track progress every 30 seconds
            interval = setInterval(() => {
                fetch("/api/history", {
                    method: "POST",
                    body: JSON.stringify({
                        tmdbId,
                        title: title || "",
                        posterPath: posterPath || "",
                        mediaType: type,
                        progress: Math.floor(currentProgressRef.current),
                    }),
                    headers: { "Content-Type": "application/json" }
                }).catch(console.error);
            }, 30000);


            if (type === "tv" && season && episode) {
                // Record watched status once on start
                fetch("/api/episodes/history", {
                    method: "POST",
                    body: JSON.stringify({ tvId: tmdbId, season, episode }),
                    headers: { "Content-Type": "application/json" }
                }).catch(console.error);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [videoStarted, type, tmdbId, season, episode]);


    const handleBumperComplete = () => {
        setShowBumper(false);
        setVideoStarted(true);
    };

    // Construct embed URL based on active provider
    let embedUrl = "";

    const themeParams = new URLSearchParams({
        color: "dc2626",
        primaryColor: "dc2626",
        secondaryColor: "0b0c15",
        iconColor: "ffffff",
        autoplay: "0",
    }).toString();

    if (activeProvider === "vidking") {
        if (type === "movie") {
            embedUrl = `https://vidking.net/embed/movie/${tmdbId}?${themeParams}`;
        } else if (type === "tv" && season && episode) {
            embedUrl = `https://vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${themeParams}`;
        }
    } else if (activeProvider === "vidsrc_to") {
        embedUrl = `https://vidsrc.to/embed/${type}/${tmdbId}${type === "tv" ? `/${season}/${episode}` : ""}`;
    } else if (activeProvider === "vidsrc_me") {
        embedUrl = `https://vidsrc.me/embed/${type}?tmdb=${tmdbId}${type === "tv" ? `&season=${season}&episode=${episode}` : ""}`;
    } else if (activeProvider === "embed_su") {
        embedUrl = `https://embed.su/embed/${type}/${tmdbId}${type === "tv" ? `/${season}/${episode}` : ""}`;
    }


    return (
        <div className="space-y-4 w-full">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5">
                {showBumper && <BumperPlayer onComplete={handleBumperComplete} />}

                {videoStarted && (
                    hlsUrl ? (
                        <HlsPlayer
                            src={hlsUrl}
                            onProgress={(p) => currentProgressRef.current = p}
                            onComplete={() => console.log("HLS Video complete")}
                        />
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
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 font-medium tracking-wide">Duke përgatitur lojtarin...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Provider Switcher & Ad Warning */}
            <div className="flex flex-col gap-4">
                <AdBlockWarning />

                <div className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600/10 p-2 rounded-lg">
                                <Server className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Burimi i Transmetimit</h3>
                                <p className="text-gray-400 text-xs">Switch servers if the current one is slow or not working</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {providers.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setActiveProvider(p.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${activeProvider === p.id
                                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

