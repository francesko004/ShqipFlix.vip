"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, DownloadCloud } from "lucide-react";
import { toast } from "sonner";

export function IngestButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleIngest = async () => {
        setIsLoading(true);
        toast.info("Starting mass ingestion. This may take a while...");

        try {
            // Trigger ingestion with 50 pages (default)
            // We can make this configurable later if needed
            const res = await fetch("/api/admin/ingest?pages=50", {
                method: "POST",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to ingest");
            }

            const data = await res.json();
            toast.success(`Ingestion complete! Added/Updated ${data.count} items.`);

            // Refresh the page to show new content
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong during ingestion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleIngest}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ingesting...
                </>
            ) : (
                <>
                    <DownloadCloud className="w-4 h-4 mr-2" />
                    Ingest Content
                </>
            )}
        </Button>
    );
}
