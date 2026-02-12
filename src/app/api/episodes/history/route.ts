import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tmdb } from "@/lib/tmdb";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { tvId, season, episode } = await req.json();

        if (!tvId || !season || !episode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const history = await prisma.episodeHistory.upsert({
            where: {
                userId_tvId_season_episode: {
                    userId: session.user.id,
                    tvId: parseInt(tvId),
                    season: parseInt(season),
                    episode: parseInt(episode),
                },
            },
            update: {
                watchedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                tvId: parseInt(tvId),
                season: parseInt(season),
                episode: parseInt(episode),
            },
        });

        // Update genre interests asynchronously (don't block the response)
        (async () => {
            try {
                const tv = await tmdb.getDetails("tv", tvId.toString());
                if (tv?.genres) {
                    for (const genre of tv.genres) {
                        await prisma.userGenreInterest.upsert({
                            where: {
                                userId_genreId: {
                                    userId: session.user.id,
                                    genreId: genre.id,
                                },
                            },
                            update: {
                                count: { increment: 1 },
                                updatedAt: new Date(),
                            },
                            create: {
                                userId: session.user.id,
                                genreId: genre.id,
                                count: 1,
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to update genre interests:", err);
            }
        })();

        return NextResponse.json({ success: true, history });
    } catch (error) {
        console.error("Error tracking episode history:", error);
        return NextResponse.json({ error: "Failed to track history" }, { status: 500 });
    }
}
