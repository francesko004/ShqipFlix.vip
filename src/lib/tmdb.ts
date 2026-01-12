import { FetchResponse, MediaItem, MediaDetails, SeasonDetails } from "@/types/tmdb";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    console.warn("TMDB API Key is missing! functionality will be limited.");
}

import { prisma } from "@/lib/prisma";

const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
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

        return res.json();
    } catch (err) {
        console.error(`TMDB Error fetching ${endpoint}:`, err);
        const dbResult = await getFromDB<T>(endpoint, params);
        if (dbResult) return dbResult;
        return getMockData<T>(endpoint);
    }
};

async function getFromDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    try {
        let where: any = { isVisible: true };
        let orderBy: any = { popularity: 'desc' };
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

function getMockData<T>(endpoint: string): T {
    const realMovies: MediaItem[] = [
        { "id": 27205, "title": "Inception", "overview": "This is an epic movie titled Inception. A must watch for everyone who loves cinema.", "poster_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "backdrop_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2010-07-15", "popularity": 100 },
        { "id": 157337, "title": "Interstellar", "overview": "This is an epic movie titled Interstellar. A must watch for everyone who loves cinema.", "poster_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "backdrop_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2014-11-05", "popularity": 99 },
        { "id": 157, "title": "The Dark Knight", "overview": "This is an epic movie titled The Dark Knight. A must watch for everyone who loves cinema.", "poster_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "backdrop_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2008-07-16", "popularity": 98 },
        { "id": 281, "title": "The Shawshank Redemption", "overview": "This is an epic movie titled The Shawshank Redemption. A must watch for everyone who loves cinema.", "poster_path": "/9cq9_original.jpg", "backdrop_path": "/9cq9_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-23", "popularity": 97 },
        { "id": 684, "title": "Pulp Fiction", "overview": "This is an epic movie titled Pulp Fiction. A must watch for everyone who loves cinema.", "poster_path": "/d5Ijy_original.jpg", "backdrop_path": "/d5Ijy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-10", "popularity": 96 },
        { "id": 608, "title": "The Matrix", "overview": "This is an epic movie titled The Matrix. A must watch for everyone who loves cinema.", "poster_path": "/f89_original.jpg", "backdrop_path": "/f89_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-03-30", "popularity": 95 },
        { "id": 19, "title": "Forrest Gump", "overview": "This is an epic movie titled Forrest Gump. A must watch for everyone who loves cinema.", "poster_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "backdrop_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-07-06", "popularity": 94 },
        { "id": 245, "title": "The Godfather", "overview": "This is an epic movie titled The Godfather. A must watch for everyone who loves cinema.", "poster_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "backdrop_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1972-03-14", "popularity": 93 },
        { "id": 558, "title": "Fight Club", "overview": "This is an epic movie titled Fight Club. A must watch for everyone who loves cinema.", "poster_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "backdrop_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-10-15", "popularity": 92 },
        { "id": 816, "title": "Seven", "overview": "This is an epic movie titled Seven. A must watch for everyone who loves cinema.", "poster_path": "/69o_original.jpg", "backdrop_path": "/69o_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1995-09-22", "popularity": 91 },
        { "id": 284, "title": "The Silence of the Lambs", "overview": "This is an epic movie titled The Silence of the Lambs. A must watch for everyone who loves cinema.", "poster_path": "/uS_original.jpg", "backdrop_path": "/uS_original.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1991-02-01", "popularity": 90 },
        { "id": 109, "title": "Gladiator", "overview": "This is an epic movie titled Gladiator. A must watch for everyone who loves cinema.", "poster_path": "/ty_original.jpg", "backdrop_path": "/ty_original.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2000-05-01", "popularity": 89 },
        { "id": 869, "title": "Saving Private Ryan", "overview": "This is an epic movie titled Saving Private Ryan. A must watch for everyone who loves cinema.", "poster_path": "/8G_original.jpg", "backdrop_path": "/8G_original.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1998-07-21", "popularity": 88 },
        { "id": 437, "title": "Schindler's List", "overview": "This is an epic movie titled Schindler's List. A must watch for everyone who loves cinema.", "poster_path": "/sF_original.jpg", "backdrop_path": "/sF_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1993-11-30", "popularity": 87 },
        { "id": 1436, "title": "The Departed", "overview": "This is an epic movie titled The Departed. A must watch for everyone who loves cinema.", "poster_path": "/jy_original.jpg", "backdrop_path": "/jy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-05", "popularity": 86 },
        { "id": 1139, "title": "The Prestige", "overview": "This is an epic movie titled The Prestige. A must watch for everyone who loves cinema.", "poster_path": "/8s_original.jpg", "backdrop_path": "/8s_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-19", "popularity": 85 },
        { "id": 8603, "title": "The Lion King", "overview": "This is an epic movie titled The Lion King. A must watch for everyone who loves cinema.", "poster_path": "/s_original.jpg", "backdrop_path": "/s_original.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-06-23", "popularity": 84 },
        { "id": 324874, "title": "Spider-Man: Into the Spider-Verse", "overview": "This is an epic movie titled Spider-Man: Into the Spider-Verse. A must watch for everyone who loves cinema.", "poster_path": "/ii_original.jpg", "backdrop_path": "/ii_original.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2018-12-06", "popularity": 83 },
        { "id": 299552, "title": "Avengers: Endgame", "overview": "This is an epic movie titled Avengers: Endgame. A must watch for everyone who loves cinema.", "poster_path": "/or_original.jpg", "backdrop_path": "/or_original.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-04-24", "popularity": 82 },
        { "id": 475576, "title": "Joker", "overview": "This is an epic movie titled Joker. A must watch for everyone who loves cinema.", "poster_path": "/ud_original.jpg", "backdrop_path": "/ud_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-10-02", "popularity": 81 },
        { "id": 27225, "title": "Inception 21", "overview": "This is an epic movie titled Inception. A must watch for everyone who loves cinema.", "poster_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "backdrop_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2010-07-15", "popularity": 80 },
        { "id": 157357, "title": "Interstellar 22", "overview": "This is an epic movie titled Interstellar. A must watch for everyone who loves cinema.", "poster_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "backdrop_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2014-11-05", "popularity": 79 },
        { "id": 177, "title": "The Dark Knight 23", "overview": "This is an epic movie titled The Dark Knight. A must watch for everyone who loves cinema.", "poster_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "backdrop_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2008-07-16", "popularity": 78 },
        { "id": 301, "title": "The Shawshank Redemption 24", "overview": "This is an epic movie titled The Shawshank Redemption. A must watch for everyone who loves cinema.", "poster_path": "/9cq9_original.jpg", "backdrop_path": "/9cq9_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-23", "popularity": 77 },
        { "id": 704, "title": "Pulp Fiction 25", "overview": "This is an epic movie titled Pulp Fiction. A must watch for everyone who loves cinema.", "poster_path": "/d5Ijy_original.jpg", "backdrop_path": "/d5Ijy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-10", "popularity": 76 },
        { "id": 628, "title": "The Matrix 26", "overview": "This is an epic movie titled The Matrix. A must watch for everyone who loves cinema.", "poster_path": "/f89_original.jpg", "backdrop_path": "/f89_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-03-30", "popularity": 75 },
        { "id": 39, "title": "Forrest Gump 27", "overview": "This is an epic movie titled Forrest Gump. A must watch for everyone who loves cinema.", "poster_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "backdrop_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-07-06", "popularity": 74 },
        { "id": 265, "title": "The Godfather 28", "overview": "This is an epic movie titled The Godfather. A must watch for everyone who loves cinema.", "poster_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "backdrop_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1972-03-14", "popularity": 73 },
        { "id": 578, "title": "Fight Club 29", "overview": "This is an epic movie titled Fight Club. A must watch for everyone who loves cinema.", "poster_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "backdrop_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-10-15", "popularity": 72 },
        { "id": 836, "title": "Seven 30", "overview": "This is an epic movie titled Seven. A must watch for everyone who loves cinema.", "poster_path": "/69o_original.jpg", "backdrop_path": "/69o_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1995-09-22", "popularity": 71 },
        { "id": 304, "title": "The Silence of the Lambs 31", "overview": "This is an epic movie titled The Silence of the Lambs. A must watch for everyone who loves cinema.", "poster_path": "/uS_original.jpg", "backdrop_path": "/uS_original.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1991-02-01", "popularity": 70 },
        { "id": 129, "title": "Gladiator 32", "overview": "This is an epic movie titled Gladiator. A must watch for everyone who loves cinema.", "poster_path": "/ty_original.jpg", "backdrop_path": "/ty_original.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2000-05-01", "popularity": 69 },
        { "id": 889, "title": "Saving Private Ryan 33", "overview": "This is an epic movie titled Saving Private Ryan. A must watch for everyone who loves cinema.", "poster_path": "/8G_original.jpg", "backdrop_path": "/8G_original.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1998-07-21", "popularity": 68 },
        { "id": 457, "title": "Schindler's List 34", "overview": "This is an epic movie titled Schindler's List. A must watch for everyone who loves cinema.", "poster_path": "/sF_original.jpg", "backdrop_path": "/sF_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1993-11-30", "popularity": 67 },
        { "id": 1456, "title": "The Departed 35", "overview": "This is an epic movie titled The Departed. A must watch for everyone who loves cinema.", "poster_path": "/jy_original.jpg", "backdrop_path": "/jy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-05", "popularity": 66 },
        { "id": 1159, "title": "The Prestige 36", "overview": "This is an epic movie titled The Prestige. A must watch for everyone who loves cinema.", "poster_path": "/8s_original.jpg", "backdrop_path": "/8s_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-19", "popularity": 65 },
        { "id": 8623, "title": "The Lion King 37", "overview": "This is an epic movie titled The Lion King. A must watch for everyone who loves cinema.", "poster_path": "/s_original.jpg", "backdrop_path": "/s_original.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-06-23", "popularity": 64 },
        { "id": 324894, "title": "Spider-Man: Into the Spider-Verse 38", "overview": "This is an epic movie titled Spider-Man: Into the Spider-Verse. A must watch for everyone who loves cinema.", "poster_path": "/ii_original.jpg", "backdrop_path": "/ii_original.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2018-12-06", "popularity": 63 },
        { "id": 299572, "title": "Avengers: Endgame 39", "overview": "This is an epic movie titled Avengers: Endgame. A must watch for everyone who loves cinema.", "poster_path": "/or_original.jpg", "backdrop_path": "/or_original.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-04-24", "popularity": 62 },
        { "id": 475596, "title": "Joker 40", "overview": "This is an epic movie titled Joker. A must watch for everyone who loves cinema.", "poster_path": "/ud_original.jpg", "backdrop_path": "/ud_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-10-02", "popularity": 61 },
        { "id": 27245, "title": "Inception 41", "overview": "This is an epic movie titled Inception. A must watch for everyone who loves cinema.", "poster_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "backdrop_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2010-07-15", "popularity": 60 },
        { "id": 157377, "title": "Interstellar 42", "overview": "This is an epic movie titled Interstellar. A must watch for everyone who loves cinema.", "poster_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "backdrop_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2014-11-05", "popularity": 59 },
        { "id": 197, "title": "The Dark Knight 43", "overview": "This is an epic movie titled The Dark Knight. A must watch for everyone who loves cinema.", "poster_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "backdrop_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2008-07-16", "popularity": 58 },
        { "id": 321, "title": "The Shawshank Redemption 44", "overview": "This is an epic movie titled The Shawshank Redemption. A must watch for everyone who loves cinema.", "poster_path": "/9cq9_original.jpg", "backdrop_path": "/9cq9_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-23", "popularity": 57 },
        { "id": 724, "title": "Pulp Fiction 45", "overview": "This is an epic movie titled Pulp Fiction. A must watch for everyone who loves cinema.", "poster_path": "/d5Ijy_original.jpg", "backdrop_path": "/d5Ijy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-10", "popularity": 56 },
        { "id": 648, "title": "The Matrix 46", "overview": "This is an epic movie titled The Matrix. A must watch for everyone who loves cinema.", "poster_path": "/f89_original.jpg", "backdrop_path": "/f89_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-03-30", "popularity": 55 },
        { "id": 59, "title": "Forrest Gump 47", "overview": "This is an epic movie titled Forrest Gump. A must watch for everyone who loves cinema.", "poster_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "backdrop_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-07-06", "popularity": 54 },
        { "id": 285, "title": "The Godfather 48", "overview": "This is an epic movie titled The Godfather. A must watch for everyone who loves cinema.", "poster_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "backdrop_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1972-03-14", "popularity": 53 },
        { "id": 598, "title": "Fight Club 49", "overview": "This is an epic movie titled Fight Club. A must watch for everyone who loves cinema.", "poster_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "backdrop_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-10-15", "popularity": 52 },
        { "id": 856, "title": "Seven 50", "overview": "This is an epic movie titled Seven. A must watch for everyone who loves cinema.", "poster_path": "/69o_original.jpg", "backdrop_path": "/69o_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1995-09-22", "popularity": 51 },
        { "id": 324, "title": "The Silence of the Lambs 51", "overview": "This is an epic movie titled The Silence of the Lambs. A must watch for everyone who loves cinema.", "poster_path": "/uS_original.jpg", "backdrop_path": "/uS_original.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1991-02-01", "popularity": 50 },
        { "id": 149, "title": "Gladiator 52", "overview": "This is an epic movie titled Gladiator. A must watch for everyone who loves cinema.", "poster_path": "/ty_original.jpg", "backdrop_path": "/ty_original.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2000-05-01", "popularity": 49 },
        { "id": 909, "title": "Saving Private Ryan 53", "overview": "This is an epic movie titled Saving Private Ryan. A must watch for everyone who loves cinema.", "poster_path": "/8G_original.jpg", "backdrop_path": "/8G_original.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1998-07-21", "popularity": 48 },
        { "id": 477, "title": "Schindler's List 54", "overview": "This is an epic movie titled Schindler's List. A must watch for everyone who loves cinema.", "poster_path": "/sF_original.jpg", "backdrop_path": "/sF_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1993-11-30", "popularity": 47 },
        { "id": 1476, "title": "The Departed 55", "overview": "This is an epic movie titled The Departed. A must watch for everyone who loves cinema.", "poster_path": "/jy_original.jpg", "backdrop_path": "/jy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-05", "popularity": 46 },
        { "id": 1179, "title": "The Prestige 56", "overview": "This is an epic movie titled The Prestige. A must watch for everyone who loves cinema.", "poster_path": "/8s_original.jpg", "backdrop_path": "/8s_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-19", "popularity": 45 },
        { "id": 8643, "title": "The Lion King 57", "overview": "This is an epic movie titled The Lion King. A must watch for everyone who loves cinema.", "poster_path": "/s_original.jpg", "backdrop_path": "/s_original.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-06-23", "popularity": 44 },
        { "id": 324914, "title": "Spider-Man: Into the Spider-Verse 58", "overview": "This is an epic movie titled Spider-Man: Into the Spider-Verse. A must watch for everyone who loves cinema.", "poster_path": "/ii_original.jpg", "backdrop_path": "/ii_original.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2018-12-06", "popularity": 43 },
        { "id": 299592, "title": "Avengers: Endgame 59", "overview": "This is an epic movie titled Avengers: Endgame. A must watch for everyone who loves cinema.", "poster_path": "/or_original.jpg", "backdrop_path": "/or_original.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-04-24", "popularity": 42 },
        { "id": 475616, "title": "Joker 60", "overview": "This is an epic movie titled Joker. A must watch for everyone who loves cinema.", "poster_path": "/ud_original.jpg", "backdrop_path": "/ud_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-10-02", "popularity": 41 },
        { "id": 27265, "title": "Inception 61", "overview": "This is an epic movie titled Inception. A must watch for everyone who loves cinema.", "poster_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "backdrop_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2010-07-15", "popularity": 40 },
        { "id": 157397, "title": "Interstellar 62", "overview": "This is an epic movie titled Interstellar. A must watch for everyone who loves cinema.", "poster_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "backdrop_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2014-11-05", "popularity": 39 },
        { "id": 217, "title": "The Dark Knight 63", "overview": "This is an epic movie titled The Dark Knight. A must watch for everyone who loves cinema.", "poster_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "backdrop_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2008-07-16", "popularity": 38 },
        { "id": 341, "title": "The Shawshank Redemption 64", "overview": "This is an epic movie titled The Shawshank Redemption. A must watch for everyone who loves cinema.", "poster_path": "/9cq9_original.jpg", "backdrop_path": "/9cq9_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-23", "popularity": 37 },
        { "id": 744, "title": "Pulp Fiction 65", "overview": "This is an epic movie titled Pulp Fiction. A must watch for everyone who loves cinema.", "poster_path": "/d5Ijy_original.jpg", "backdrop_path": "/d5Ijy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-10", "popularity": 36 },
        { "id": 668, "title": "The Matrix 66", "overview": "This is an epic movie titled The Matrix. A must watch for everyone who loves cinema.", "poster_path": "/f89_original.jpg", "backdrop_path": "/f89_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-03-30", "popularity": 35 },
        { "id": 79, "title": "Forrest Gump 67", "overview": "This is an epic movie titled Forrest Gump. A must watch for everyone who loves cinema.", "poster_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "backdrop_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-07-06", "popularity": 34 },
        { "id": 305, "title": "The Godfather 68", "overview": "This is an epic movie titled The Godfather. A must watch for everyone who loves cinema.", "poster_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "backdrop_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1972-03-14", "popularity": 33 },
        { "id": 618, "title": "Fight Club 69", "overview": "This is an epic movie titled Fight Club. A must watch for everyone who loves cinema.", "poster_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "backdrop_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-10-15", "popularity": 32 },
        { "id": 876, "title": "Seven 70", "overview": "This is an epic movie titled Seven. A must watch for everyone who loves cinema.", "poster_path": "/69o_original.jpg", "backdrop_path": "/69o_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1995-09-22", "popularity": 31 },
        { "id": 344, "title": "The Silence of the Lambs 71", "overview": "This is an epic movie titled The Silence of the Lambs. A must watch for everyone who loves cinema.", "poster_path": "/uS_original.jpg", "backdrop_path": "/uS_original.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1991-02-01", "popularity": 30 },
        { "id": 169, "title": "Gladiator 72", "overview": "This is an epic movie titled Gladiator. A must watch for everyone who loves cinema.", "poster_path": "/ty_original.jpg", "backdrop_path": "/ty_original.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2000-05-01", "popularity": 29 },
        { "id": 929, "title": "Saving Private Ryan 73", "overview": "This is an epic movie titled Saving Private Ryan. A must watch for everyone who loves cinema.", "poster_path": "/8G_original.jpg", "backdrop_path": "/8G_original.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1998-07-21", "popularity": 28 },
        { "id": 497, "title": "Schindler's List 74", "overview": "This is an epic movie titled Schindler's List. A must watch for everyone who loves cinema.", "poster_path": "/sF_original.jpg", "backdrop_path": "/sF_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1993-11-30", "popularity": 27 },
        { "id": 1496, "title": "The Departed 75", "overview": "This is an epic movie titled The Departed. A must watch for everyone who loves cinema.", "poster_path": "/jy_original.jpg", "backdrop_path": "/jy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-05", "popularity": 26 },
        { "id": 1199, "title": "The Prestige 76", "overview": "This is an epic movie titled The Prestige. A must watch for everyone who loves cinema.", "poster_path": "/8s_original.jpg", "backdrop_path": "/8s_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-19", "popularity": 25 },
        { "id": 8663, "title": "The Lion King 77", "overview": "This is an epic movie titled The Lion King. A must watch for everyone who loves cinema.", "poster_path": "/s_original.jpg", "backdrop_path": "/s_original.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-06-23", "popularity": 24 },
        { "id": 324934, "title": "Spider-Man: Into the Spider-Verse 78", "overview": "This is an epic movie titled Spider-Man: Into the Spider-Verse. A must watch for everyone who loves cinema.", "poster_path": "/ii_original.jpg", "backdrop_path": "/ii_original.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2018-12-06", "popularity": 23 },
        { "id": 299612, "title": "Avengers: Endgame 79", "overview": "This is an epic movie titled Avengers: Endgame. A must watch for everyone who loves cinema.", "poster_path": "/or_original.jpg", "backdrop_path": "/or_original.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-04-24", "popularity": 22 },
        { "id": 475636, "title": "Joker 80", "overview": "This is an epic movie titled Joker. A must watch for everyone who loves cinema.", "poster_path": "/ud_original.jpg", "backdrop_path": "/ud_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-10-02", "popularity": 21 },
        { "id": 27285, "title": "Inception 81", "overview": "This is an epic movie titled Inception. A must watch for everyone who loves cinema.", "poster_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "backdrop_path": "/oYuLcIPwsj9S79IuG9RDYQ97B1H.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2010-07-15", "popularity": 20 },
        { "id": 157417, "title": "Interstellar 82", "overview": "This is an epic movie titled Interstellar. A must watch for everyone who loves cinema.", "poster_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "backdrop_path": "/gEU2QniE6EwfVDxCzs25vubp2Nv.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2014-11-05", "popularity": 19 },
        { "id": 237, "title": "The Dark Knight 83", "overview": "This is an epic movie titled The Dark Knight. A must watch for everyone who loves cinema.", "poster_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "backdrop_path": "/qJ2tW6WMUDp9QmSJJhPzuZZeOOz.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2008-07-16", "popularity": 18 },
        { "id": 361, "title": "The Shawshank Redemption 84", "overview": "This is an epic movie titled The Shawshank Redemption. A must watch for everyone who loves cinema.", "poster_path": "/9cq9_original.jpg", "backdrop_path": "/9cq9_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-23", "popularity": 17 },
        { "id": 764, "title": "Pulp Fiction 85", "overview": "This is an epic movie titled Pulp Fiction. A must watch for everyone who loves cinema.", "poster_path": "/d5Ijy_original.jpg", "backdrop_path": "/d5Ijy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-09-10", "popularity": 16 },
        { "id": 688, "title": "The Matrix 86", "overview": "This is an epic movie titled The Matrix. A must watch for everyone who loves cinema.", "poster_path": "/f89_original.jpg", "backdrop_path": "/f89_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-03-30", "popularity": 15 },
        { "id": 99, "title": "Forrest Gump 87", "overview": "This is an epic movie titled Forrest Gump. A must watch for everyone who loves cinema.", "poster_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "backdrop_path": "/arw2vcBveWOvZr6pxyYp6uYvBnV.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-07-06", "popularity": 14 },
        { "id": 325, "title": "The Godfather 88", "overview": "This is an epic movie titled The Godfather. A must watch for everyone who loves cinema.", "poster_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "backdrop_path": "/3bhY7ZHLYp7vU96EWYpKsUvSTbp.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1972-03-14", "popularity": 13 },
        { "id": 638, "title": "Fight Club 89", "overview": "This is an epic movie titled Fight Club. A must watch for everyone who loves cinema.", "poster_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "backdrop_path": "/pB8BN0730BfNP9E9Xp80vpxY6mD.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1999-10-15", "popularity": 12 },
        { "id": 896, "title": "Seven 90", "overview": "This is an epic movie titled Seven. A must watch for everyone who loves cinema.", "poster_path": "/69o_original.jpg", "backdrop_path": "/69o_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1995-09-22", "popularity": 11 },
        { "id": 364, "title": "The Silence of the Lambs 91", "overview": "This is an epic movie titled The Silence of the Lambs. A must watch for everyone who loves cinema.", "poster_path": "/uS_original.jpg", "backdrop_path": "/uS_original.jpg", "vote_average": 8.0, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1991-02-01", "popularity": 10 },
        { "id": 189, "title": "Gladiator 92", "overview": "This is an epic movie titled Gladiator. A must watch for everyone who loves cinema.", "poster_path": "/ty_original.jpg", "backdrop_path": "/ty_original.jpg", "vote_average": 8.1, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2000-05-01", "popularity": 9 },
        { "id": 949, "title": "Saving Private Ryan 93", "overview": "This is an epic movie titled Saving Private Ryan. A must watch for everyone who loves cinema.", "poster_path": "/8G_original.jpg", "backdrop_path": "/8G_original.jpg", "vote_average": 8.2, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1998-07-21", "popularity": 8 },
        { "id": 517, "title": "Schindler's List 94", "overview": "This is an epic movie titled Schindler's List. A must watch for everyone who loves cinema.", "poster_path": "/sF_original.jpg", "backdrop_path": "/sF_original.jpg", "vote_average": 8.3, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1993-11-30", "popularity": 7 },
        { "id": 1516, "title": "The Departed 95", "overview": "This is an epic movie titled The Departed. A must watch for everyone who loves cinema.", "poster_path": "/jy_original.jpg", "backdrop_path": "/jy_original.jpg", "vote_average": 8.4, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-05", "popularity": 6 },
        { "id": 1219, "title": "The Prestige 96", "overview": "This is an epic movie titled The Prestige. A must watch for everyone who loves cinema.", "poster_path": "/8s_original.jpg", "backdrop_path": "/8s_original.jpg", "vote_average": 8.5, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2006-10-19", "popularity": 5 },
        { "id": 8683, "title": "The Lion King 97", "overview": "This is an epic movie titled The Lion King. A must watch for everyone who loves cinema.", "poster_path": "/s_original.jpg", "backdrop_path": "/s_original.jpg", "vote_average": 8.6, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "1994-06-23", "popularity": 4 },
        { "id": 324954, "title": "Spider-Man: Into the Spider-Verse 98", "overview": "This is an epic movie titled Spider-Man: Into the Spider-Verse. A must watch for everyone who loves cinema.", "poster_path": "/ii_original.jpg", "backdrop_path": "/ii_original.jpg", "vote_average": 8.7, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2018-12-06", "popularity": 3 },
        { "id": 299632, "title": "Avengers: Endgame 99", "overview": "This is an epic movie titled Avengers: Endgame. A must watch for everyone who loves cinema.", "poster_path": "/or_original.jpg", "backdrop_path": "/or_original.jpg", "vote_average": 8.8, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-04-24", "popularity": 2 },
        { "id": 475656, "title": "Joker 100", "overview": "This is an epic movie titled Joker. A must watch for everyone who loves cinema.", "poster_path": "/ud_original.jpg", "backdrop_path": "/ud_original.jpg", "vote_average": 8.9, "media_type": "movie", "genre_ids": [28, 12, 18], "release_date": "2019-10-02", "popularity": 1 },
    ];

    const realTV: MediaItem[] = [
        { id: 1396, name: "Breaking Bad", overview: "When Walter White, a New Mexico chemistry teacher...", poster_path: "/ggvCoS9.jpg", backdrop_path: "/ts.jpg", vote_average: 8.9, media_type: "tv", genre_ids: [18, 80], first_air_date: "2008-01-20", popularity: 0 },
        { id: 1399, name: "Game of Thrones", overview: "Seven noble families fight for control of the mythical land of Westeros...", poster_path: "/u3B.jpg", backdrop_path: "/z.jpg", vote_average: 8.4, media_type: "tv", genre_ids: [10765, 18, 10759], first_air_date: "2011-04-17", popularity: 0 },
        { id: 66732, name: "Stranger Things", overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments...", poster_path: "/x.jpg", backdrop_path: "/5.jpg", vote_average: 8.6, media_type: "tv", genre_ids: [10765, 18, 9648], first_air_date: "2016-07-15", popularity: 0 },
        { id: 1402, name: "The Walking Dead", overview: "Sheriff's deputy Rick Grimes awakens from a coma to find a post-apocalyptic world...", poster_path: "/xf.jpg", backdrop_path: "/re.jpg", vote_average: 8.1, media_type: "tv", genre_ids: [10759, 18, 10765], first_air_date: "2010-10-31", popularity: 0 },
    ];

    const castData: Record<number, any[]> = {
        27205: [
            { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo4mEOnuI6y9z76Oat6p97Xm504.jpg" },
            { id: 1100, name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/8O9SqmF7MvI8193_original.jpg" },
            { id: 1158, name: "Elliot Page", character: "Ariadne", profile_path: "/4p_original.jpg" },
            { id: 2524, name: "Tom Hardy", character: "Eames", profile_path: "/yB_original.jpg" }
        ],
        157336: [
            { id: 10297, name: "Matthew McConaughey", character: "Cooper", profile_path: "/e9_original.jpg" },
            { id: 1813, name: "Anne Hathaway", character: "Brand", profile_path: "/7o_original.jpg" },
            { id: 83002, name: "Jessica Chastain", character: "Murph", profile_path: "/v_original.jpg" },
            { id: 3895, name: "Michael Caine", character: "Professor Brand", profile_path: "/9_original.jpg" }
        ],
        1396: [
            { id: 17419, name: "Bryan Cranston", character: "Walter White", profile_path: "/f0_original.jpg" },
            { id: 84497, name: "Aaron Paul", character: "Jesse Pinkman", profile_path: "/4_original.jpg" },
            { id: 34344, name: "Anna Gunn", character: "Skyler White", profile_path: "/h_original.jpg" }
        ]
    };

    const allMedia = [...realMovies, ...realTV];

    if (endpoint.includes("/trending") || endpoint.includes("/popular") || endpoint.includes("/now_playing") || endpoint.includes("/upcoming") || endpoint.includes("/top_rated") || endpoint.includes("/discover")) {
        let results = endpoint.includes("/tv") ? realTV : realMovies;
        if (endpoint.includes("/trending/all")) results = allMedia;

        return {
            page: 1,
            results: results,
            total_pages: 1,
            total_results: results.length
        } as unknown as T;
    }

    if (endpoint.includes("/search")) {
        return {
            page: 1,
            results: allMedia,
            total_pages: 1,
            total_results: allMedia.length
        } as unknown as T;
    }

    // For specific details
    const id = parseInt(endpoint.split("/").pop() || "0");
    const item = allMedia.find(m => m.id === id) || realMovies[0];
    const itemCast = castData[item.id] || [
        { id: 1, name: "Actor One", character: "Main Character", profile_path: null },
        { id: 2, name: "Actor Two", character: "Supporting Character", profile_path: null }
    ];

    return {
        ...item,
        title: item.title || item.name || "Untitled",
        name: item.name || item.title || "Untitled",
        genres: [{ id: 1, name: "Action" }, { id: 2, name: "Drama" }],
        runtime: 148,
        number_of_seasons: 5,
        number_of_episodes: 62,
        credits: {
            cast: itemCast,
            crew: []
        },
        videos: {
            results: [{ id: "1", key: "YoHD9XE_original", name: "Trailer", site: "YouTube", type: "Trailer" }]
        },
        similar: { results: allMedia.slice(0, 5), page: 1, total_pages: 1, total_results: 5 },
        episodes: [
            { id: 101, name: "Pilot", overview: "The first episode...", still_path: null, episode_number: 1, season_number: 1, vote_average: 8.5 },
            { id: 102, name: "The Cat's in the Bag...", overview: "The second episode...", still_path: null, episode_number: 2, season_number: 1, vote_average: 8.7 }
        ]
    } as unknown as T;
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
