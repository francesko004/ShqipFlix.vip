import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentRow } from "@/components/ui/ContentRow";
import { tmdb } from "@/lib/tmdb";
import { BackToTop } from "@/components/ui/BackToTop";

const MOVIE_GENRES = [
    { id: 28, name: "Action", slug: "action" },
    { id: 12, name: "Adventure", slug: "adventure" },
    { id: 16, name: "Animation", slug: "animation" },
    { id: 35, name: "Comedy", slug: "comedy" },
    { id: 80, name: "Crime", slug: "crime" },
    { id: 99, name: "Documentary", slug: "documentary" },
    { id: 18, name: "Drama", slug: "drama" },
    { id: 10751, name: "Family", slug: "family" },
    { id: 14, name: "Fantasy", slug: "fantasy" },
    { id: 36, name: "History", slug: "history" },
    { id: 27, name: "Horror", slug: "horror" },
    { id: 10402, name: "Music", slug: "music" },
    { id: 9648, name: "Mystery", slug: "mystery" },
    { id: 10749, name: "Romance", slug: "romance" },
    { id: 878, name: "Sci-Fi", slug: "sci-fi" },
    { id: 10770, name: "TV Movie", slug: "tv-movie" },
    { id: 53, name: "Thriller", slug: "thriller" },
    { id: 10752, name: "War", slug: "war" },
    { id: 37, name: "Western", slug: "western" },
];

export default async function GenresPage() {
    // Fetch popular movies for some variety if needed, but the main focus is categories
    return (
        <main className="min-h-screen bg-[#0b0c15] text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 sm:py-32">
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse by Genre</h1>
                    <p className="text-gray-400 text-lg">Explore our library of movies and TV shows by category.</p>
                </header>

                <div className="space-y-16">
                    {MOVIE_GENRES.map(async (genre) => {
                        const data = await tmdb.discoverByGenre("movie", genre.id.toString());
                        const items = data?.results || [];

                        if (items.length === 0) return null;

                        return (
                            <ContentRow
                                key={genre.id}
                                title={genre.name}
                                items={items}
                            // link={`/genres/${genre.slug}`} // Future improvement: dedicated genre filter page
                            />
                        );
                    })}
                </div>
            </div>

            <BackToTop />
            <Footer />
        </main>
    );
}
