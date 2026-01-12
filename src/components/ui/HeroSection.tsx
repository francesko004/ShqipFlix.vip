import Link from "next/link";
import Image from "next/image";
import { MediaItem } from "@/types/tmdb";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface HeroSectionProps {
    item: MediaItem;
}

export function HeroSection({ item }: HeroSectionProps) {
    if (!item) return null;

    const title = item.title || item.name;
    const description = item.overview;
    const backdrop = tmdb.getImageUrl(item.backdrop_path, "original");
    const link = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

    return (
        <section className="relative min-h-[60vh] md:min-h-[70vh] lg:h-[85vh] w-full items-center flex overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backdrop}
                    alt={title || "Hero"}
                    fill
                    className="object-cover opacity-50 md:opacity-60 lg:opacity-100"
                    priority
                />
                {/* Responsive Gradients - Stronger on mobile for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/90 md:via-[#0b0c15]/80 lg:via-[#0b0c15]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/50 md:via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20 md:pt-24 lg:pt-20">
                <div className="max-w-3xl space-y-3 md:space-y-4 lg:space-y-6 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-tight drop-shadow-2xl">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-300">
                        {item.popularity > 500 && (
                            <span className="flex items-center gap-1.5 bg-red-600/20 text-red-500 border border-red-600/30 px-2 md:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                Trending Now
                            </span>
                        )}
                        <span className="text-green-500 font-bold drop-shadow-sm">{Math.round((item.vote_average || 0) * 10)}% Match</span>
                        <span>{item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date || "").getFullYear() : "N/A"}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-white uppercase text-[9px] md:text-[10px] tracking-wider">4K Ultra HD</span>
                        <span className="border border-white/40 px-2 py-0.5 rounded text-gray-200 uppercase text-[9px] md:text-[10px]">{item.media_type}</span>
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
        </section>
    );
}

