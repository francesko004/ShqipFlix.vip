"use client";

import { Wallet } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface DonationButtonProps {
    className?: string;
    variant?: "default" | "floating" | "minimal";
}

export function DonationButton({
    className = "",
    variant = "default",
}: DonationButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push("/support");
    };

    if (variant === "floating") {
        return (
            <button
                onClick={handleClick}
                className={`fixed bottom-6 right-6 z-40 group ${className}`}
                aria-label="Support ShqipFlix"
            >
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />

                    {/* Button */}
                    <div className="relative w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                </div>
            </button>
        );
    }

    if (variant === "minimal") {
        return (
            <button
                onClick={handleClick}
                className={`inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors ${className}`}
            >
                <Wallet className="w-4 h-4" />
                <span>Support Us</span>
            </button>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className={`bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}
        >
            <Wallet className="w-5 h-5 mr-2" />
            Support Us
        </Button>
    );
}
