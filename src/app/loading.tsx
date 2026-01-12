import { HeroSkeleton, ContentRowSkeleton } from "@/components/ui/LoadingSkeleton";

export default function RootLoading() {
    return (
        <main className="min-h-screen bg-[#050505]">
            <HeroSkeleton />
            <div className="container mx-auto space-y-8 -mt-32 relative z-20">
                <ContentRowSkeleton />
                <ContentRowSkeleton />
            </div>
        </main>
    );
}
