"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BumperPlayerProps {
    onComplete: () => void;
}

interface BumperAd {
    id: string;
    advertiser: string;
    mediaUrl: string;
    clickUrl?: string;
    duration: number;
}

export function BumperPlayer({ onComplete }: BumperPlayerProps) {
    const [ad, setAd] = useState<BumperAd | null>(null);
    const [countdown, setCountdown] = useState(5);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        // Fetch a random active bumper ad
        fetch("/api/bumper-ads")
            .then((res) => res.json())
            .then((data) => {
                if (data.ad) {
                    setAd(data.ad);
                    setCountdown(data.ad.duration);
                } else {
                    // No ad available, skip
                    onComplete();
                }
            })
            .catch(() => onComplete());
    }, [onComplete]);

    useEffect(() => {
        if (!ad || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Allow skip after 3 seconds
        const skipTimer = setTimeout(() => setCanSkip(true), 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(skipTimer);
        };
    }, [ad, countdown, onComplete]);

    const handleClick = () => {
        if (ad?.clickUrl) {
            // Track click
            fetch("/api/bumper-ads/click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId: ad.id }),
            });
            window.open(ad.clickUrl, "_blank");
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    if (!ad) return null;

    const isVideo = ad.mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            {/* Ad Content */}
            <div className="relative w-full h-full flex items-center justify-center">
                {isVideo ? (
                    <video
                        src={ad.mediaUrl}
                        autoPlay
                        muted
                        className="max-w-full max-h-full object-contain"
                        onClick={handleClick}
                    />
                ) : (
                    <img
                        src={ad.mediaUrl}
                        alt={`Ad by ${ad.advertiser}`}
                        className="max-w-full max-h-full object-contain cursor-pointer"
                        onClick={handleClick}
                    />
                )}

                {/* Countdown & Skip */}
                <div className="absolute top-4 right-4 flex items-center gap-3">
                    <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold">
                        {countdown}s
                    </div>
                    {canSkip && (
                        <Button
                            onClick={handleSkip}
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Kalo
                        </Button>
                    )}
                </div>

                {/* Advertiser Label */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-white text-xs">
                    Reklamë nga {ad.advertiser}
                </div>
            </div>
        </div>
    );
}
