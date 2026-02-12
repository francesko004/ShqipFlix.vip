
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    return (
        <main className="min-h-screen bg-[#0b0c15] text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-6">
                    <WifiOff className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    It looks like you've lost your internet connection. Please check your network and try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 font-bold px-8 h-12 rounded-xl"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="border-white/10 hover:bg-white/5 font-bold px-8 h-12 rounded-xl"
                    >
                        <Link href="/watchlist">Go to My List</Link>
                    </Button>
                </div>
            </div>

            <Footer />
        </main>
    );
}
