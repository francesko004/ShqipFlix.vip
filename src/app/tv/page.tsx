import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentRow } from "@/components/ui/ContentRow";
import { DiscoveryFilters } from "@/components/ui/DiscoveryFilters";
import { tmdb } from "@/lib/tmdb";

export default async function TVShowsPage({ searchParams }: { searchParams: { genre?: string, year?: string } }) {
    const genre = searchParams.genre;
    const year = searchParams.year;
    const isFiltered = genre || year;

    const filteredResults = isFiltered ? await tmdb.discover("tv", { genre, year }).catch(() => null) : null;

    const [
        trending,
        popular,
        airingToday,
        onTheAir,
        topRated,
        actionAdventure,
        animation,
        comedy,
        crime,
        documentary,
        drama,
        family,
        kids,
        mystery,
        reality,
        sciFiFantasy,
        soap,
        warPolitics
    ] = await Promise.all([
        tmdb.getTrendingTV("week").catch(() => null),
        tmdb.getPopularTV().catch(() => null),
        tmdb.getAiringTodayTV().catch(() => null),
        tmdb.getOnTheAirTV().catch(() => null),
        tmdb.getTopRatedMovies().catch(() => null), // Using movie top rated as a fallback or if search/tv/top_rated existed
        tmdb.discoverByGenre("tv", "10759").catch(() => null), // Action & Adventure
        tmdb.discoverByGenre("tv", "16").catch(() => null), // Animation
        tmdb.discoverByGenre("tv", "35").catch(() => null), // Comedy
        tmdb.discoverByGenre("tv", "80").catch(() => null), // Crime
        tmdb.discoverByGenre("tv", "99").catch(() => null), // Documentary
        tmdb.discoverByGenre("tv", "18").catch(() => null), // Drama
        tmdb.discoverByGenre("tv", "10751").catch(() => null), // Family
        tmdb.discoverByGenre("tv", "10762").catch(() => null), // Kids
        tmdb.discoverByGenre("tv", "9648").catch(() => null), // Mystery
        tmdb.discoverByGenre("tv", "10764").catch(() => null), // Reality
        tmdb.discoverByGenre("tv", "10765").catch(() => null), // Sci-Fi & Fantasy
        tmdb.discoverByGenre("tv", "10766").catch(() => null), // Soap
        tmdb.discoverByGenre("tv", "10768").catch(() => null), // War & Politics
    ]);

    return (
        <main className="min-h-screen bg-[#0b0c15] pb-20 text-white">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">TV Shows</h1>
                        <p className="text-gray-400 max-w-2xl">Binge-worthy series, reality favorites, and compelling documentaries from around the globe.</p>
                    </div>
                </div>

                <DiscoveryFilters
                    type="tv"
                    genres={[
                        { id: 10759, name: "Action & Adventure" },
                        { id: 16, name: "Animation" },
                        { id: 35, name: "Comedy" },
                        { id: 80, name: "Crime" },
                        { id: 99, name: "Documentary" },
                        { id: 18, name: "Drama" },
                        { id: 10751, name: "Family" },
                        { id: 10762, name: "Kids" },
                        { id: 9648, name: "Mystery" },
                        { id: 10764, name: "Reality" },
                        { id: 10765, name: "Sci-Fi & Fantasy" },
                        { id: 10766, name: "Soap" },
                        { id: 10767, name: "Talk" },
                        { id: 10768, name: "War & Politics" },
                    ]}
                />

                {isFiltered ? (
                    <div className="space-y-12">
                        {filteredResults?.results?.length ? (
                            <ContentRow
                                title={`Results for ${genre ? tvGenres.find(g => g.id.toString() === genre)?.name : ""} ${year || ""}`}
                                items={filteredResults.results}
                            />
                        ) : (
                            <div className="py-20 text-center">
                                <h2 className="text-2xl font-bold text-gray-500">No TV shows found matching these filters.</h2>
                                <p className="text-gray-600 mt-2">Try adjusting your filters or search for something else.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <ContentRow title="Trending This Week" items={trending?.results || []} />
                        <ContentRow title="Airing Today" items={airingToday?.results || []} />
                        <ContentRow title="Currently On Air" items={onTheAir?.results || []} />
                        <ContentRow title="Popular TV Shows" items={popular?.results || []} />
                        <ContentRow title="Action & Adventure" items={actionAdventure?.results || []} />
                        <ContentRow title="Sci-Fi & Fantasy" items={sciFiFantasy?.results || []} />
                        <ContentRow title="Gripping Dramas" items={drama?.results || []} />
                        <ContentRow title="Animation Station" items={animation?.results || []} />
                        <ContentRow title="Comedy Hits" items={comedy?.results || []} />
                        <ContentRow title="Crime & Mystery" items={crime?.results || []} />
                        <ContentRow title="Reality TV" items={reality?.results || []} />
                        <ContentRow title="Family & Kids" items={family?.results || []} />
                        <ContentRow title="Mystery & Suspense" items={mystery?.results || []} />
                        <ContentRow title="Real Life (Docs)" items={documentary?.results || []} />
                        <ContentRow title="Political & War" items={warPolitics?.results || []} />
                        <ContentRow title="Soaps" items={soap?.results || []} />
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

const tvGenres = [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
];
