"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Home, Search as SearchIcon, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0b0c15] relative overflow-hidden flex items-center justify-center px-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Film Strips */}
                <div className="absolute top-20 left-10 opacity-5 animate-float">
                    <Film className="w-32 h-32 text-red-500" />
                </div>
                <div className="absolute bottom-20 right-10 opacity-5 animate-float-delayed">
                    <Film className="w-40 h-40 text-red-600" />
                </div>
                <div className="absolute top-1/2 left-1/4 opacity-5 animate-float-slow">
                    <Sparkles className="w-24 h-24 text-red-400" />
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slower"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl">
                {/* 404 Number with Cinematic Effect */}
                <div className="relative">
                    <h1 className="text-[180px] sm:text-[220px] font-black leading-none bg-gradient-to-br from-red-500 via-red-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift drop-shadow-2xl">
                        404
                    </h1>
                    <div className="absolute inset-0 text-[180px] sm:text-[220px] font-black leading-none bg-gradient-to-br from-red-500 via-red-600 to-purple-600 opacity-20 blur-2xl">
                        404
                    </div>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-red-500/30">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                            <Film className="w-6 h-6 text-red-500 animate-pulse" />
                            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                            Scene Not Found
                        </h2>
                        <p className="text-gray-300 text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
                            This page seems to have gone off-script. Let&apos;s get you back to the main feature.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 border border-red-400/20"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:border-red-500/40 font-semibold px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <Link href="/search" className="flex items-center gap-2">
                            <SearchIcon className="w-5 h-5" />
                            Search Content
                        </Link>
                    </Button>
                </div>

                {/* Quick Navigation */}
                <div className="pt-8">
                    <p className="text-gray-400 text-sm mb-4 font-medium">Or explore our collection:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/movies"
                            className="group px-6 py-3 rounded-full bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/20 transition-all duration-300 font-medium hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                <Film className="w-4 h-4" />
                                Movies
                            </span>
                        </Link>
                        <Link
                            href="/tv"
                            className="group px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all duration-300 font-medium hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                <Film className="w-4 h-4" />
                                TV Shows
                            </span>
                        </Link>
                        <Link
                            href="/new"
                            className="group px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 text-pink-400 hover:text-pink-300 hover:border-pink-500/40 hover:bg-pink-500/20 transition-all duration-300 font-medium hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                New &amp; Popular
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-5deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(3deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.15; transform: scale(1.1); }
                }
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.08; transform: scale(1); }
                    50% { opacity: 0.12; transform: scale(1.15); }
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 10s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-pulse-slower {
                    animation: pulse-slower 10s ease-in-out infinite;
                }
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 5s ease infinite;
                }
            `}</style>
        </div>
    );
}
