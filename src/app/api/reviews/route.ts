import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET reviews for a specific movie/TV show
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tmdbId = parseInt(searchParams.get("tmdbId") || "0");
        const mediaType = searchParams.get("mediaType") || "movie";

        if (!tmdbId) {
            return NextResponse.json({ error: "tmdbId required" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { tmdbId, mediaType },
            include: {
                user: {
                    select: { username: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// POST a new review
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { tmdbId, mediaType, rating, comment } = await req.json();

        if (!tmdbId || !mediaType || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Upsert: update if exists, create if not
        const review = await prisma.review.upsert({
            where: {
                userId_tmdbId_mediaType: {
                    userId: session.user.id,
                    tmdbId,
                    mediaType,
                },
            },
            update: {
                rating,
                comment: comment || null,
            },
            create: {
                userId: session.user.id,
                tmdbId,
                mediaType,
                rating,
                comment: comment || null,
            },
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
