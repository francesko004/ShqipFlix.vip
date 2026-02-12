"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Maximize, Minimize, Volume2, VolumeX, Play, Pause, Settings, Info } from "lucide-react";
import Image from "next/image";

interface LiveVideoPlayerProps {
    streamUrl: string;
    isIframe: boolean;
    name: string;
    logo?: string;
}

export function LiveVideoPlayer({ streamUrl, isIframe, name, logo }: LiveVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!isIframe && videoRef.current && streamUrl) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(console.error);
                });

                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(console.error);
                });
            }
        }
    }, [isIframe, streamUrl]);

    if (isIframe) {
        return (
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
                <iframe
                    src={streamUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                />

                {/* Overlay Header */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3">
                        {logo && (
                            <div className="relative w-8 h-8 rounded overflow-hidden bg-black/50">
                                <Image src={logo} alt="" fill className="object-contain" unoptimized />
                            </div>
                        )}
                        <h3 className="text-white font-bold">{name}</h3>
                        <div className="flex items-center gap-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase animate-pulse">
                            Live
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
            <video
                ref={videoRef}
                className="w-full h-full"
                controls
                muted={isMuted}
                playsInline
            />

            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                    {logo && (
                        <div className="relative w-8 h-8 rounded overflow-hidden bg-black/50">
                            <Image src={logo} alt="" fill className="object-contain" unoptimized />
                        </div>
                    )}
                    <h3 className="text-white font-bold">{name}</h3>
                    <div className="flex items-center gap-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase animate-pulse">
                        Live
                    </div>
                </div>
            </div>
        </div>
    );
}

