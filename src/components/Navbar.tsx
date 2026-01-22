"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
];

export const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState("hero");
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ["hero", "about", "projects", "skills", "blog", "contact"];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top >= -300 && rect.top <= 300;
                }
                return false;
            });

            if (current) setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id.replace("#", ""));
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const handleAuthClick = async () => {
        if (user) {
            await supabase.auth.signOut();
            setUser(null);
        } else {
            navigate("/auth");
        }
    };

    return (
        <>
            {/* Desktop Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-center pt-6 transition-all duration-300",
                    scrolled ? "pt-4" : "pt-8"
                )}
            >
                <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                    <Link
                        to="/"
                        className="text-white font-bold tracking-tighter text-xl mr-4"
                    >
                        GABHASTI<span className="text-white">.</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            item.href.startsWith("/#") ? (
                                <button
                                    key={item.label}
                                    onClick={() => scrollTo(item.href.replace("/", ""))}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white",
                                        activeSection === item.href.replace("/#", "")
                                            ? "text-white"
                                            : "text-neutral-500"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white",
                                        window.location.pathname === item.href
                                            ? "text-white"
                                            : "text-neutral-500"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </div>

                    <button
                        onClick={handleAuthClick}
                        className="ml-4 px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
                    >
                        {user ? "SIGN OUT" : "SIGN IN"}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-center pt-4 px-4 transition-all duration-300",
                    scrolled ? "pt-3" : "pt-4"
                )}
            >
                <div className="flex items-center justify-between w-full px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <Link
                        to="/"
                        className="text-white font-bold tracking-tighter text-base"
                    >
                        G<span className="text-white">.</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {NAV_ITEMS.map((item) => (
                            item.href.startsWith("/#") ? (
                                <button
                                    key={item.label}
                                    onClick={() => scrollTo(item.href.replace("/", ""))}
                                    className={cn(
                                        "text-[10px] font-medium transition-colors hover:text-white",
                                        activeSection === item.href.replace("/#", "")
                                            ? "text-white"
                                            : "text-neutral-500"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={cn(
                                        "text-[10px] font-medium transition-colors hover:text-white",
                                        window.location.pathname === item.href
                                            ? "text-white"
                                            : "text-neutral-500"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </div>

                    <button
                        onClick={handleAuthClick}
                        className="px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-bold hover:bg-neutral-200 transition-colors"
                    >
                        {user ? "OUT" : "IN"}
                    </button>
                </div>
            </motion.nav>
        </>
    );
};