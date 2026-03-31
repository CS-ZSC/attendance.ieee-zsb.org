"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", auth: true },
        { name: "Teams", href: "/teams", auth: true },
    ];

    return (
        <nav className="bg-brand-card/80 backdrop-blur-md border-b border-brand-dark sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-white font-bold text-xl tracking-tight">
                                IEEE <span className="text-brand-accent">ZSB</span>
                            </span>
                        </Link>

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
                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-right">
                                    <p className="text-white text-xs font-semibold">{session.user?.name}</p>
                                    <p className="text-brand-subtext text-[10px] uppercase">{session.user?.position || "Member"}</p>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
