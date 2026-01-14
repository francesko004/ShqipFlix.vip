
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState("");

    const runImport = async (mediaType: "movie" | "tv", category: string, totalPages = 20) => {
        setIsLoading(true);
        setCurrentAction(`Importing ${category} ${mediaType}s...`);
        setProgress([]);

        try {
            for (let i = 1; i <= totalPages; i++) {
                setProgress(prev => [`Requesting page ${i}...`, ...prev]);

                const res = await fetch("/api/admin/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mediaType, category, page: i }),
                });

                if (!res.ok) {
                    throw new Error(`Failed on page ${i}`);
                }

                const data = await res.json();
                setProgress(prev => [`✓ Page ${i}: Imported ${data.imported} items`, ...prev]);

                // Small delay to be nice to the API/Server
                await new Promise(r => setTimeout(r, 500));
            }
            setProgress(prev => [`✓ IMPORT COMPLETED`, ...prev]);
        } catch (error) {
            console.error(error);
            setProgress(prev => [`❌ Error: ${error}`, ...prev]);
        } finally {
            setIsLoading(false);
            setCurrentAction("");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mass Content Import</h2>
                    <p className="text-gray-400">Import movies and TV shows from TMDB in bulk.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0b0c15] border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-blue-500" />
                            Movies
                        </CardTitle>
                        <CardDescription>Import popular and top rated movies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => runImport("movie", "popular", 20)}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading && currentAction.includes("Movies") ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Import Popular Movies (20 Pages)
                        </Button>
                        <Button
                            onClick={() => runImport("movie", "top_rated", 20)}
                            disabled={isLoading}
                            className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 hover:text-blue-400"
                        >
                            Import Top Rated Movies (20 Pages)
                        </Button>
                        <Button
                            onClick={() => runImport("movie", "upcoming", 10)}
                            disabled={isLoading}
                            className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 hover:text-blue-400"
                        >
                            Import Upcoming Movies (10 Pages)
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-[#0b0c15] border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-purple-500" />
                            TV Shows
                        </CardTitle>
                        <CardDescription>Import popular and top rated series</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => runImport("tv", "popular", 20)}
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isLoading && currentAction.includes("TV") ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Import Popular TV Shows (20 Pages)
                        </Button>
                        <Button
                            onClick={() => runImport("tv", "top_rated", 20)}
                            disabled={isLoading}
                            className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-500 hover:text-purple-400"
                        >
                            Import Top Rated TV Shows (20 Pages)
                        </Button>
                        <Button
                            onClick={() => runImport("tv", "on_the_air", 10)}
                            disabled={isLoading}
                            className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-500 hover:text-purple-400"
                        >
                            Import On Air TV Shows (10 Pages)
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#0b0c15] border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Import Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-black/40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-1">
                        {progress.length === 0 ? (
                            <p className="text-gray-500 italic">Ready to start...</p>
                        ) : (
                            progress.map((log, idx) => (
                                <div key={idx} className={log.includes("Error") ? "text-red-500" : "text-green-500"}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
