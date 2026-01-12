import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationLeaderboard } from "@/components/ui/DonationLeaderboard";
import { DonationButton } from "@/components/ui/DonationButton";
import { Coffee, Heart, Star, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Support ShqipFlix - Community Donation Leaderboard",
    description: "Support ShqipFlix and help us maintain the ultimate Albanian streaming platform for everyone.",
};

export default function SupportPage() {
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
                        ShqipFlix is a community-driven project. Your donations help us cover server costs,
                        API fees, and continue developing new features for all Albanian movie lovers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <DonationButton className="w-full sm:w-auto px-8 py-4 text-lg" />
                        <a
                            href="#leaderboard"
                            className="w-full sm:w-auto px-8 py-4 text-lg border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-center font-bold"
                        >
                            View Leaderboard
                        </a>
                    </div>
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
                        icon={<Coffee className="w-6 h-6 text-orange-500" />}
                        title="Fuel Developers"
                        description="Support the team working hard to bring you the best features."
                    />
                </div>

                {/* Leaderboard Section */}
                <section id="leaderboard" className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Hall of Fame</h2>
                        <p className="text-gray-500">A special thank you to our top supporters who make this possible.</p>
                    </div>

                    <DonationLeaderboard />
                </section>

                {/* FAQ/Note */}
                <div className="mt-32 max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold mb-4">Donation Information</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        All donations are processed securely via Buy Me a Coffee. Once you donate, if you'd like your name
                        to appear on this leaderboard, please make sure your donation is public or contact our support.
                        Donations are voluntary and non-refundable. Thank you for your amazing support!
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
