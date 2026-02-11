import { MediaDetails } from "@/types/tmdb";

interface JsonLdProps {
    movie?: MediaDetails;
    tv?: MediaDetails;
}

export function JsonLd({ movie, tv }: JsonLdProps) {
    const item = movie || tv;
    if (!item) return null;

    const type = movie ? "Movie" : "TVSeries";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": type,
        "name": item.title || item.name,
        "description": item.overview,
        "image": item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : undefined,
        "datePublished": item.release_date || item.first_air_date,
        "aggregateRating": item.vote_average
            ? {
                "@type": "AggregateRating",
                "ratingValue": item.vote_average.toFixed(1),
                "bestRating": "10",
                "worstRating": "0",
            }
            : undefined,
        "genre": item.genres?.map((g) => g.name),
        "duration": movie?.runtime ? `PT${movie.runtime}M` : undefined,
        "numberOfSeasons": tv?.number_of_seasons,
        "numberOfEpisodes": tv?.number_of_episodes,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
