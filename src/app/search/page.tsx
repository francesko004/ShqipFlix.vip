import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentRow } from "@/components/ui/ContentRow";
import { tmdb } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || "";
    const results = query ? await tmdb.search(query).catch(() => null) : null;

    return (
        <main className="min-h-screen bg-[#0b0c15] pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 min-h-[60vh]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Search Results</h1>
                    {/* Simple Search Form */}
                    <form action="/search" className="flex gap-2 max-w-md">
                        <input
                            type="text"
                            name="q"
                            placeholder="Search movies & TV..."
                            defaultValue={query}
                            className="flex-1 bg-white/10 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-red-600"
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {query && (
                    <div className="space-y-8">
                        {results?.results?.length ? (
                            <ContentRow title={`Results for "${query}"`} items={results.results} />
                        ) : (
                            <p className="text-gray-400">No results found for {query}</p>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
