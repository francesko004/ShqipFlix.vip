import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentRow } from "@/components/ui/ContentRow";
import { HeroSection } from "@/components/ui/HeroSection";
import { tmdb } from "@/lib/tmdb";

export default async function NewAndPopularPage() {
    const [
        trending,
        popularMovies,
        popularTV,
        upcoming,
        topRated
    ] = await Promise.all([
        tmdb.getTrending("week").catch(() => null),
        tmdb.getPopularMovies().catch(() => null),
        tmdb.getPopularTV().catch(() => null),
        tmdb.getUpcomingMovies().catch(() => null),
        tmdb.getTopRatedMovies().catch(() => null),
    ]);

    const heroItem = trending?.results[0] || upcoming?.results[0];

    return (
        <main className="min-h-screen bg-[#0b0c15] pb-20 text-white">
            <Navbar />

            {heroItem && <HeroSection item={heroItem} />}

            <div className="container mx-auto px-4 -mt-32 relative z-20 space-y-12">
                <h1 className="text-4xl font-bold text-white mb-8 pt-32 border-b border-white/10 pb-4">New & Popular</h1>
                <ContentRow title="Trending This Week" items={trending?.results || []} />
                <ContentRow title="Coming Soon" items={upcoming?.results || []} />
                <ContentRow title="Popular Movies" items={popularMovies?.results || []} />
                <ContentRow title="Popular TV Shows" items={popularTV?.results || []} />
                <ContentRow title="All-Time Hits" items={topRated?.results || []} />
            </div>

            <Footer />
        </main>
    );
}
