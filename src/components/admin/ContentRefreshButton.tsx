"use client";

import { useState } from "react";
import { Film, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Using sonner for better notifications

export function ContentRefreshButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Ingesting content from TMDB...");

        try {
            const res = await fetch("/api/admin/ingest", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                toast.success(`Broadcasting Complete! Added/Updated ${data.count} items.`, {
                    id: toastId,
                    description: "Movies and TV Shows have been synced to your database."
                });
            } else {
                toast.error(`Ingestion Failed: ${data.error}`, { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to connect to ingestion API.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-white/5 border-white/10 h-12 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 group relative overflow-hidden"
            onClick={handleRefresh}
            disabled={isLoading}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            ) : (
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            )}

            <span className={isLoading ? "text-red-500 font-medium" : ""}>
                {isLoading ? "Ingesting Media..." : "Sync TMDB Content"}
            </span>
        </Button>
    );
}
