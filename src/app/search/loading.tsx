import { ContentRowSkeleton } from "@/components/ui/LoadingSkeleton";

export default function SearchLoading() {
    return (
        <main className="min-h-screen bg-[#050505] pt-24">
            <div className="container mx-auto px-4 md:px-8 space-y-8">
                <div className="h-16 w-full max-w-3xl mx-auto bg-white/5 rounded-lg animate-pulse" />
                <div className="pt-12">
                    <ContentRowSkeleton />
                </div>
            </div>
        </main>
    );
}
