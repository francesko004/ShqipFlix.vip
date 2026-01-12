const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').filter(Boolean).forEach(line => {
        const [key, ...value] = line.split('=');
        process.env[key] = value.join('=');
    });
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTMDB(endpoint, params = {}) {
    const query = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: "en-US",
        ...params,
    }).toString();

    // Rate limiting: sleep a bit before each request
    await sleep(100);

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`);
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
    return res.json();
}

/**
 * Maps TMDB item to Prisma schema
 */
function standardizeItem(item, type) {
    return {
        id: item.id,
        title: item.title || item.name,
        overview: item.overview || "",
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        mediaType: type,
        releaseDate: item.release_date || item.first_air_date,
        voteAverage: item.vote_average,
        popularity: item.popularity,
        genreIds: item.genre_ids ? JSON.stringify(item.genre_ids) : '[]',
        isVisible: true,
    };
}

async function ingest(type, startPage = 1, endPage = 5) {
    console.log(`Starting ingestion for ${type} (Pages ${startPage}-${endPage})...`);
    let totalIngested = 0;

    for (let page = startPage; page <= endPage; page++) {
        try {
            console.log(`Fetching ${type} page ${page}...`);
            const data = await fetchTMDB(`/${type}/popular`, { page: page.toString() });

            if (!data.results || data.results.length === 0) {
                console.log(`No more results for ${type} at page ${page}. Stopping.`);
                break;
            }

            const items = data.results;

            for (const rawItem of items) {
                try {
                    const item = standardizeItem(rawItem, type);

                    await prisma.mediaContent.upsert({
                        where: { id: item.id },
                        update: {
                            popularity: item.popularity,
                            voteAverage: item.voteAverage,
                            posterPath: item.posterPath,
                            backdropPath: item.backdropPath,
                        },
                        create: item,
                    });
                    totalIngested++;
                } catch (dbErr) {
                    console.error(`Error saving item ${rawItem.id}:`, dbErr.message);
                }
            }

            // Log progress every 10 pages
            if (page % 10 === 0) {
                console.log(`Processed ${page}/${endPage} pages for ${type}. Total so far: ${totalIngested}`);
            }

        } catch (err) {
            console.error(`Error processing page ${page}:`, err.message);
            // Don't break on a single page failure, just continue
        }
    }

    console.log(`Finished ${type} ingestion. Total items: ${totalIngested}`);
}

async function main() {
    if (!TMDB_API_KEY) {
        console.error("Missing NEXT_PUBLIC_TMDB_API_KEY in environment");
        return;
    }

    // Default configuration: 500 pages of each => ~10,000 items total
    const MOVIE_PAGES = 500;
    const TV_PAGES = 500;

    // Allow CLI override: node ingest.js --movies 10 --tv 10
    const args = process.argv.slice(2);
    let moviePages = MOVIE_PAGES;
    let tvPages = TV_PAGES;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--movies') moviePages = parseInt(args[i + 1], 10);
        if (args[i] === '--tv') tvPages = parseInt(args[i + 1], 10);
    }

    console.log(`Plan: Ingest ${moviePages} pages of movies and ${tvPages} pages of TV shows.`);

    if (moviePages > 0) await ingest('movie', 1, moviePages);
    if (tvPages > 0) await ingest('tv', 1, tvPages);

    console.log("Ingestion process complete!");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
