
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get top 3 genres for the user
        const interests = await prisma.userGenreInterest.findMany({
            where: { userId: session.user.id },
            orderBy: { count: "desc" },
            take: 3,
        });

        if (interests.length === 0) {
            return NextResponse.json({ results: [] });
        }

        // Fetch recommendations for the top genre
        const topGenre = interests[0];
        const data = await tmdb.discoverByGenre("movie", topGenre.genreId.toString());

        // Add genre name if possible (optional)
        const genreNames: Record<number, string> = {
            28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
            99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
            27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
            10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        };

        return NextResponse.json({
            genreId: topGenre.genreId,
            genreName: genreNames[topGenre.genreId] || "Your Favorite Category",
            results: data?.results?.slice(0, 15) || []
        });
    } catch (error) {
        console.error("Recommendations GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
