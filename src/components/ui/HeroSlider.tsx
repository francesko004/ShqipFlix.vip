"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { MediaItem } from "@/types/tmdb";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSliderProps {
    items: MediaItem[];
}

export function HeroSlider({ items }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || items.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, items.length, nextSlide]);

    if (!items || items.length === 0) return null;

    const currentItem = items[currentIndex];
    const title = currentItem.title || currentItem.name;
    const description = currentItem.overview;
    const backdrop = tmdb.getImageUrl(currentItem.backdrop_path, "original");
    const link = currentItem.media_type === "tv" ? `/tv/${currentItem.id}` : `/movie/${currentItem.id}`;

    return (
        <section className="relative min-h-[60vh] md:min-h-[70vh] lg:h-[85vh] w-full items-center flex overflow-hidden">
            {/* Background Image with Transition */}
            <div className="absolute inset-0">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={tmdb.getImageUrl(item.backdrop_path, "original")}
                            alt={item.title || item.name || "Hero"}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
                {/* Responsive Gradients - Stronger on mobile for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/95 md:via-[#0b0c15]/80 lg:via-[#0b0c15]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/60 md:via-transparent to-transparent" />
            </div>

            {/* Navigation Arrows - Hidden on mobile, visible on md+ */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={() => {
                            prevSlide();
                            setIsAutoPlaying(false);
                        }}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => {
                            nextSlide();
                            setIsAutoPlaying(false);
                        }}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20 md:pt-24 lg:pt-20">
                <div className="max-w-3xl space-y-3 md:space-y-4 lg:space-y-6 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-tight drop-shadow-2xl">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-300">
                        {currentItem.popularity > 500 && (
                            <span className="flex items-center gap-1.5 bg-red-600/20 text-red-500 border border-red-600/30 px-2 md:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                Trending Now
                            </span>
                        )}
                        <span className="text-green-500 font-bold drop-shadow-sm">{Math.round((currentItem.vote_average || 0) * 10)}% Match</span>
                        <span>{currentItem.release_date || currentItem.first_air_date ? new Date(currentItem.release_date || currentItem.first_air_date || "").getFullYear() : "N/A"}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-white uppercase text-[9px] md:text-[10px] tracking-wider">4K Ultra HD</span>
                        <span className="border border-white/40 px-2 py-0.5 rounded text-gray-200 uppercase text-[9px] md:text-[10px]">{currentItem.media_type}</span>
                    </div>

                    <p className="text-sm md:text-base lg:text-lg text-gray-200 line-clamp-2 md:line-clamp-3 lg:line-clamp-4 max-w-2xl mx-auto md:mx-0 drop-shadow-md leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 lg:gap-4 pt-2 md:pt-4">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto gap-2 text-sm md:text-base font-bold bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5 transition-transform hover:scale-105 h-11 md:h-12"
                            asChild
                        >
                            <Link href={link}>
                                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Play Now
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="w-full sm:w-auto gap-2 text-sm md:text-base font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-transform hover:scale-105 h-11 md:h-12"
                            asChild
                        >
                            <Link href={link}>
                                <Info className="w-4 h-4 md:w-5 md:h-5" /> More Info
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            {items.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all ${index === currentIndex
                                    ? "w-8 md:w-10 bg-white"
                                    : "w-2 md:w-3 bg-white/50 hover:bg-white/75"
                                } h-1 md:h-1.5 rounded-full`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
