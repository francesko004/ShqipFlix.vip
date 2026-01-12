export interface MediaItem {
    id: number;
    title?: string;
    name?: string; // For TV shows
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string; // For TV shows
    media_type: "movie" | "tv";
    genre_ids: number[];
    popularity: number;
}

export interface MediaDetails extends MediaItem {
    genres: { id: number; name: string }[];
    runtime?: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
    credits?: {
        cast: CastMember[];
        crew: any[];
    };
    videos?: {
        results: Video[];
    };
    similar?: FetchResponse<MediaItem>;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface FetchResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface Episode {
    id: number;
    name: string;
    overview: string;
    still_path: string | null;
    episode_number: number;
    season_number: number;
    vote_average: number;
}

export interface SeasonDetails {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    episodes: Episode[];
}
