import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentRow } from "@/components/ui/ContentRow";
import { DiscoveryFilters } from "@/components/ui/DiscoveryFilters";
import { tmdb } from "@/lib/tmdb";

export default async function MoviesPage({ searchParams }: { searchParams: { genre?: string, year?: string } }) {
    const genre = searchParams.genre;
    const year = searchParams.year;
    const isFiltered = genre || year;

    const filteredResults = isFiltered ? await tmdb.discover("movie", { genre, year }).catch(() => null) : null;

    const [
        trending,
        popular,
        nowPlaying,
        upcoming,
        topRated,
        action,
        adventure,
        animation,
        comedy,
        crime,
        documentary,
        drama,
        family,
        fantasy,
        horror,
        mystery,
        romance,
        sciFi,
        thriller,
        war
    ] = await Promise.all([
        tmdb.getTrendingMovies("week").catch(() => null),
        tmdb.getPopularMovies().catch(() => null),
        tmdb.getNowPlayingMovies().catch(() => null),
        tmdb.getUpcomingMovies().catch(() => null),
        tmdb.getTopRatedMovies().catch(() => null),
        tmdb.discoverByGenre("movie", "28").catch(() => null), // Action
        tmdb.discoverByGenre("movie", "12").catch(() => null), // Adventure
        tmdb.discoverByGenre("movie", "16").catch(() => null), // Animation
        tmdb.discoverByGenre("movie", "35").catch(() => null), // Comedy
        tmdb.discoverByGenre("movie", "80").catch(() => null), // Crime
        tmdb.discoverByGenre("movie", "99").catch(() => null), // Documentary
        tmdb.discoverByGenre("movie", "18").catch(() => null), // Drama
        tmdb.discoverByGenre("movie", "10751").catch(() => null), // Family
        tmdb.discoverByGenre("movie", "14").catch(() => null), // Fantasy
        tmdb.discoverByGenre("movie", "27").catch(() => null), // Horror
        tmdb.discoverByGenre("movie", "9648").catch(() => null), // Mystery
        tmdb.discoverByGenre("movie", "10749").catch(() => null), // Romance
        tmdb.discoverByGenre("movie", "87").catch(() => null), // Sci-Fi
        tmdb.discoverByGenre("movie", "53").catch(() => null), // Thriller
        tmdb.discoverByGenre("movie", "10752").catch(() => null), // War
    ]);

    return (
        <main className="min-h-screen bg-[#0b0c15] pb-20 text-white">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Movies</h1>
                        <p className="text-gray-400 max-w-2xl">Discover the latest blockbusters, timeless classics, and hidden gems from every genre.</p>
                    </div>
                </div>

                <DiscoveryFilters
                    type="movie"
                    genres={[
                        { id: 28, name: "Action" },
                        { id: 12, name: "Adventure" },
                        { id: 16, name: "Animation" },
                        { id: 35, name: "Comedy" },
                        { id: 80, name: "Crime" },
                        { id: 99, name: "Documentary" },
                        { id: 18, name: "Drama" },
                        { id: 10751, name: "Family" },
                        { id: 14, name: "Fantasy" },
                        { id: 27, name: "Horror" },
                        { id: 9648, name: "Mystery" },
                        { id: 10749, name: "Romance" },
                        { id: 878, name: "Sci-Fi" },
                        { id: 53, name: "Thriller" },
                        { id: 10752, name: "War" },
                    ]}
                />

                {isFiltered ? (
                    <div className="space-y-12">
                        {filteredResults?.results?.length ? (
                            <ContentRow
                                title={`Results for ${genre ? genres.find(g => g.id.toString() === genre)?.name : ""} ${year || ""}`}
                                items={filteredResults.results}
                            />
                        ) : (
                            <div className="py-20 text-center">
                                <h2 className="text-2xl font-bold text-gray-500">No movies found matching these filters.</h2>
                                <p className="text-gray-600 mt-2">Try adjusting your filters or search for something else.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <ContentRow title="Trending This Week" items={trending?.results || []} />
                        <ContentRow title="Popular Hits" items={popular?.results || []} />
                        <ContentRow title="In Theaters" items={nowPlaying?.results || []} />
                        <ContentRow title="Coming Soon" items={upcoming?.results || []} />
                        <ContentRow title="Action Packed" items={action?.results || []} />
                        <ContentRow title="Epic Adventures" items={adventure?.results || []} />
                        <ContentRow title="Animation Station" items={animation?.results || []} />
                        <ContentRow title="Hilarious Comedies" items={comedy?.results || []} />
                        <ContentRow title="Crime & Underworld" items={crime?.results || []} />
                        <ContentRow title="Gripping Dramas" items={drama?.results || []} />
                        <ContentRow title="Spine-Tingling Horror" items={horror?.results || []} />
                        <ContentRow title="Mind-Bending Sci-Fi" items={sciFi?.results || []} />
                        <ContentRow title="Edge of Your Seat Thrillers" items={thriller?.results || []} />
                        <ContentRow title="Mystery & Suspense" items={mystery?.results || []} />
                        <ContentRow title="Romantic Stories" items={romance?.results || []} />
                        <ContentRow title="Family Favorites" items={family?.results || []} />
                        <ContentRow title="Epic Fantasies" items={fantasy?.results || []} />
                        <ContentRow title="Real Stories (Docs)" items={documentary?.results || []} />
                        <ContentRow title="War & History" items={war?.results || []} />
                        <ContentRow title="All-Time Classics" items={topRated?.results || []} />
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
];
