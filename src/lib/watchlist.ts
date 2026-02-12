"use client";

import { MediaItem } from "@/types/tmdb";

/**
 * Watchlist utility that interacts with the backend API.
 * This replaces the previous localStorage implementation to ensure
 * consistency across devices and sessions.
 */
export const watchlist = {
    /**
     * Fetches the user's watchlist from the server.
     */
    get: async (): Promise<MediaItem[]> => {
        try {
            const res = await fetch("/api/watchlist");
            if (!res.ok) return [];
            const data = await res.json();

            // Map DB items (WatchlistItem) to TMDB format (MediaItem)
            return data.map((item: any) => ({
                id: item.tmdbId,
                title: item.title,
                name: item.title, // For TV compatibility
                poster_path: item.posterPath,
                media_type: item.mediaType,
            }));
        } catch (error) {
            console.error("Failed to fetch watchlist:", error);
            return [];
        }
    },

    /**
     * Adds an item to the user's watchlist on the server.
     */
    add: async (item: MediaItem) => {
        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tmdbId: item.id,
                    title: item.title || item.name,
                    posterPath: item.poster_path,
                    mediaType: item.media_type,
                }),
            });

            if (res.ok) {
                window.dispatchEvent(new Event("watchlist-updated"));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to add to watchlist:", error);
            return false;
        }
    },

    /**
     * Removes an item from the user's watchlist on the server.
     */
    remove: async (tmdbId: number, mediaType: string) => {
        try {
            const res = await fetch("/api/watchlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tmdbId, mediaType }),
            });

            if (res.ok) {
                window.dispatchEvent(new Event("watchlist-updated"));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to remove from watchlist:", error);
            return false;
        }
    },

    /**
     * Checks if an item is in the user's watchlist.
     * Note: This still fetches the whole list, which is fine for small lists.
     */
    isInList: async (tmdbId: number, mediaType: string): Promise<boolean> => {
        const list = await watchlist.get();
        return list.some((i) => i.id === tmdbId && i.media_type === mediaType);
    },
};
