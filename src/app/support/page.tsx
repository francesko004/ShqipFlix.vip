import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Wallet, Heart, Star, ShieldCheck, Copy, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CryptoAddressCard } from "@/components/ui/CryptoAddressCard";

export const metadata = {
    title: "Support ShqipFlix - Crypto Donations",
    description: "Support ShqipFlix and help us maintain the ultimate Albanian streaming platform with crypto donations.",
};

export const dynamic = "force-dynamic";

export default async function SupportPage() {
    const addresses = await prisma.cryptoAddress.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: "asc" },
    });

    return (
        <main className="min-h-screen bg-[#0b0c15] text-white">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-sm font-bold uppercase tracking-widest">
                        <Heart className="w-4 h-4 fill-red-500" />
                        Support Our Community
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-red-100 to-gray-400 bg-clip-text text-transparent">
                        Help Us Keep ShqipFlix <br className="hidden md:block" /> Free For Everyone
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        ShqipFlix is a community-driven project. Your crypto donations help us cover server costs,
                        API fees, and continue developing new features for all Albanian movie lovers.
                    </p>
                </div>

                {/* Benefits/Why Support */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-5xl mx-auto">
                    <BenefitCard
                        icon={<Star className="w-6 h-6 text-yellow-500" />}
                        title="Maintain Quality"
                        description="Ensure 4K streaming and high-speed delivery for all users worldwide."
                    />
                    <BenefitCard
                        icon={<ShieldCheck className="w-6 h-6 text-blue-500" />}
                        title="Zero Ads"
                        description="Help us keep the core experience clean and focused on content."
                    />
                    <BenefitCard
                        icon={<Wallet className="w-6 h-6 text-orange-500" />}
                        title="Crypto Powered"
                        description="Support us anonymously and securely using your favorite cryptocurrencies."
                    />
                </div>

                {/* Crypto Options Section */}
                <section id="crypto-options" className="space-y-12 max-w-4xl mx-auto">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Donate with Crypto</h2>
                        <p className="text-gray-500">Choose your preferred currency to send your support.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.length > 0 ? (
                            addresses.map((addr) => (
                                <CryptoAddressCard key={addr.id} address={addr} />
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-gray-400">
                                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <p>No crypto addresses are currently available. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* FAQ/Note */}
                <div className="mt-32 max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold mb-4">Important Information</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Please ensure you select the correct network when sending crypto.
                        Donations are voluntary and non-refundable. Your support keeps ShqipFlix alive!
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 bg-[#1a1a2e]/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-red-600/30 transition-all group">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
