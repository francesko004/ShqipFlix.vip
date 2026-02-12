"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen });
                }
                return child;
            })}
        </div>
    );
};

const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen }: any) => {
    return (
        <div onClick={() => setIsOpen(!isOpen)}>
            {children}
        </div>
    );
};

const DropdownMenuContent = ({ children, align = "right", isOpen, setIsOpen, className }: any) => {
    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-white/10 bg-[#0b0c15] p-1 text-gray-300 shadow-md animate-in fade-in zoom-in-95 duration-100",
                align === "end" ? "right-0" : "left-0",
                "mt-2 w-56 origin-top-right",
                className
            )}
            onClick={() => setIsOpen(false)}
        >
            {children}
        </div>
    );
};

const DropdownMenuItem = ({ children, onClick, className, disabled }: any) => {
    return (
        <div
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                disabled && "pointer-events-none opacity-50",
                className
            )}
            onClick={(e) => {
                if (disabled) return;
                onClick?.(e);
            }}
        >
            {children}
        </div>
    );
};

const DropdownMenuSeparator = ({ className }: any) => (
    <div className={cn("-mx-1 my-1 h-px bg-white/5", className)} />
);

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
