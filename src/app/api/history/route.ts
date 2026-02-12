import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { tmdbId, title, posterPath, mediaType, progress } = await req.json();

        if (!tmdbId || !title || !mediaType) {
            return NextResponse.json({ message: "Missing data" }, { status: 400 });
        }

        const historyItem = await prisma.historyItem.upsert({
            where: {
                userId_tmdbId_mediaType: {
                    userId: session.user.id,
                    tmdbId: parseInt(tmdbId),
                    mediaType,
                }
            },
            update: {
                lastWatched: new Date(),
                progress: progress || 0,
            },
            create: {
                userId: session.user.id,
                tmdbId: parseInt(tmdbId),
                title,
                posterPath,
                mediaType,
                progress: progress || 0,
            }
        });

        // Track genre interests for movies
        if (mediaType === "movie") {
            (async () => {
                try {
                    const movie = await tmdb.getDetails("movie", tmdbId.toString());
                    if (movie?.genres) {
                        for (const genre of movie.genres) {
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
                    console.error("Failed to update genre interests for movie:", err);
                }
            })();
        }

        return NextResponse.json(historyItem);
    } catch (error) {
        console.error("History POST error:", error);
        return NextResponse.json({ message: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const history = await prisma.historyItem.findMany({
            where: { userId: session.user.id },
            orderBy: { lastWatched: "desc" },
            take: 20,
        });

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
