"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, EyeOff } from "lucide-react";

interface BumperAd {
    id: string;
    advertiser: string;
    contactEmail: string;
    mediaUrl: string;
    clickUrl?: string;
    duration: number;
    impressions: number;
    clicks: number;
    isActive: boolean;
    createdAt: string;
}

export default function AdminAdsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [ads, setAds] = useState<BumperAd[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.role !== "ADMIN") {
            router.push("/");
            return;
        }

        fetchAds();
    }, [session, router]);

    const fetchAds = async () => {
        try {
            const res = await fetch("/api/admin/bumper-ads");
            const data = await res.json();
            setAds(data.ads || []);
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetch("/api/admin/bumper-ads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive: !currentStatus }),
            });
            fetchAds();
        } catch (error) {
            console.error("Error toggling ad:", error);
        }
    };

    const deleteAd = async (id: string) => {
        if (!confirm("Jeni i sigurt që dëshironi ta fshini këtë reklamë?")) return;

        try {
            await fetch("/api/admin/bumper-ads", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            fetchAds();
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-400">Duke u ngarkuar...</p>
            </div>
        );
    }

    const calculateCTR = (impressions: number, clicks: number) => {
        if (impressions === 0) return "0.00";
        return ((clicks / impressions) * 100).toFixed(2);
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Menaxhimi i Reklamave</h1>
                <p className="text-gray-400">Shqyrto dhe menaxho reklama të dërguara nga bizneset</p>
            </div>

            <div className="grid gap-4">
                {ads.length === 0 ? (
                    <div className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center">
                        <p className="text-gray-400">Nuk ka reklama të dërguara ende.</p>
                    </div>
                ) : (
                    ads.map((ad) => (
                        <div
                            key={ad.id}
                            className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{ad.advertiser}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${ad.isActive
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {ad.isActive ? "Aktiv" : "Joaktiv"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{ad.contactEmail}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Shfaqje</p>
                                            <p className="text-lg font-bold text-white">{ad.impressions.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Klikime</p>
                                            <p className="text-lg font-bold text-white">{ad.clicks.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">CTR</p>
                                            <p className="text-lg font-bold text-white">
                                                {calculateCTR(ad.impressions, ad.clicks)}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Kohëzgjatja</p>
                                            <p className="text-lg font-bold text-white">{ad.duration}s</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <a
                                            href={ad.mediaUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            Shiko median
                                        </a>
                                        {ad.clickUrl && (
                                            <a
                                                href={ad.clickUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 underline"
                                            >
                                                URL e klikimit
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => toggleActive(ad.id, ad.isActive)}
                                        size="sm"
                                        className={
                                            ad.isActive
                                                ? "bg-gray-600 hover:bg-gray-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        }
                                    >
                                        {ad.isActive ? (
                                            <>
                                                <EyeOff className="w-4 h-4 mr-1" />
                                                Çaktivizo
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4 mr-1" />
                                                Aktivizo
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => deleteAd(ad.id)}
                                        size="sm"
                                        variant="destructive"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Fshi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
