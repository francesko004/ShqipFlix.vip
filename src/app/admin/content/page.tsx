import { prisma } from "@/lib/prisma";
import { ContentTable } from "@/components/admin/ContentTable";
import { Film } from "lucide-react";
import { IngestButton } from "@/components/admin/IngestButton";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
    // Fetch all items (or limit to recently updated if too large, but for now fetch all to allow client search)
    // In a real app with 10k items we would do server-side pagination/search.
    // For <200-500 items, client side is fine and faster.
    const items = await prisma.mediaContent.findMany({
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Film className="w-6 h-6 text-red-500" />
                        Media Content
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage {items.length} titles in your library.
                    </p>
                </div>
                <IngestButton />
            </div>

            <ContentTable items={items} />
        </div>
    );
}
