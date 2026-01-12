"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Film,
    Settings,
    BarChart3,
    ShieldAlert,
    LogOut,
    Home,
    Menu,
    X,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: React.ReactNode;
    session: any;
}

export default function AdminLayoutClient({ children, session }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('scroll-lock');
        } else {
            document.body.classList.remove('scroll-lock');
        }
        return () => document.body.classList.remove('scroll-lock');
    }, [isSidebarOpen]);

    const sidebarLinks = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/content", label: "Content Mgmt", icon: Film },
        { href: "/admin/notifications", label: "Notifications", icon: Bell },
        { href: "/admin/stats", label: "Analytics", icon: BarChart3 },
        { href: "/admin/settings", label: "Site Settings", icon: Settings },
    ];

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Admin Sidebar */}
            <aside className={`
                w-64 border-r border-white/5 bg-[#0b0c15] flex flex-col h-full z-50
                fixed lg:sticky top-0
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2" onClick={closeSidebar}>
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Admin<span className="text-red-500">Flix</span></span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={closeSidebar}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            onClick={closeSidebar}
                        >
                            <link.icon className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        onClick={closeSidebar}
                    >
                        <Home className="w-5 h-5" />
                        Back to Site
                    </Link>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full lg:w-auto">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 bg-[#050505] border-b border-white/5 px-4 py-4 lg:p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-300 hover:text-white touch-target"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Admin Console</h1>
                            <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">Welcome back, {session.user.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="bg-red-600/10 border border-red-600/20 px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold text-red-500 animate-pulse">
                            Live
                        </div>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
