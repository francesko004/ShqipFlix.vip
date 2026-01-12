import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET() {
    try {
        const results = await tmdb.getPopularMovies();
        return NextResponse.json(results);
    } catch (error) {
        console.error("Popular Movies API error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
