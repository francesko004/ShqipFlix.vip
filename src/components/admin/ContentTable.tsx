"use client";

import { useState } from "react";
import { MediaContent } from "@prisma/client";
import { toggleVisibility, toggleFeatured, deleteMedia } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Star, Trash2, Check, X, Search } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ContentTableProps {
    items: MediaContent[];
}

export function ContentTable({ items: initialItems }: ContentTableProps) {
    const [items, setItems] = useState(initialItems);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState<number | null>(null);

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleVisibility = async (id: number, current: boolean) => {
        setIsLoading(id);
        const res = await toggleVisibility(id, current);
        if (res.success) {
            setItems(items.map(i => i.id === id ? { ...i, isVisible: !current } : i));
            toast.success("Visibility updated");
        } else {
            toast.error("Failed to update visibility");
        }
        setIsLoading(null);
    };

    const handleToggleFeatured = async (id: number, current: boolean) => {
        setIsLoading(id);
        const res = await toggleFeatured(id, current);
        if (res.success) {
            setItems(items.map(i => i.id === id ? { ...i, isFeatured: !current } : i));
            toast.success("Featured status updated");
        } else {
            toast.error("Failed to update featured status");
        }
        setIsLoading(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setIsLoading(id);
        const res = await deleteMedia(id);
        if (res.success) {
            setItems(items.filter(i => i.id !== id));
            toast.success("Item deleted");
        } else {
            toast.error("Failed to delete item");
        }
        setIsLoading(null);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search movies & TV shows..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0b0c15] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
                />
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#0b0c15]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                            <th className="p-4 font-medium">Poster</th>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium text-center">Featured</th>
                            <th className="p-4 font-medium text-center">Visible</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-3">
                                    <div className="h-16 w-12 bg-white/5 rounded-md overflow-hidden relative">
                                        {item.posterPath ? (
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-600">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-white">{item.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.mediaType === "movie" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
                                        {item.mediaType}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                                        disabled={isLoading === item.id}
                                        className={`p-2 rounded-full transition-colors ${item.isFeatured ? "bg-yellow-500/10 text-yellow-500" : "text-gray-600 hover:text-gray-400"}`}
                                    >
                                        <Star className={`w-4 h-4 ${item.isFeatured ? "fill-current" : ""}`} />
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleToggleVisibility(item.id, item.isVisible)}
                                        disabled={isLoading === item.id}
                                        className={`p-2 rounded-full transition-colors ${item.isVisible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                                    >
                                        {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isLoading === item.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredItems.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No content found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
