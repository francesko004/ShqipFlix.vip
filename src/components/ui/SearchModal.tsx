"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    media_type: "movie" | "tv";
    release_date?: string;
    first_air_date?: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = "hidden";
            // Fetch trending suggestions
            const fetchTrending = async () => {
                try {
                    const response = await fetch("/api/trending?type=all&time=day");
                    const data = await response.json();
                    setSuggestions(data.results?.slice(0, 4) || []);
                } catch (error) {
                    console.error("Failed to fetch trending for suggestions:", error);
                }
            };
            fetchTrending();
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (query.trim().length > 2) {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    setResults(data.results?.slice(0, 8) || []);
                } catch (error) {
                    console.error("Search error:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    const handleResultClick = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="container mx-auto px-4 pt-20">
                <div className="max-w-3xl mx-auto">
                    {/* Search Input */}
                    <form onSubmit={handleSubmit} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for movies, TV shows..."
                            className="w-full bg-white/10 border-2 border-white/20 rounded-lg pl-14 pr-14 py-4 text-white text-lg placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </form>

                    {/* Search Results */}
                    {query.trim().length > 2 && (
                        <div className="mt-4 bg-[#1a1a2e] rounded-lg border border-white/10 max-h-[60vh] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                                    <p className="mt-2">Searching...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {results.map((item) => {
                                        const title = item.title || item.name;
                                        const year = new Date(item.release_date || item.first_air_date || "").getFullYear();
                                        const link = `/${item.media_type}/${item.id}`;

                                        return (
                                            <Link
                                                key={`${item.media_type}-${item.id}`}
                                                href={link}
                                                onClick={handleResultClick}
                                                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="relative w-12 h-16 flex-shrink-0 bg-white/5 rounded overflow-hidden">
                                                    {item.poster_path ? (
                                                        <Image
                                                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                                            alt={title || ""}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-medium truncate">{title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                        <span>{year || "N/A"}</span>
                                                        <span className="uppercase text-xs border border-white/20 px-1.5 py-0.5 rounded">
                                                            {item.media_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    <div className="p-4 text-center">
                                        <button
                                            onClick={handleSubmit}
                                            className="text-red-500 hover:text-red-400 font-medium text-sm"
                                        >
                                            View all results →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    No results found for &quot;{query}&quot;
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Suggestions */}
                    {query.trim().length === 0 && (
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Popular Suggestions</h3>
                                <div className="h-px flex-1 bg-white/5 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {suggestions.map((item) => {
                                    const title = item.title || item.name;
                                    const link = `/${item.media_type}/${item.id}`;
                                    return (
                                        <Link
                                            key={`${item.media_type}-${item.id}`}
                                            href={link}
                                            onClick={handleResultClick}
                                            className="group flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-600/30 rounded-xl transition-all duration-300"
                                        >
                                            <div className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                                    alt={title || ""}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                    <Search className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold truncate group-hover:text-red-500 transition-colors">{title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-white/5 rounded">
                                                        {item.media_type}
                                                    </p>
                                                    <span className="text-gray-500 text-[10px]">{item.release_date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
