import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { ContentRow } from "@/components/ui/ContentRow";
import { WatchlistRow } from "@/components/ui/WatchlistRow";
import { HistoryRow } from "@/components/ui/HistoryRow";
import { RecommendationRow } from "@/components/ui/RecommendationRow";
import { tmdb } from "@/lib/tmdb";

export default async function Home() {
  const [
    trending,
    trendingMovies,
    trendingTV,
    nowPlaying,
    upcoming,
    popularMovies,
    topRated,
    popularTV,
    actionMovies,
    animationMovies
  ] = await Promise.all([
    tmdb.getTrending("day").catch(() => null),
    tmdb.getTrendingMovies("week").catch(() => null),
    tmdb.getTrendingTV("week").catch(() => null),
    tmdb.getNowPlayingMovies().catch(() => null),
    tmdb.getUpcomingMovies().catch(() => null),
    tmdb.getPopularMovies().catch(() => null),
    tmdb.getTopRatedMovies().catch(() => null),
    tmdb.getPopularTV().catch(() => null),
    tmdb.discoverByGenre("movie", "28").catch(() => null), // Action
    tmdb.discoverByGenre("movie", "16").catch(() => null), // Animation
  ]);

  const heroItem = trending?.results[0] || popularMovies?.results[0];

  return (
    <main className="min-h-screen bg-[#0b0c15] pb-20 text-white">
      <Navbar />

      {heroItem && <HeroSection item={heroItem} />}

      <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-20 space-y-12">
        <HistoryRow />
        <RecommendationRow />
        <WatchlistRow />
        <ContentRow title="Trending Now" items={trending?.results?.slice(1) || []} />
        <ContentRow title="Trending Movies" items={trendingMovies?.results || []} />
        <ContentRow title="Trending TV Shows" items={trendingTV?.results || []} />
        <ContentRow title="Now Playing" items={nowPlaying?.results || []} />
        <ContentRow title="Upcoming Movies" items={upcoming?.results || []} />
        <ContentRow title="Action Packed" items={actionMovies?.results || []} />
        <ContentRow title="Animation Hits" items={animationMovies?.results || []} />
        <ContentRow title="Popular TV Shows" items={popularTV?.results || []} />
        <ContentRow title="Top Rated Classics" items={topRated?.results || []} />
        <ContentRow title="All Popular" items={popularMovies?.results || []} />
      </div>

      <Footer />
    </main>
  );
}
