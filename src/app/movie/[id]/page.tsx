import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ContentRow } from "@/components/ui/ContentRow";
import { WatchlistButton } from "@/components/ui/WatchlistButton";
import { TrailerButton } from "@/components/ui/TrailerButton";
import { CastRow } from "@/components/ui/CastRow";
import { WatchTracker } from "@/components/ui/WatchTracker";
import { DonationButton } from "@/components/ui/DonationButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { BackToTop } from "@/components/ui/BackToTop";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { tmdb } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const movie = await tmdb.getDetails("movie", params.id).catch(() => null);

    if (!movie) {
        return {
            title: "Movie Not Found - ShqipFlix",
        };
    }

    return {
        title: `${movie.title} - Watch on ShqipFlix`,
        description: movie.overview || `Watch ${movie.title} on ShqipFlix. Stream in HD quality.`,
        openGraph: {
            title: movie.title,
            description: movie.overview,
            images: movie.backdrop_path ? [`https://image.tmdb.org/t/p/original${movie.backdrop_path}`] : [],
        },
    };
}

export default async function MoviePage({ params }: { params: { id: string } }) {
    const movie = await tmdb.getDetails("movie", params.id).catch(() => null);

    if (!movie) return notFound();

    const backdrop = tmdb.getImageUrl(movie.backdrop_path, "original");

    return (
        <main className="min-h-screen bg-[#0b0c15]">
            <JsonLd movie={movie} />
            <Navbar />
            <WatchTracker item={movie} />

            {/* Background/Backdrop */}
            <div className="fixed inset-0 h-[60vh] z-0">
                <Image
                    src={backdrop}
                    alt={movie.title || "Movie"}
                    fill
                    className="object-cover opacity-30 blur-sm"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content (Player + Info) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <VideoPlayer tmdbId={movie.id} type="movie" />
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <WatchlistButton item={movie} />
                            <TrailerButton videos={movie.videos?.results || []} />
                            <ShareButtons title={movie.title || movie.name || "Movie"} />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white">{movie.title || movie.name}</h1>
                            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
                                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                                <span>{movie.runtime || 0} min</span>
                                <div className="flex flex-wrap gap-2">
                                    {(movie.genres || []).map(g => (
                                        <span key={g.id} className="border border-white/20 px-2 rounded-full text-xs flex items-center">{g.name}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-300 max-w-4xl text-lg leading-relaxed">{movie.overview}</p>
                        </div>

                        <CastRow cast={movie.credits?.cast || []} />
                    </div>
                </div>

                <div className="mt-16">
                    <ReviewSection tmdbId={movie.id} mediaType="movie" />
                </div>

                <div className="mt-16 bg-[#1a1a2e]/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white">Enjoying this movie?</h3>
                        <p className="text-gray-400 text-sm">Support ShqipFlix to help us keep bringing you the best content for free.</p>
                    </div>
                    <DonationButton />
                </div>

                <div className="mt-16">
                    <ContentRow title="You May Also Like" items={movie.similar?.results || []} />
                </div>
            </div>

            <BackToTop />
            <Footer />
        </main>
    );
}
