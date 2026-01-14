"use client";

import { useState } from "react";
import { Copy, Check, Wallet } from "lucide-react";

interface CryptoAddress {
    id: string;
    name: string;
    symbol: string;
    address: string;
    network?: string | null;
}

export function CryptoAddressCard({ address }: { address: CryptoAddress }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 hover:border-red-600/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                        {address.symbol}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{address.name}</h3>
                        {address.network && (
                            <span className="text-xs font-bold text-gray-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                {address.network}
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-black/40 rounded-xl p-3 flex items-center justify-between gap-3 border border-white/5 group-hover:border-white/10 transition-colors">
                    <code className="text-gray-300 text-sm font-mono truncate select-all">
                        {address.address}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="Copy Address"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                {copied && (
                    <p className="text-green-500 text-xs font-bold mt-2 pl-1 animate-in fade-in slide-in-from-top-1">
                        Address copied to clipboard!
                    </p>
                )}
            </div>
        </div>
    );
}
