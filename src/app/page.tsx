import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/ui/HeroSlider";
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

  // Get top 5 trending items for hero slider
  const heroItems = trending?.results?.slice(0, 5) || popularMovies?.results?.slice(0, 5) || [];

  return (
    <main className="min-h-screen bg-[#0b0c15] pb-20 text-white">
      <Navbar />

      {heroItems.length > 0 && <HeroSlider items={heroItems} />}

      <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-20 space-y-12">
        <HistoryRow />
        <RecommendationRow />
        <WatchlistRow />
        <ContentRow title="Trending Now" items={trending?.results?.slice(5) || []} />
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
