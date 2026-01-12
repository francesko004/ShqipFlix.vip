"use client";

import { useRef } from "react";
import { MediaItem } from "@/types/tmdb";
import { MovieCard } from "@/components/ui/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentRowProps {
    title: string;
    items: MediaItem[];
    className?: string;
}

export function ContentRow({ title, items, className }: ContentRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!items || items.length === 0) return null;

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section className={className}>
            <div className="flex items-center justify-between mb-4 group/header">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white border-l-4 border-red-600 pl-3 transition-colors group-hover/header:text-red-500">
                    {title}
                </h2>
                <div className="hidden md:flex items-center gap-2 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white touch-target"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white touch-target"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto overflow-y-hidden gap-3 md:gap-4 pb-4 scrollbar-hide snap-x snap-mandatory smooth-scroll"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <div key={item.id} className="flex-none w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px] snap-start">
                        <MovieCard item={item} />
                    </div>
                ))}
            </div>
        </section>
    );
}
