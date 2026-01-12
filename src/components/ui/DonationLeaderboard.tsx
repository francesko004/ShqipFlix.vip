"use client";

import { useEffect, useState } from "react";
import { Trophy, Heart, Coffee } from "lucide-react";

interface Donation {
    id: string;
    donorName: string;
    amount: number;
    message?: string;
    donatedAt: string;
}

interface DonationStats {
    totalAmount: number;
    totalDonors: number;
}

export function DonationLeaderboard() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState<DonationStats>({ totalAmount: 0, totalDonors: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch("/api/donations");
            const data = await response.json();
            setDonations(data.donations || []);
            setStats(data.stats || { totalAmount: 0, totalDonors: 0 });
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getPodiumColor = (index: number) => {
        switch (index) {
            case 0:
                return "from-yellow-500 to-yellow-600"; // Gold
            case 1:
                return "from-gray-300 to-gray-400"; // Silver
            case 2:
                return "from-orange-600 to-orange-700"; // Bronze
            default:
                return "from-red-600 to-red-700";
        }
    };

    const getPodiumIcon = (index: number) => {
        switch (index) {
            case 0:
                return "🥇";
            case 1:
                return "🥈";
            case 2:
                return "🥉";
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/10 rounded w-1/3 mx-auto" />
                    <div className="h-64 bg-white/10 rounded" />
                </div>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8">
                <div className="text-center space-y-4">
                    <Coffee className="w-16 h-16 text-gray-500 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-400">No donations yet</h3>
                    <p className="text-gray-500">Be the first to support ShqipFlix!</p>
                </div>
            </div>
        );
    }

    const topThree = donations.slice(0, 3);
    const remaining = donations.slice(3);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Raised</p>
                            <p className="text-2xl font-bold text-white">{formatAmount(stats.totalAmount)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                            <Coffee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Supporters</p>
                            <p className="text-2xl font-bold text-white">{stats.totalDonors}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            {topThree.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Top Supporters
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topThree.map((donation, index) => (
                            <div
                                key={donation.id}
                                className="relative group"
                                style={{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }}
                            >
                                <div className="relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                    {/* Rank Badge */}
                                    <div className="absolute -top-3 -right-3 text-4xl">
                                        {getPodiumIcon(index)}
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${getPodiumColor(index)} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                            {donation.donorName.substring(0, 2).toUpperCase()}
                                        </div>

                                        <div className="text-center">
                                            <h4 className="text-lg font-bold text-white truncate max-w-full">
                                                {donation.donorName}
                                            </h4>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                                {formatAmount(donation.amount)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(donation.donatedAt)}
                                            </p>
                                        </div>

                                        {donation.message && (
                                            <p className="text-sm text-gray-400 italic text-center line-clamp-2">
                                                "{donation.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remaining Donors */}
            {remaining.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">All Supporters</h3>
                    <div className="space-y-2">
                        {remaining.map((donation, index) => (
                            <div
                                key={donation.id}
                                className="bg-gradient-to-br from-[#1a1a2e]/60 to-[#16213e]/60 backdrop-blur-xl border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {donation.donorName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-bold truncate">{donation.donorName}</h4>
                                            {donation.message && (
                                                <p className="text-sm text-gray-400 italic truncate">"{donation.message}"</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className="text-lg font-bold text-green-500">{formatAmount(donation.amount)}</p>
                                        <p className="text-xs text-gray-500">{formatDate(donation.donatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
