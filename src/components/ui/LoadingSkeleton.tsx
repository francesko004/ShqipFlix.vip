export function LoadingSkeleton() {
    return (
        <div className="relative overflow-hidden w-full aspect-[2/3] bg-white/5 rounded-lg">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
    );
}

export function ContentRowSkeleton() {
    return (
        <section className="space-y-4 px-4 md:px-8 py-8">
            <div className="h-8 w-48 bg-white/5 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

export function HeroSkeleton() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10 pt-40 md:pt-60">
                <div className="max-w-2xl space-y-6">
                    <div className="h-16 w-3/4 bg-white/5 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                    <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-12 w-32 bg-white/5 rounded"></div>
                        <div className="h-12 w-32 bg-white/5 rounded"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export function DetailSkeleton() {
    return (
        <section className="min-h-screen bg-[#0b0c15]">
            <div className="fixed inset-0 h-[60vh] z-0 bg-white/5 animate-pulse" />
            <div className="container mx-auto px-4 py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-3 space-y-8">
                        {/* Video Player Skeleton */}
                        <div className="aspect-video w-full bg-white/5 rounded-2xl relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex gap-4">
                            <div className="h-12 w-40 bg-white/5 rounded-lg"></div>
                            <div className="h-12 w-40 bg-white/5 rounded-lg"></div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="space-y-4">
                            <div className="h-12 w-1/2 bg-white/5 rounded relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-4 w-16 bg-white/5 rounded"></div>
                                <div className="h-4 w-24 bg-white/5 rounded"></div>
                                <div className="h-4 w-32 bg-white/5 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
