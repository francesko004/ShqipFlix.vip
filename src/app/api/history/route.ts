import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

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
                    userId: (session.user as any).id,
                    tmdbId: parseInt(tmdbId),
                    mediaType,
                }
            },
            update: {
                lastWatched: new Date(),
                progress: progress || 0,
            },
            create: {
                userId: (session.user as any).id,
                tmdbId: parseInt(tmdbId),
                title,
                posterPath,
                mediaType,
                progress: progress || 0,
            }
        });

        return NextResponse.json(historyItem);
    } catch (error) {
        console.error("History error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const history = await prisma.historyItem.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { lastWatched: "desc" },
            take: 20,
        });

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
