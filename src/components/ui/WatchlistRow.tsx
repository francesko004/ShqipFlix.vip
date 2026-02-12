"use client";

import { useEffect, useState } from "react";
import { MediaItem } from "@/types/tmdb";
import { watchlist } from "@/lib/watchlist";
import { ContentRow } from "@/components/ui/ContentRow";

export function WatchlistRow() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const loadItems = async () => {
            const data = await watchlist.get();
            setItems(data);
        };

        loadItems();

        const handleUpdate = () => {
            loadItems();
        };

        window.addEventListener("watchlist-updated", handleUpdate);
        return () => window.removeEventListener("watchlist-updated", handleUpdate);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <ContentRow title="My List" items={items} />
    );
}
