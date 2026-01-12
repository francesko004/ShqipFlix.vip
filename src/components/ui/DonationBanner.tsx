"use client";

import { useState, useEffect } from "react";
import { X, Coffee, Heart } from "lucide-react";
import { Button } from "./button";

interface DonationBannerProps {
    buyMeCoffeeUrl?: string;
}

export function DonationBanner({ buyMeCoffeeUrl = "https://buymeacoffee.com/shqipflix" }: DonationBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check if user has dismissed the banner
        const dismissed = localStorage.getItem("donation-banner-dismissed");
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        // Show banner if never dismissed or if 7 days have passed
        if (!dismissed || now - dismissedTime > sevenDays) {
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 2000); // Show after 2 seconds
        }
    }, []);

    const handleDismiss = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            localStorage.setItem("donation-banner-dismissed", Date.now().toString());
        }, 300);
    };

    const handleSupport = () => {
        window.open(buyMeCoffeeUrl, "_blank");
        handleDismiss();
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl transition-all duration-300 ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
        >
            <div className="relative bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/95 to-[#0f3460]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-500/10 animate-pulse" />

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
                                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Coffee className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                                Enjoying ShqipFlix?
                                <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                            </h3>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                Help us keep the lights on! Your support helps us maintain and improve ShqipFlix for everyone. Every coffee counts! ☕
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0">
                            <Button
                                onClick={handleSupport}
                                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold px-6 py-6 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                            >
                                <Coffee className="w-5 h-5 mr-2" />
                                Buy Me a Coffee
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />
                </div>
            </div>
        </div>
    );
}
