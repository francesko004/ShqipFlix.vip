"use client";

import { MediaItem } from "@/types/tmdb";

const WATCHLIST_KEY = "shqipflix_watchlist";

export const watchlist = {
    get: (): MediaItem[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(WATCHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    add: (item: MediaItem) => {
        if (typeof window === "undefined") return;
        const current = watchlist.get();
        if (!current.find((i) => i.id === item.id)) {
            const updated = [item, ...current];
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
            window.dispatchEvent(new Event("watchlist-updated"));
        }
    },

    remove: (id: number) => {
        if (typeof window === "undefined") return;
        const current = watchlist.get();
        const updated = current.filter((i) => i.id !== id);
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("watchlist-updated"));
    },

    isInList: (id: number): boolean => {
        if (typeof window === "undefined") return false;
        const current = watchlist.get();
        return current.some((i) => i.id === id);
    },
};
