import { ContentRowSkeleton } from "@/components/ui/LoadingSkeleton";

export default function TVLoading() {
    return (
        <main className="min-h-screen bg-[#050505] pt-24">
            <div className="container mx-auto px-4 md:px-8 space-y-8">
                <div className="space-y-4">
                    <div className="h-12 w-64 bg-white/5 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                    <div className="h-4 w-96 bg-white/5 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                </div>

                <div className="h-12 w-32 bg-white/5 rounded-lg mb-8"></div>

                <div className="space-y-12">
                    <ContentRowSkeleton />
                    <ContentRowSkeleton />
                </div>
            </div>
        </main>
    );
}
