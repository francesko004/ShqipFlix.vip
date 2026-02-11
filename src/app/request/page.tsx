"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

export default function RequestPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (res.ok) {
                setMessage("Kërkesa u dërgua me sukses! Do të shqyrtojmë kërkesën tuaj.");
                setTitle("");
                setDescription("");
            } else {
                setMessage("Gabim gjatë dërgimit të kërkesës. Ju lutemi provoni përsëri.");
            }
        } catch (error) {
            setMessage("Gabim gjatë dërgimit të kërkesës. Ju lutemi provoni përsëri.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0b0c15]">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                            <Film className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Kërko një Film ose Serial</h1>
                        <p className="text-gray-400">
                            Nuk e gjen atë që kërkon? Dërgona një kërkesë dhe ne do të përpiqemi ta shtojmë!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[#1a1a2e]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Titulli *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="p.sh. Inception, Breaking Bad"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Përshkrimi (opsionale)
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                                placeholder="Shto detaje shtesë nëse dëshiron..."
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg ${message.includes("sukses") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !title}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Duke dërguar..." : "Dërgo Kërkesën"}
                        </Button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Kërkesat shqyrtohen nga ekipi ynë. Faleminderit për kontributin!
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
