"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);

            // Log if already installed or dismissed
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            if (!isStandalone) {
                // Delay showing to not annoy user immediately
                setTimeout(() => setIsVisible(true), 5000);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // For iOS, check if not in standalone
        if (isIOSDevice && !(window as any).navigator.standalone) {
            setTimeout(() => setIsVisible(true), 5000);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 overflow-hidden relative">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 flex-shrink-0">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold leading-tight">Install ShqipFlix App</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            Add to your home screen for a better streaming experience and faster access.
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    {isIOS ? (
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 text-[11px] text-gray-300">
                            <Share className="w-4 h-4 text-blue-400" />
                            <span>Tap "Share" and then "Add to Home Screen" to install on iOS.</span>
                        </div>
                    ) : (
                        <Button
                            onClick={handleInstallClick}
                            className="w-full bg-red-600 hover:bg-red-700 font-bold rounded-xl h-11 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Install Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
