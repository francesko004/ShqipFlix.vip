"use client";

import { useState, useEffect } from "react";
import { Coffee, Plus, Trash2, Edit2, Check, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Donation {
    id: string;
    donorName: string;
    amount: number;
    message?: string;
    isVisible: boolean;
    donatedAt: string;
}

interface Stats {
    totalAmount: number;
    totalDonors: number;
}

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState<Stats>({ totalAmount: 0, totalDonors: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        donorName: "",
        amount: "",
        message: "",
        donatedAt: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch("/api/admin/donations");
            const data = await response.json();
            setDonations(data.donations || []);
            setStats(data.stats || { totalAmount: 0, totalDonors: 0 });
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { ...formData, id: editingId } : formData;

            const response = await fetch("/api/admin/donations", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ donorName: "", amount: "", message: "", donatedAt: new Date().toISOString().split('T')[0] });
                fetchDonations();
            }
        } catch (error) {
            console.error("Error saving donation:", error);
        }
    };

    const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
        try {
            await fetch("/api/admin/donations", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isVisible: !currentVisible }),
            });
            fetchDonations();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this donation?")) return;
        try {
            await fetch(`/api/admin/donations?id=${id}`, { method: "DELETE" });
            fetchDonations();
        } catch (error) {
            console.error("Error deleting donation:", error);
        }
    };

    const startEdit = (donation: Donation) => {
        setEditingId(donation.id);
        setFormData({
            donorName: donation.donorName,
            amount: donation.amount.toString(),
            message: donation.message || "",
            donatedAt: new Date(donation.donatedAt).toISOString().split('T')[0]
        });
        setIsAdding(true);
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <Coffee className="w-8 h-8 text-orange-500" />
                        Donation Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage supporters and the hall of fame leaderboard.</p>
                </div>
                <Button
                    onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isAdding ? "Cancel" : "Add Donation"}
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-500">${stats.totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
                    <p className="text-gray-400 text-sm">Total Donors</p>
                    <p className="text-3xl font-bold text-orange-500">{stats.totalDonors}</p>
                </div>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">{editingId ? "Edit Donation" : "New Donation Entry"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Donor Name</label>
                            <input
                                type="text"
                                required
                                value={formData.donorName}
                                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="5.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Message (Optional)</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white h-24 focus:outline-none focus:border-red-600"
                            placeholder="Keep up the good work!"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Donated At</label>
                        <input
                            type="date"
                            value={formData.donatedAt}
                            onChange={(e) => setFormData({ ...formData, donatedAt: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            {editingId ? "Update Donation" : "Save Donation"}
                        </Button>
                    </div>
                </form>
            )}

            {/* Donations Table */}
            <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Donor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Visibility</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {donations.map((donation) => (
                                <tr key={donation.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-bold">{donation.donorName}</div>
                                        {donation.message && <div className="text-xs text-gray-500 truncate max-w-xs">{donation.message}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-green-500 font-bold">${donation.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(donation.donatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleVisibility(donation.id, donation.isVisible)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${donation.isVisible ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                                                }`}
                                        >
                                            {donation.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {donation.isVisible ? "Visible" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEdit(donation)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(donation.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No donation entries found. Add your first donor!
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
