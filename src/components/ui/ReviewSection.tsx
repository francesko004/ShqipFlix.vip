"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        username: string;
    };
}

interface ReviewSectionProps {
    tmdbId: number;
    mediaType: "movie" | "tv";
}

export function ReviewSection({ tmdbId, mediaType }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [tmdbId, mediaType]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?tmdbId=${tmdbId}&mediaType=${mediaType}`);
            const data = await res.json();
            setReviews(data.reviews || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || rating === 0) return;

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tmdbId, mediaType, rating, comment }),
            });

            if (res.ok) {
                setRating(0);
                setComment("");
                fetchReviews();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Vlerësimet</h2>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(averageRating)
                                            ? "fill-yellow-500 text-yellow-500"
                                            : "text-gray-600"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-400">
                            {averageRating.toFixed(1)} ({reviews.length})
                        </span>
                    </div>
                )}
            </div>

            {session && (
                <form onSubmit={handleSubmit} className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Vlerësimi Juaj
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-gray-600"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Komenti (opsional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                            placeholder="Shkruaj mendimin tënd..."
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || rating === 0}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Duke dërguar..." : "Dërgo Vlerësimin"}
                    </Button>
                </form>
            )}

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nuk ka vlerësime ende. Bëhu i pari që vlerëson!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-bold text-white">{review.user.username}</p>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating
                                                        ? "fill-yellow-500 text-yellow-500"
                                                        : "text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString("sq-AL")}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-gray-300">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
