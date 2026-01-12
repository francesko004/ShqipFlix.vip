"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

interface Genre {
    id: number;
    name: string;
}

interface DiscoveryFiltersProps {
    genres: Genre[];
    type: "movie" | "tv";
}

export function DiscoveryFilters({ genres, type }: DiscoveryFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        const query = createQueryString(name, value);
        router.push(`${pathname}?${query}`);
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    const currentGenre = searchParams.get("genre") || "";
    const currentYear = searchParams.get("year") || "";

    const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

    return (
        <div className="relative z-30">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {(currentGenre || currentYear) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider"
                    >
                        <X className="w-3 h-3" />
                        Clear All
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-2xl bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Genres</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => handleFilterChange("genre", genre.id.toString())}
                                    className={`px-3 py-1.5 rounded text-xs text-left transition-colors ${currentGenre === genre.id.toString()
                                        ? "bg-red-600 text-white font-bold"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Release Year</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleFilterChange("year", year)}
                                    className={`px-2 py-1.5 rounded text-xs text-center transition-colors ${currentYear === year
                                        ? "bg-red-600 text-white font-bold"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
