import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ContentRow } from "@/components/ui/ContentRow";
import { EpisodeSelector } from "@/components/ui/EpisodeSelector";
import { WatchlistButton } from "@/components/ui/WatchlistButton";
import { TrailerButton } from "@/components/ui/TrailerButton";
import { CastRow } from "@/components/ui/CastRow";
import { WatchTracker } from "@/components/ui/WatchTracker";
import { DonationButton } from "@/components/ui/DonationButton";
import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const tv = await tmdb.getDetails("tv", params.id).catch(() => null);

    if (!tv) {
        return {
            title: "TV Show Not Found - ShqipFlix",
        };
    }

    return {
        title: `${tv.name} - Watch on ShqipFlix`,
        description: tv.overview || `Watch ${tv.name} on ShqipFlix. Stream all seasons and episodes.`,
        openGraph: {
            title: tv.name,
            description: tv.overview,
            images: tv.backdrop_path ? [`https://image.tmdb.org/t/p/original${tv.backdrop_path}`] : [],
        },
    };
}

export default async function TVPage({ params, searchParams }: { params: { id: string }, searchParams: { season?: string, episode?: string } }) {
    const tv = await tmdb.getDetails("tv", params.id).catch(() => null);

    if (!tv) return notFound();

    const backdrop = tmdb.getImageUrl(tv.backdrop_path, "original");
    const seasonNumber = parseInt(searchParams.season || "1");
    const episodeNumber = parseInt(searchParams.episode || "1");

    const seasonData = await tmdb.getSeasonDetails(params.id, seasonNumber).catch(() => null);
    const episodes = seasonData?.episodes || [];

    return (
        <main className="min-h-screen bg-[#0b0c15]">
            <Navbar />
            <WatchTracker item={tv} />

            {/* Background/Backdrop */}
            <div className="fixed inset-0 h-[50vh] sm:h-[60vh] z-0">
                <Image
                    src={backdrop}
                    alt={tv.name || "TV Show"}
                    fill
                    className="object-cover opacity-30 blur-sm"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
                    {/* Main Content (Player + Info) */}
                    <div className="lg:col-span-3 space-y-6 sm:space-y-8">
                        <VideoPlayer tmdbId={tv.id} type="tv" season={seasonNumber} episode={episodeNumber} />

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <WatchlistButton item={tv} />
                            <TrailerButton videos={tv.videos?.results || []} />

                            {episodes.length > 0 && (
                                episodeNumber < episodes[episodes.length - 1].episode_number ? (
                                    <Link
                                        href={`/tv/${tv.id}?season=${seasonNumber}&episode=${episodeNumber + 1}`}
                                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-100 shadow-lg shadow-red-900/20 text-sm sm:text-base touch-target"
                                    >
                                        <span>Play Next Episode</span>
                                        <span className="text-xs bg-black/20 px-1 rounded">E{episodeNumber + 1}</span>
                                    </Link>
                                ) : seasonNumber < (tv.number_of_seasons || 1) && (
                                    <Link
                                        href={`/tv/${tv.id}?season=${seasonNumber + 1}&episode=1`}
                                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-100 shadow-lg shadow-red-900/20 text-sm sm:text-base touch-target"
                                    >
                                        <span>Start Season {seasonNumber + 1}</span>
                                        <span className="text-xs bg-black/20 px-1 rounded">S{seasonNumber + 1} E1</span>
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Enhanced Episode Selector */}
                        <EpisodeSelector
                            tvId={tv.id}
                            currentSeason={seasonNumber}
                            currentEpisode={episodeNumber}
                            totalSeasons={tv.number_of_seasons || 1}
                            episodes={episodes}
                        />

                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{tv.name || tv.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                <span>{tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : "N/A"}</span>
                                <span>{tv.number_of_seasons || 0} Seasons</span>
                                <div className="flex flex-wrap gap-2">
                                    {(tv.genres || []).map(g => (
                                        <span key={g.id} className="border border-white/20 px-2 py-0.5 rounded-full text-xs flex items-center">{g.name}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-4xl leading-relaxed">{tv.overview}</p>
                        </div>

                        <CastRow cast={tv.credits?.cast || []} />
                    </div>
                </div>

                <div className="mt-12 sm:mt-14 md:mt-16 bg-[#1a1a2e]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white">Enjoying this series?</h3>
                        <p className="text-gray-400 text-sm">Consider supporting ShqipFlix to help us maintain our servers and add new content.</p>
                    </div>
                    <DonationButton />
                </div>

                <div className="mt-12 sm:mt-14 md:mt-16">
                    <ContentRow title="You May Also Like" items={tv.similar?.results || []} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
