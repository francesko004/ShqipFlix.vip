"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Bell, Menu, X, User as UserIcon, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/ui/SearchModal";
import { NotificationBell } from "@/components/NotificationBell";

export function Navbar() {
    const { data: session, status } = useSession();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/movies", label: "Movies" },
        { href: "/tv", label: "TV Shows" },
        { href: "/new", label: "New & Popular" },
        { href: "/watchlist", label: "My List" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            ShqipFlix
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative py-1 hover:text-white transition-colors ${isActive(link.href)
                                        ? "text-white font-bold after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-red-600 after:shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                        : "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-red-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-300 hover:text-white"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex">
                                    <NotificationBell userId={session.user.id} />
                                </div>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white/10 group-hover:ring-red-600/50 transition-all">
                                            {session.user.username.substring(0, 2).toUpperCase()}
                                        </div>
                                    </button>

                                    {/* Custom Dropdown */}
                                    <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-[60]">
                                        <div className="bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                                            <div className="px-3 py-3 border-b border-white/5">
                                                <p className="text-white font-bold truncate">{session.user.username}</p>
                                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{session.user.role}</p>
                                            </div>
                                            <div className="p-1">
                                                {session.user.role === "ADMIN" && (
                                                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                        <Shield className="w-4 h-4 text-red-500" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                    <UserIcon className="w-4 h-4" />
                                                    My Profile
                                                </Link>
                                                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Link>
                                                <div className="h-px bg-white/5 my-1" />
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild className="hidden sm:flex text-gray-300 hover:text-white text-sm">
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold h-9 px-4 rounded-lg" asChild>
                                    <Link href="/register">Join Free</Link>
                                </Button>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                    {/* Blurred Background Overlay */}
                    <div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-2xl transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className={`relative h-full w-full max-w-[300px] bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-500 ease-out shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                        <div className="flex items-center justify-between px-6 h-20 border-b border-white/5">
                            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent" onClick={() => setIsMobileMenuOpen(false)}>
                                ShqipFlix
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mb-4 px-2">Browse</p>
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-bold transition-all duration-300 transform ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"} ${isActive(link.href) ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                                        style={{ transitionDelay: `${150 + i * 50}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="space-y-4">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mb-4 px-2">Account</p>
                                {session ? (
                                    <div className="space-y-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                {session.user.username.substring(0, 2)}
                                            </div>
                                            <span className="font-bold">{session.user.username}</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 px-2">
                                        <Button variant="outline" asChild className="border-white/10 text-white font-bold h-12 rounded-xl">
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                                        </Button>
                                        <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-red-900/20" asChild>
                                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Join ShqipFlix</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span>v0.1.0 Beta</span>
                                <span>© 2026 ShqipFlix</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

