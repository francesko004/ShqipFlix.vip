"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CryptoAddress {
    id: string;
    name: string;
    symbol: string;
    address: string;
    network: string | null;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FormData {
    name: string;
    symbol: string;
    address: string;
    network: string;
}

export default function AdminDonationsPage() {
    const [addresses, setAddresses] = useState<CryptoAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
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
            const res = await fetch("/api/admin/donations");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editingId 
                ? `/api/admin/donations/${editingId}`
                : "/api/admin/donations";
            
            const method = editingId ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchAddresses();
                resetForm();
            } else {
                alert("Failed to save crypto address");
            }
        } catch (error) {
            console.error("Error saving address:", error);
            alert("An error occurred");
        }
    };

    const handleEdit = (address: CryptoAddress) => {
        setEditingId(address.id);
        setFormData({
            name: address.name,
            symbol: address.symbol,
            address: address.address,
            network: address.network || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this crypto address?")) return;

        try {
            const res = await fetch(`/api/admin/donations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                await fetchAddresses();
            } else {
                alert("Failed to delete address");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("An error occurred");
        }
    };

    const toggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            const res = await fetch(`/api/admin/donations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: !currentVisibility }),
            });

            if (res.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", symbol: "", address: "", network: "" });
        setShowForm(false);
        setEditingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold">Crypto Donations</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage cryptocurrency addresses for donations
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    {showForm ? (
                        <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                        </>
                    )}
                </Button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="p-6 bg-white/5 border-white/10">
                    <h3 className="text-xl font-bold mb-4">
                        {editingId ? "Edit Crypto Address" : "Add New Crypto Address"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Currency Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Bitcoin"
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Symbol
                                </label>
                                <input
                                    type="text"
                                    value={formData.symbol}
                                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                    placeholder="e.g., BTC"
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Wallet Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter wallet address"
                                required
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-600 font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Network (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.network}
                                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                                placeholder="e.g., ERC20, BEP20, TRC20"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-600"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="bg-red-600 hover:bg-red-700">
                                <Save className="w-4 h-4 mr-2" />
                                {editingId ? "Update" : "Add"} Address
                            </Button>
                            <Button
                                type="button"
                                onClick={resetForm}
                                className="bg-white/5 hover:bg-white/10"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Addresses List */}
            <div className="space-y-4">
                {addresses.length === 0 ? (
                    <Card className="p-12 text-center bg-white/5 border-white/10">
                        <p className="text-gray-400">No crypto addresses added yet.</p>
                        <p className="text-gray-600 text-sm mt-2">
                            Click &quot;Add Address&quot; to create your first donation address.
                        </p>
                    </Card>
                ) : (
                    addresses.map((addr) => (
                        <Card
                            key={addr.id}
                            className="p-6 bg-white/5 border-white/10 hover:border-red-600/30 transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold">{addr.name}</h3>
                                        <span className="px-2 py-1 bg-red-600/20 text-red-500 text-xs font-bold rounded">
                                            {addr.symbol}
                                        </span>
                                        {addr.network && (
                                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                                                {addr.network}
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-1 text-xs font-bold rounded ${
                                                addr.isVisible
                                                    ? "bg-green-600/20 text-green-400"
                                                    : "bg-gray-600/20 text-gray-400"
                                            }`}
                                        >
                                            {addr.isVisible ? "Visible" : "Hidden"}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 font-mono text-sm break-all">
                                        {addr.address}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                        Added: {new Date(addr.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => toggleVisibility(addr.id, addr.isVisible)}
                                        className="bg-white/5 hover:bg-white/10"
                                        size="sm"
                                    >
                                        {addr.isVisible ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleEdit(addr)}
                                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                                        size="sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(addr.id)}
                                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
