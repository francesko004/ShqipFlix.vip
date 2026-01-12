"use client";

import { CastMember } from "@/types/tmdb";
import { tmdb } from "@/lib/tmdb";
import Image from "next/image";

interface CastRowProps {
    cast: CastMember[];
}

export function CastRow({ cast }: CastRowProps) {
    if (!cast || cast.length === 0) return null;

    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
                Top Cast
            </h2>

            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide no-scrollbar">
                {cast.slice(0, 15).map((member) => (
                    <div key={member.id} className="flex-none w-28 md:w-32 group">
                        <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-white/5 mb-2 border border-white/5 group-hover:border-red-600/50 transition-colors">
                            <Image
                                src={tmdb.getImageUrl(member.profile_path, "w500")}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100px, 150px"
                            />
                        </div>
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-red-500 transition-colors">
                            {member.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                            {member.character}
                        </p>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
