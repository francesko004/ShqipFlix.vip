import { FetchResponse, MediaItem, MediaDetails, SeasonDetails } from "@/types/tmdb";
import { prisma } from "@/lib/prisma";
import { getMockData } from "@/lib/tmdb-mocks";
import { z } from "zod";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    console.warn("TMDB API Key is missing! functionality will be limited.");
}

// --- Zod Schemas for runtime validation ---
const MediaItemSchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    name: z.string().optional(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
    overview: z.string().default(""),
    vote_average: z.number().default(0),
    release_date: z.string().optional(),
    first_air_date: z.string().optional(),
    media_type: z.enum(["movie", "tv"]).optional(),
    genre_ids: z.array(z.number()).default([]),
    popularity: z.number().default(0),
}).passthrough();

const FetchResponseSchema = z.object({
    page: z.number(),
    results: z.array(MediaItemSchema),
    total_pages: z.number(),
    total_results: z.number(),
}).passthrough();

/**
 * Validates a TMDB list response. Returns parsed data or null on failure.
 */
function validateListResponse(data: unknown): FetchResponse<MediaItem> | null {
    const result = FetchResponseSchema.safeParse(data);
    if (!result.success) {
        console.warn("TMDB response validation failed:", result.error.issues.slice(0, 3));
        return null;
    }
    return result.data as FetchResponse<MediaItem>;
}

export const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
    // 1. Try fetching from DB if API Key is missing or if we want to prefer DB
    if (!TMDB_API_KEY) {
        console.warn(`[DB Mode] Fetching ${endpoint} (No API Key)`);
        const dbResult = await getFromDB<T>(endpoint, params);
        if (dbResult) return dbResult;
        console.warn(`[Mock Mode] DB empty for ${endpoint}, using static mock data`);
        return getMockData<T>(endpoint);
    }

    try {
        const query = new URLSearchParams({
            api_key: TMDB_API_KEY,
            language: "en-US",
            ...params,
        }).toString();

        const res = await fetch(`${BASE_URL}${endpoint}?${query}`, {
            next: { revalidate: 3600 }, // heavily cache
        });

        if (!res.ok) {
            // Mock/DB data fallback if unauthorized (401) or other errors
            if (res.status === 401 || res.status === 404) {
                console.log(`TMDB API ${res.status}: Trying DB fallback`);
                const dbResult = await getFromDB<T>(endpoint, params);
                if (dbResult) return dbResult;
                return getMockData<T>(endpoint);
            }
            throw new Error(`Failed to fetch TMDB data: ${res.statusText}`);
        }

        const rawData = await res.json();

        // Validate list-style responses
        if (rawData?.results !== undefined) {
            const validated = validateListResponse(rawData);
            if (validated) return validated as unknown as T;
            // If validation fails, still return raw data but log warning
            console.warn(`Returning unvalidated response for ${endpoint}`);
        }

        return rawData as T;
    } catch (err) {
        console.error(`TMDB Error fetching ${endpoint}:`, err);
        const dbResult = await getFromDB<T>(endpoint, params);
        if (dbResult) return dbResult;
        return getMockData<T>(endpoint);
    }
};

async function getFromDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    try {
        let where: Record<string, unknown> = { isVisible: true };
        let orderBy: Record<string, string> = { popularity: 'desc' };
        let take = 20;

        // Basic routing logic to map API endpoints to DB queries
        if (endpoint.includes("/movie")) where.mediaType = "movie";
        else if (endpoint.includes("/tv")) where.mediaType = "tv";

        if (endpoint.includes("top_rated")) orderBy = { voteAverage: 'desc' };
        if (endpoint.includes("upcoming")) orderBy = { releaseDate: 'desc' };

        // For discovery/genres
        const genreId = params.with_genres;
        if (genreId) {
            // Since we store genres as a JSON string array "[28, 12]", direct SQL filtering is hard.
            // We fetch a larger batch and filter in memory.
            take = 500;
        }

        const items = await prisma.mediaContent.findMany({
            where,
            orderBy,
            take,
        });

        let filteredItems = items;

        if (genreId) {
            const targetGenre = parseInt(genreId);
            filteredItems = items.filter(item => {
                if (!item.genreIds) return false;
                try {
                    const ids = JSON.parse(item.genreIds) as number[];
                    return ids.includes(targetGenre);
                } catch {
                    return false;
                }
            });
            // Slice back to 20 after filtering
            filteredItems = filteredItems.slice(0, 20);
        }

        if (filteredItems.length === 0) return null;

        // Map DB items back to TMDB format
        const results = filteredItems.map(item => ({
            id: item.id,
            title: item.title,
            name: item.title, // Map title to name for TV compatibility
            poster_path: item.posterPath,
            backdrop_path: item.backdropPath,
            overview: item.overview || "",
            vote_average: item.voteAverage || 0,
            media_type: item.mediaType,
            release_date: item.releaseDate,
            first_air_date: item.releaseDate,
            genre_ids: item.genreIds ? JSON.parse(item.genreIds) : [],
            popularity: item.popularity || 0,
        }));

        return {
            page: 1,
            results,
            total_pages: 1,
            total_results: items.length
        } as unknown as T;
    } catch (e) {
        console.error("DB Fetch Error:", e);
        return null; // Fallback to mock
    }
}

export const tmdb = {
    getTrending: async (timeWindow: "day" | "week" = "day") => {
        return fetchTMDB<FetchResponse<MediaItem>>(`/trending/all/${timeWindow}`);
    },

    getTrendingMovies: async (timeWindow: "day" | "week" = "day") => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>(`/trending/movie/${timeWindow}`);
        if (data?.results) data.results.forEach(item => item.media_type = "movie");
        return data;
    },

    getTrendingTV: async (timeWindow: "day" | "week" = "day") => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>(`/trending/tv/${timeWindow}`);
        if (data?.results) data.results.forEach(item => item.media_type = "tv");
        return data;
    },

    getPopularMovies: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/movie/popular");
        if (data?.results) data.results.forEach(item => item.media_type = "movie");
        return data;
    },

    getNowPlayingMovies: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/movie/now_playing");
        if (data?.results) data.results.forEach(item => item.media_type = "movie");
        return data;
    },

    getUpcomingMovies: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/movie/upcoming");
        if (data?.results) data.results.forEach(item => item.media_type = "movie");
        return data;
    },

    getTopRatedMovies: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/movie/top_rated");
        if (data?.results) data.results.forEach(item => item.media_type = "movie");
        return data;
    },

    getPopularTV: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/tv/popular");
        if (data?.results) data.results.forEach(item => item.media_type = "tv");
        return data;
    },

    getAiringTodayTV: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/tv/airing_today");
        if (data?.results) data.results.forEach(item => item.media_type = "tv");
        return data;
    },

    getOnTheAirTV: async () => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>("/tv/on_the_air");
        if (data?.results) data.results.forEach(item => item.media_type = "tv");
        return data;
    },

    discoverByGenre: async (type: "movie" | "tv", genreId: string) => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>(`/discover/${type}`, { with_genres: genreId });
        if (data?.results) data.results.forEach(item => item.media_type = type);
        return data;
    },

    discover: async (type: "movie" | "tv", options: { genre?: string, year?: string } = {}) => {
        const params: Record<string, string> = {};
        if (options.genre) params.with_genres = options.genre;
        if (options.year) {
            if (type === "movie") params.primary_release_year = options.year;
            else params.first_air_date_year = options.year;
        }
        const data = await fetchTMDB<FetchResponse<MediaItem>>(`/discover/${type}`, params);
        if (data?.results) data.results.forEach(item => item.media_type = type);
        return data;
    },

    getDetails: async (type: "movie" | "tv", id: string) => {
        return fetchTMDB<MediaDetails>(`/${type}/${id}`, { append_to_response: "credits,similar,videos" });
    },

    getSeasonDetails: async (tvId: string, seasonNumber: number) => {
        return fetchTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
    },

    search: async (query: string) => {
        return fetchTMDB<FetchResponse<MediaItem>>("/search/multi", { query });
    },

    getSimilar: async (id: number, type: "movie" | "tv") => {
        const data = await fetchTMDB<FetchResponse<MediaItem>>(`/${type}/${id}/similar`);
        if (data?.results) data.results.forEach(item => item.media_type = type);
        return data;
    },

    getImageUrl: (path: string | null, size: "w500" | "original" = "w500") => {
        if (!path) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23333'%3ENo Image%3C/text%3E%3C/svg%3E";
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }
};
