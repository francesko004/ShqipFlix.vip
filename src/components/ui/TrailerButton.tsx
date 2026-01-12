"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrailerModal } from "./TrailerModal";
import { Video } from "@/types/tmdb";

interface TrailerButtonProps {
    videos: Video[];
}

export function TrailerButton({ videos }: TrailerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const trailer = videos?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || videos?.[0];

    if (!trailer) return null;

    return (
        <>
            <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base font-bold bg-white/5 hover:bg-white/10 border-white/20 text-white transition-transform hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                <Play className="w-5 h-5" />
                Watch Trailer
            </Button>

            <TrailerModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                videoKey={trailer.key}
            />
        </>
    );
}
