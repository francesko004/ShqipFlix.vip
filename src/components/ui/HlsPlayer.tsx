"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";

interface HlsPlayerProps {
    src: string;
    poster?: string;
    onComplete?: () => void;
    onProgress?: (progress: number) => void;
}


export function HlsPlayer({ src, poster, onComplete, onProgress }: HlsPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Auto play if needed
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        }

        const handleTimeUpdate = () => {
            const currentProgress = (video.currentTime / video.duration) * 100;
            setProgress(currentProgress);

            if (onProgress) {
                onProgress(currentProgress);
            }

            if (video.ended && onComplete) {
                onComplete();
            }
        };


        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        return () => {
            if (hls) hls.destroy();
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [src, onComplete]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(parseFloat(e.target.value));
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
            else if ((videoRef.current as any).webkitRequestFullscreen) (videoRef.current as any).webkitRequestFullscreen();
            else if ((videoRef.current as any).msRequestFullscreen) (videoRef.current as any).msRequestFullscreen();
        }
    };

    return (
        <div
            className="relative group bg-black w-full h-full"
            onMouseEnter={() => setIsControlsVisible(true)}
            onMouseLeave={() => setIsControlsVisible(false)}
        >
            <video
                ref={videoRef}
                poster={poster}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                playsInline
            />

            {/* Custom Controls */}
            <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0"}`}>
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 accent-red-600 rounded-lg cursor-pointer mb-4"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setVolume(v);
                                    if (videoRef.current) videoRef.current.volume = v;
                                    setIsMuted(v === 0);
                                }}
                                className="w-20 h-1 bg-white/20 accent-white rounded-lg cursor-pointer hidden sm:block"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-red-500 transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={handleFullscreen} className="text-white hover:text-red-500 transition-colors">
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
