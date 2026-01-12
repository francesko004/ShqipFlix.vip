"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Play, Star } from "lucide-react";
import { Episode } from "@/types/tmdb";
import Image from "next/image";

interface EpisodeSelectorProps {
    tvId: number;
    currentSeason: number;
    currentEpisode: number;
    totalSeasons: number;
    episodes: Episode[];
}

export function EpisodeSelector({ tvId, currentSeason, currentEpisode, totalSeasons, episodes }: EpisodeSelectorProps) {
    const [isSeasonOpen, setIsSeasonOpen] = useState(false);
    const [isEpisodeOpen, setIsEpisodeOpen] = useState(false);

    // Generate season options
    const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);

    const currentEpisodeData = episodes.find(e => e.episode_number === currentEpisode);
    const hasNextEpisode = episodes.some(e => e.episode_number === currentEpisode + 1);

    return (
        <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/10">
            <div className="flex flex-col gap-3">
                <span className="text-white font-bold text-sm sm:text-base">Watch:</span>

                {/* Season and Episode Selectors Row */}
                <div className="flex flex-wrap gap-2">
                    {/* Season Selector */}
                    <div className="relative flex-1 min-w-[120px]">
                        <button
                            onClick={() => {
                                setIsSeasonOpen(!isSeasonOpen);
                                setIsEpisodeOpen(false);
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded text-sm flex items-center gap-2 justify-between transition-colors touch-target"
                        >
                            <span className="font-medium">Season {currentSeason}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isSeasonOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isSeasonOpen && (
                            <div className="absolute top-full mt-1 left-0 right-0 sm:right-auto sm:min-w-[140px] bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                                {seasons.map((season) => (
                                    <Link
                                        key={season}
                                        href={`/tv/${tvId}?season=${season}&episode=1`}
                                        onClick={() => setIsSeasonOpen(false)}
                                        className={`block px-4 py-3 sm:py-2 text-sm hover:bg-white/10 active:bg-white/15 transition-colors touch-target ${season === currentSeason ? "bg-red-600/20 text-red-500 font-bold" : "text-white"
                                            }`}
                                    >
                                        Season {season}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Episode Selector */}
                    <div className="relative flex-[2] min-w-[180px]">
                        <button
                            onClick={() => {
                                setIsEpisodeOpen(!isEpisodeOpen);
                                setIsSeasonOpen(false);
                            }}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded text-sm flex items-center gap-2 justify-between transition-colors touch-target"
                        >
                            <span className="truncate font-medium">
                                {currentEpisodeData ? `E${currentEpisode}: ${currentEpisodeData.name}` : `Episode ${currentEpisode}`}
                            </span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isEpisodeOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isEpisodeOpen && (
                            <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-[350px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto z-50 p-2 space-y-1">
                                {episodes.map((episode) => (
                                    <Link
                                        key={episode.id}
                                        href={`/tv/${tvId}?season=${currentSeason}&episode=${episode.episode_number}`}
                                        onClick={() => setIsEpisodeOpen(false)}
                                        className={`flex gap-3 p-2 rounded-lg transition-all border group touch-target ${episode.episode_number === currentEpisode
                                            ? "bg-red-600/20 border-red-600/50"
                                            : "hover:bg-white/5 active:bg-white/10 border-transparent"
                                            }`}
                                    >
                                        <div className="relative w-16 sm:w-20 aspect-video rounded overflow-hidden flex-shrink-0 bg-black/40">
                                            {episode.still_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${episode.still_path}`}
                                                    alt={episode.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">No Img</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Play className="w-4 h-4 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`text-xs font-bold truncate ${episode.episode_number === currentEpisode ? "text-red-500" : "text-white"}`}>
                                                    {episode.episode_number}. {episode.name}
                                                </h4>
                                                {episode.vote_average > 0 && (
                                                    <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                                                        <Star className="w-2.5 h-2.5 fill-current" />
                                                        {episode.vote_average.toFixed(1)}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-tight">
                                                {episode.overview || "No description available."}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Buttons Row */}
                <div className="flex gap-2">
                    <Link
                        href={`/tv/${tvId}?season=${currentSeason}&episode=${Math.max(1, currentEpisode - 1)}`}
                        className={`flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded text-sm font-medium transition-colors text-center touch-target ${currentEpisode === 1 ? "opacity-50 pointer-events-none" : ""
                            }`}
                    >
                        ← Previous
                    </Link>

                    {hasNextEpisode ? (
                        <Link
                            href={`/tv/${tvId}?season=${currentSeason}&episode=${currentEpisode + 1}`}
                            className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded text-sm font-medium transition-colors text-center touch-target"
                        >
                            Next →
                        </Link>
                    ) : currentSeason < totalSeasons ? (
                        <Link
                            href={`/tv/${tvId}?season=${currentSeason + 1}&episode=1`}
                            className="flex-1 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 active:bg-red-600/50 text-red-500 rounded text-sm transition-colors font-bold text-center touch-target"
                        >
                            Season {currentSeason + 1} →
                        </Link>
                    ) : (
                        <button className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded text-sm opacity-50 cursor-not-allowed text-center touch-target">
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
