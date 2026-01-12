import { NextRequest, NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "all";
    const time = searchParams.get("time") || "day";

    try {
        let results;
        if (type === "movie") {
            results = await tmdb.getTrendingMovies(time as "day" | "week");
        } else if (type === "tv") {
            results = await tmdb.getTrendingTV(time as "day" | "week");
        } else {
            results = await tmdb.getTrending(time as "day" | "week");
        }
        return NextResponse.json(results);
    } catch (error) {
        console.error("Trending API error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
