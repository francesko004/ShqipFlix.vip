
import { NextResponse } from "next/server";
import { fetchTMDB } from "@/lib/tmdb";
import { prisma } from "@/lib/prisma";
import { MediaItem, FetchResponse } from "@/types/tmdb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mediaType, category, page } = body;

        if (!mediaType || !category || !page) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const endpoint = `/${mediaType}/${category}`;
        const data = await fetchTMDB<FetchResponse<MediaItem>>(endpoint, { page: page.toString() });

        if (!data || !data.results) {
            return NextResponse.json({ error: "Failed to fetch data from TMDB" }, { status: 500 });
        }

        let importedCount = 0;

        for (const item of data.results) {
            // Map TMDB item to Prisma model
            // Note: DB model has 'name' for TV but schema calls it 'title' for both?
            // Let's check schema again. Schema has 'title' field.
            // For TV, TMDB returns 'name'. We should map 'name' to 'title'.

            const title = item.title || item.name || "Untitled";

            await prisma.mediaContent.upsert({
                where: { id: item.id },
                update: {
                    title: title,
                    overview: item.overview,
                    posterPath: item.poster_path,
                    backdropPath: item.backdrop_path,
                    voteAverage: item.vote_average,
                    releaseDate: item.release_date || item.first_air_date,
                    popularity: item.popularity,
                    updatedAt: new Date(),
                },
                create: {
                    id: item.id,
                    title: title,
                    overview: item.overview,
                    posterPath: item.poster_path,
                    backdropPath: item.backdrop_path,
                    mediaType: mediaType,
                    voteAverage: item.vote_average,
                    releaseDate: item.release_date || item.first_air_date,
                    popularity: item.popularity,
                    genreIds: JSON.stringify(item.genre_ids),
                    isVisible: true,
                },
            });
            importedCount++;
        }

        return NextResponse.json({
            success: true,
            imported: importedCount,
            totalPages: data.total_pages
        });

    } catch (error) {
        console.error("Import Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
