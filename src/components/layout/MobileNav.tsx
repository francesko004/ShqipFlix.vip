"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, List, User } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/movies", label: "Movies", icon: Film },
        { href: "/tv", label: "TV Shows", icon: Tv },
        { href: "/watchlist", label: "My List", icon: List },
        { href: "/profile", label: "Profile", icon: User },
    ];

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 pb-safe-bottom">
            <div className="flex items-center justify-between px-2 h-16 safe-bottom">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? "text-red-500" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? "fill-current" : ""}`} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
