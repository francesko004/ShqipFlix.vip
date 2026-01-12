"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-4xl font-bold text-white">Something Went Wrong</h1>
                    <p className="text-gray-400 text-lg">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                    </p>
                </div>

                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-left">
                    <p className="text-sm text-red-400 font-mono break-all">
                        {error.message || "An unknown error occurred"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        onClick={reset}
                        size="lg"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Try Again
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <a href="/">Go Home</a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
