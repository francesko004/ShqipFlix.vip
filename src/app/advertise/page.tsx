"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Megaphone, CheckCircle } from "lucide-react";

export default function AdvertisePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        advertiser: "",
        contactEmail: "",
        mediaUrl: "",
        clickUrl: "",
        duration: 5,
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/advertise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert("Gabim gjatë dërgimit. Ju lutemi provoni përsëri.");
            }
        } catch (error) {
            alert("Gabim gjatë dërgimit. Ju lutemi provoni përsëri.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#0b0c15]">
                <Navbar />
                <div className="container mx-auto px-4 py-24">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Reklama u Dërgua!</h1>
                        <p className="text-gray-400 mb-8">
                            Faleminderit për interesin! Ekipi ynë do ta shqyrtojë reklamën tuaj dhe do t&apos;ju kontaktojë së shpejti.
                        </p>
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Kthehu në Faqen Kryesore
                        </Button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b0c15]">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                            <Megaphone className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Reklamoni Biznesin Tuaj</h1>
                        <p className="text-gray-400 text-lg">
                            Arrini mijëra shikues shqiptarë me reklama 5-sekondëshe para videove
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
                            <p className="text-gray-400 mb-2">Starter</p>
                            <p className="text-3xl font-bold text-white mb-2">€50</p>
                            <p className="text-sm text-gray-500">10,000 shfaqje</p>
                        </div>
                        <div className="bg-red-600/20 border-2 border-red-500 rounded-xl p-6 text-center">
                            <p className="text-red-400 mb-2 font-bold">Popullor</p>
                            <p className="text-3xl font-bold text-white mb-2">€150</p>
                            <p className="text-sm text-gray-300">50,000 shfaqje</p>
                        </div>
                        <div className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
                            <p className="text-gray-400 mb-2">Premium</p>
                            <p className="text-3xl font-bold text-white mb-2">€400</p>
                            <p className="text-sm text-gray-500">200,000 shfaqje</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Emri i Biznesit *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.advertiser}
                                    onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    placeholder="p.sh. Restorant Tirana"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Kontakti *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    placeholder="info@biznesi.al"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL e Videos/Imazhit *
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.mediaUrl}
                                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                placeholder="https://example.com/ad-video.mp4"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Formatet e mbështetura: MP4, WebM, JPG, PNG
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL e Klikimit (opsionale)
                            </label>
                            <input
                                type="url"
                                value={formData.clickUrl}
                                onChange={(e) => setFormData({ ...formData, clickUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                placeholder="https://biznesi.al"
                            />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-sm text-blue-400">
                                <strong>Shënim:</strong> Reklama juaj do të shqyrtohet nga ekipi ynë brenda 24 orëve. Do t&apos;ju kontaktojmë për detajet e pagesës.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                        >
                            {loading ? "Duke dërguar..." : "Dërgo Reklamën"}
                        </Button>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
