import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Increase timeout for mass ingestion
export const maxDuration = 300;

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams({
        api_key: TMDB_API_KEY || "",
        language: "en-US",
        ...params,
    }).toString();

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`);
    if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
    return res.json();
}

/**
 * Standardize Media Item
 * Maps Movie/TV specific fields to our schema
 */
function standardizeItem(item: any, type: "movie" | "tv") {
    return {
        id: item.id,
        title: item.title || item.name || "Untitled", // TV uses 'name', Movies use 'title'
        overview: item.overview || "",
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        mediaType: type,
        releaseDate: item.release_date || item.first_air_date, // TV uses 'first_air_date'
        voteAverage: item.vote_average,
        popularity: item.popularity,
        genreIds: item.genre_ids ? JSON.stringify(item.genre_ids) : null,
    };
}

export async function POST(request: Request) {
    if (!TMDB_API_KEY) {
        return NextResponse.json({ error: "TMDB API Key missing" }, { status: 400 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const maxPages = parseInt(searchParams.get("pages") || "50"); // Default to 50 pages per endpoint

        console.log(`Starting mass ingestion with maxPages=${maxPages}...`);

        let count = 0;
        const endpoints = [
            // General Lists
            { url: "/trending/movie/week", type: "movie" as const },
            { url: "/movie/popular", type: "movie" as const },
            { url: "/movie/top_rated", type: "movie" as const },
            { url: "/movie/now_playing", type: "movie" as const },
            { url: "/movie/upcoming", type: "movie" as const },

            { url: "/trending/tv/week", type: "tv" as const },
            { url: "/tv/popular", type: "tv" as const },
            { url: "/tv/top_rated", type: "tv" as const },
            { url: "/tv/on_the_air", type: "tv" as const },
            { url: "/tv/airing_today", type: "tv" as const },

            // Movies by Genre (All Standard Genres)
            { url: "/discover/movie?with_genres=28", type: "movie" as const }, // Action
            { url: "/discover/movie?with_genres=12", type: "movie" as const }, // Adventure
            { url: "/discover/movie?with_genres=16", type: "movie" as const }, // Animation
            { url: "/discover/movie?with_genres=35", type: "movie" as const }, // Comedy
            { url: "/discover/movie?with_genres=80", type: "movie" as const }, // Crime
            { url: "/discover/movie?with_genres=99", type: "movie" as const }, // Documentary
            { url: "/discover/movie?with_genres=18", type: "movie" as const }, // Drama
            { url: "/discover/movie?with_genres=10751", type: "movie" as const }, // Family
            { url: "/discover/movie?with_genres=14", type: "movie" as const }, // Fantasy
            { url: "/discover/movie?with_genres=36", type: "movie" as const }, // History
            { url: "/discover/movie?with_genres=27", type: "movie" as const }, // Horror
            { url: "/discover/movie?with_genres=10402", type: "movie" as const }, // Music
            { url: "/discover/movie?with_genres=9648", type: "movie" as const }, // Mystery
            { url: "/discover/movie?with_genres=10749", type: "movie" as const }, // Romance
            { url: "/discover/movie?with_genres=878", type: "movie" as const }, // Sci-Fi
            { url: "/discover/movie?with_genres=10770", type: "movie" as const }, // TV Movie
            { url: "/discover/movie?with_genres=53", type: "movie" as const }, // Thriller
            { url: "/discover/movie?with_genres=10752", type: "movie" as const }, // War
            { url: "/discover/movie?with_genres=37", type: "movie" as const }, // Western

            // TV by Genre
            { url: "/discover/tv?with_genres=10759", type: "tv" as const }, // Action & Adventure
            { url: "/discover/tv?with_genres=16", type: "tv" as const }, // Animation
            { url: "/discover/tv?with_genres=35", type: "tv" as const }, // Comedy
            { url: "/discover/tv?with_genres=80", type: "tv" as const }, // Crime
            { url: "/discover/tv?with_genres=99", type: "tv" as const }, // Documentary
            { url: "/discover/tv?with_genres=18", type: "tv" as const }, // Drama
            { url: "/discover/tv?with_genres=10751", type: "tv" as const }, // Family
            { url: "/discover/tv?with_genres=10762", type: "tv" as const }, // Kids
            { url: "/discover/tv?with_genres=9648", type: "tv" as const }, // Mystery
            { url: "/discover/tv?with_genres=10763", type: "tv" as const }, // News
            { url: "/discover/tv?with_genres=10764", type: "tv" as const }, // Reality
            { url: "/discover/tv?with_genres=10765", type: "tv" as const }, // Sci-Fi & Fantasy
            { url: "/discover/tv?with_genres=10766", type: "tv" as const }, // Soap
            { url: "/discover/tv?with_genres=10767", type: "tv" as const }, // Talk
            { url: "/discover/tv?with_genres=10768", type: "tv" as const }, // War & Politics
            { url: "/discover/tv?with_genres=37", type: "tv" as const }, // Western
        ];

        // Ingest from each endpoint
        for (const endpoint of endpoints) {
            console.log(`Processing endpoint: ${endpoint.url}`);

            for (let page = 1; page <= maxPages; page++) {
                try {
                    // Add a small delay to avoid hitting rate limits too hard
                    if (page % 5 === 0) await new Promise(r => setTimeout(r, 100));

                    const data = await fetchTMDB(endpoint.url, { page: page.toString() });
                    const items = data.results || [];

                    if (items.length === 0) break; // No more results

                    for (const rawItem of items) {
                        try {
                            const item = standardizeItem(rawItem, endpoint.type);

                            await prisma.mediaContent.upsert({
                                where: { id: item.id },
                                update: {
                                    popularity: item.popularity,
                                    voteAverage: item.voteAverage,
                                    posterPath: item.posterPath,
                                    backdropPath: item.backdropPath,
                                    // Update metadata if it was missing before
                                    genreIds: item.genreIds,
                                },
                                create: item,
                            });
                            count++;
                        } catch (itemError) {
                            // Ignore duplicates or minor errors
                        }
                    }

                    if (page >= data.total_pages) break; // Reached end of results

                } catch (pageError: any) {
                    console.error(`Failed to fetch ${endpoint.url} page ${page}:`, pageError);
                    if (pageError.message?.includes("fetch failed") || pageError.message?.includes("401")) break;
                }
            }
        }

        console.log(`Ingestion complete. Processed ${count} items.`);
        return NextResponse.json({ message: "Ingestion complete", count });
    } catch (error: any) {
        console.error("Ingestion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
