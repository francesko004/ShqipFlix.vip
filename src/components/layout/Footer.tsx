import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black/90 text-gray-400 py-12 border-t border-white/10 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center sm:text-left">
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent inline-block">
                            ShqipFlix
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                            The best place to stream movies and TV shows for free. Premium experience, always. Watch your favorite content in stunning 4K.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
                            <li><Link href="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
                            <li><Link href="/tv" className="hover:text-red-500 transition-colors">TV Shows</Link></li>
                            <li><Link href="/new" className="hover:text-red-500 transition-colors">New & Popular</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">Help Center</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    <p className="text-xs">&copy; {new Date().getFullYear()} ShqipFlix. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] bg-red-600/10 text-red-500 px-2 py-1 rounded border border-red-600/20">ALBANIAN STREAMING PLATFORM</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

