"use client";

import { useState, useEffect } from "react";
import { Tv, Plus, Trash2, Edit2, Eye, EyeOff, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface LiveChannel {
    id: string;
    name: string;
    category: string;
    streamUrl: string;
    isIframe: boolean;
    logo?: string;
    userAgent?: string;
    referer?: string;
    isVisible: boolean;
}

export default function AdminChannelsPage() {
    const [channels, setChannels] = useState<LiveChannel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Sports",
        streamUrl: "",
        isIframe: true,
        logo: "",
        userAgent: "",
        referer: "",
    });

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const response = await fetch("/api/admin/channels");
            const data = await response.json();
            setChannels(data.channels || []);
        } catch (error) {
            console.error("Error fetching channels:", error);
            toast.error("Failed to load channels");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { ...formData, id: editingId } : formData;

            const response = await fetch("/api/admin/channels", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                toast.success(editingId ? "Channel updated" : "Channel added");
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                    name: "",
                    category: "Sports",
                    streamUrl: "",
                    isIframe: true,
                    logo: "",
                    userAgent: "",
                    referer: "",
                });
                fetchChannels();
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to save channel");
            }
        } catch (error) {
            console.error("Error saving channel:", error);
            toast.error("An error occurred");
        }
    };

    const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
        try {
            const response = await fetch("/api/admin/channels", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isVisible: !currentVisible }),
            });
            if (response.ok) {
                fetchChannels();
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this channel?")) return;
        try {
            const response = await fetch(`/api/admin/channels?id=${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Channel deleted");
                fetchChannels();
            }
        } catch (error) {
            console.error("Error deleting channel:", error);
            toast.error("Failed to delete channel");
        }
    };

    const startEdit = (channel: LiveChannel) => {
        setEditingId(channel.id);
        setFormData({
            name: channel.name,
            category: channel.category,
            streamUrl: channel.streamUrl,
            isIframe: channel.isIframe,
            logo: channel.logo || "",
            userAgent: channel.userAgent || "",
            referer: channel.referer || "",
        });
        setIsAdding(true);
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <Tv className="w-8 h-8 text-red-500" />
                        Live Channels
                    </h1>
                    <p className="text-gray-400 mt-1">Manage live TV and sports streaming channels.</p>
                </div>
                <Button
                    onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isAdding ? "Cancel" : "Add Channel"}
                </Button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">{editingId ? "Edit Channel" : "New Live Channel"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Channel Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="e.g. SuperSport 1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                            >
                                <option value="Sports">Sports</option>
                                <option value="News">News</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Movies">Movies</option>
                                <option value="Music">Music</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm text-gray-400">Stream URL (Iframe or Video File)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.streamUrl}
                                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-red-600"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Logo URL (Optional)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-red-600"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-8">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isIframe}
                                    onChange={(e) => setFormData({ ...formData, isIframe: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-300">Use Iframe (embed)</span>
                            </label>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Custom User Agent (Optional)</label>
                            <input
                                type="text"
                                value={formData.userAgent}
                                onChange={(e) => setFormData({ ...formData, userAgent: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="Mozilla/5.0..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Custom Referer (Optional)</label>
                            <input
                                type="text"
                                value={formData.referer}
                                onChange={(e) => setFormData({ ...formData, referer: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">
                            {editingId ? "Update Channel" : "Save Channel"}
                        </Button>
                    </div>
                </form>
            )}

            {/* Channels Table */}
            <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Channel</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Visibility</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {channels.map((channel) => (
                                <tr key={channel.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {channel.logo ? (
                                                <div className="relative w-10 h-10 rounded-lg bg-black/50 p-1 border border-white/10 overflow-hidden">
                                                    <Image src={channel.logo} alt="" fill className="object-contain p-1" unoptimized />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center border border-red-600/20">
                                                    <Tv className="w-5 h-5 text-red-500" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-white font-bold group-hover:text-red-500 transition-colors">{channel.name}</div>
                                                <div className="text-[10px] text-gray-500 truncate max-w-[200px]">{channel.streamUrl}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-xs font-bold text-gray-300">
                                            {channel.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm font-medium">
                                        {channel.isIframe ? (
                                            <span className="text-blue-400 flex items-center gap-1.5"><LinkIcon className="w-3 h-3" /> Iframe</span>
                                        ) : (
                                            <span className="text-purple-400 flex items-center gap-1.5"><Tv className="w-3 h-3" /> Direct</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleVisibility(channel.id, channel.isVisible)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${channel.isVisible ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                                                }`}
                                        >
                                            {channel.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {channel.isVisible ? "Visible" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEdit(channel)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            title="Edit Channel"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(channel.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete Channel"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {channels.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No live channels found. Add your first channel!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
