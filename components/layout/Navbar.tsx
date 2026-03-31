"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", auth: true },
        { name: "Teams", href: "/teams", auth: true },
    ];

    return (
        <nav className="bg-brand-card/80 backdrop-blur-md border-b border-brand-dark sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <span className="text-white font-bold text-xl tracking-tight">
                                IEEE <span className="text-brand-accent">ZSB</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                if (link.auth && !session) return null;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "text-white bg-brand-primary"
                                            : "text-brand-subtext hover:text-white hover:bg-brand-dark/30"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Desktop User Info & Logout */}
                        {session ? (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-white text-xs font-semibold">{session.user?.name}</p>
                                    <p className="text-brand-subtext text-[10px] uppercase">{session.user?.position}</p>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:block">
                                <Link
                                    href="/login"
                                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
                                >
                                    Login
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-brand-subtext hover:text-white hover:bg-brand-dark/30 focus:outline-none transition-all"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100 border-t border-brand-dark" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pt-2 pb-3 space-y-1 bg-brand-card/95">
                    {navLinks.map((link) => {
                        if (link.auth && !session) return null;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive
                                    ? "text-white bg-brand-primary"
                                    : "text-brand-subtext hover:text-white hover:bg-brand-dark/30"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-1 border-t border-brand-dark/50">
                        {session ? (
                            <div className="space-y-4 pt-2">
                                <div className="px-4">
                                    <p className="text-white text-sm font-semibold">{session.user?.name}</p>
                                    <p className="text-brand-subtext text-xs uppercase">{session.user?.position}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        signOut({ callbackUrl: "/" });
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-base font-bold transition-all cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-2 px-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-lg text-sm font-bold transition-all"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
