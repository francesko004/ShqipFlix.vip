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

        const { tmdbId, title, posterPath, mediaType } = await req.json();

        const watchlistItem = await prisma.watchlistItem.create({
            data: {
                userId: (session.user as any).id,
                tmdbId: parseInt(tmdbId),
                title,
                posterPath,
                mediaType,
            }
        });

        return NextResponse.json(watchlistItem);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { tmdbId, mediaType } = await req.json();

        await prisma.watchlistItem.delete({
            where: {
                userId_tmdbId_mediaType: {
                    userId: (session.user as any).id,
                    tmdbId: parseInt(tmdbId),
                    mediaType,
                }
            }
        });

        return NextResponse.json({ message: "Removed from watchlist" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json([]);
        }

        const list = await prisma.watchlistItem.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(list);
    } catch (error) {
        return NextResponse.json([]);
    }
}
