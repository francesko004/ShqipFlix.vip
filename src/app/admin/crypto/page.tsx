"use client";

import { useState, useEffect } from "react";
import { Wallet, Plus, Trash2, Edit2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CryptoAddress {
    id: string;
    name: string;
    symbol: string;
    address: string;
    network?: string;
    isVisible: boolean;
}

export default function AdminCryptoPage() {
    const [addresses, setAddresses] = useState<CryptoAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
        address: "",
        network: "",
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/admin/crypto");
            const data = await response.json();
            setAddresses(data.addresses || []);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { ...formData, id: editingId } : formData;

            const response = await fetch("/api/admin/crypto", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: "", symbol: "", address: "", network: "" });
                fetchAddresses();
            }
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
        try {
            await fetch("/api/admin/crypto", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isVisible: !currentVisible }),
            });
            fetchAddresses();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await fetch(`/api/admin/crypto?id=${id}`, { method: "DELETE" });
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const startEdit = (addr: CryptoAddress) => {
        setEditingId(addr.id);
        setFormData({
            name: addr.name,
            symbol: addr.symbol,
            address: addr.address,
            network: addr.network || "",
        });
        setIsAdding(true);
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-orange-500" />
                        Crypto Donation Addresses
                    </h1>
                    <p className="text-gray-400 mt-1">Manage the crypto wallets displayed on the support page.</p>
                </div>
                <Button
                    onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isAdding ? "Cancel" : "Add Address"}
                </Button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">{editingId ? "Edit Address" : "New Crypto Address"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Currency Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="Bitcoin"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Symbol</label>
                            <input
                                type="text"
                                required
                                value={formData.symbol}
                                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="BTC"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm text-gray-400">Wallet Address</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600 font-mono"
                                placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm text-gray-400">Network (Optional)</label>
                            <input
                                type="text"
                                value={formData.network}
                                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-600"
                                placeholder="e.g. ERC20, BEP20, SegWit"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            {editingId ? "Update Address" : "Save Address"}
                        </Button>
                    </div>
                </form>
            )}

            {/* Addresses Table */}
            <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Currency</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Symbol</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Network</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Visibility</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {addresses.map((addr) => (
                                <tr key={addr.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-bold">{addr.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-white/10 text-xs font-bold text-white">
                                            {addr.symbol}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-gray-400 break-all max-w-xs">{addr.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {addr.network || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleVisibility(addr.id, addr.isVisible)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${addr.isVisible ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                                                }`}
                                        >
                                            {addr.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {addr.isVisible ? "Visible" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEdit(addr)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(addr.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {addresses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                        No crypto addresses found. Add your first wallet!
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
