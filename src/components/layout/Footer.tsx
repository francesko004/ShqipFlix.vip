import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

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
                                ShqipFlix
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Experience the ultimate Albanian streaming platform. Watch unlimited movies, TV shows, and exclusive content in stunning 4K quality anywhere, anytime.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Browse</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><FooterLink href="/">Home</FooterLink></li>
                            <li><FooterLink href="/movies">Movies</FooterLink></li>
                            <li><FooterLink href="/tv">TV Shows</FooterLink></li>
                            <li><FooterLink href="/new">New & Popular</FooterLink></li>
                            <li><FooterLink href="/watchlist">My List</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        &copy; {currentYear} ShqipFlix. All rights reserved.
                    </p>
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
