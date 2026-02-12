import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export async function Footer() {
    const currentYear = new Date().getFullYear();
    const settings = await prisma.globalSettings.findFirst();
    const siteName = settings?.siteName || "ShqipFlix";

    return (
        <footer className="relative bg-[#050505] pt-20 pb-10 overflow-hidden mt-20">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                {siteName}
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            {settings?.siteDescription || "Përjetoni platformën lider shqiptare për transmetimin e filmave, serialeve dhe kanaleve Live TV."}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {settings?.facebookUrl && (
                                <Link href={settings.facebookUrl} target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-red-600 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </Link>
                            )}
                            {settings?.instagramUrl && (
                                <Link href={settings.instagramUrl} target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-red-600 transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </Link>
                            )}
                            {settings?.twitterUrl && (
                                <Link href={settings.twitterUrl} target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-red-600 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </Link>
                            )}
                            <Link href={`mailto:${settings?.supportEmail || "support@shqipflix.vip"}`} className="p-2 rounded-full bg-white/5 hover:bg-red-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Browse</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/">Home</FooterLink></li>
                            <li><FooterLink href="/movies">Movies</FooterLink></li>
                            <li><FooterLink href="/tv">TV Shows</FooterLink></li>
                            <li><FooterLink href="/live">Live TV</FooterLink></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/request">Request Content</FooterLink></li>
                            <li><FooterLink href="/support">Donate & Support</FooterLink></li>
                            <li><FooterLink href="/advertise">Advertise</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                        &copy; {currentYear} {siteName}. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-[10px] uppercase tracking-widest text-gray-500">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}


function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="hover:text-red-500 transition-colors duration-200 flex items-center gap-2 group"
        >
            <span className="w-1 h-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />
            {children}
        </Link>
    );
}
