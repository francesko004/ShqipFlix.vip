"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

export function AdBlockWarning() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("adblock-warning-dismissed");
        if (!dismissed) {
            setIsVisible(true);
        }
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem("adblock-warning-dismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4 relative backdrop-blur-sm">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 mr-6">
                    <h3 className="text-yellow-500 font-bold mb-1 text-sm">Ad Blocker Recommended</h3>
                    <p className="text-yellow-200/80 text-xs leading-relaxed">
                        The video provider may display pop-up ads. We highly recommend turning on your ad blocker for the best viewing experience.
                    </p>
                </div>
                <button
                    onClick={dismiss}
                    className="absolute top-2 right-2 p-1.5 text-yellow-500/50 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
