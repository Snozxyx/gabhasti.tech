"use client";

import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
    return (
        <footer className="relative w-full bg-black pt-40 pb-20 border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-none">
                            BUILDING THE <span className="italic">FUTURE</span> ONE PIXEL AT A TIME.
                        </h2>
                        <div className="flex gap-4">
                            <a href="https://x.com/gabhastigiri" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all" target="_blank">
                                X
                            </a>
                            <a href="https://instagram.com/gabhastigiri" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all">
                                In
                            </a>
                            <a href="https://github.com/snozxyx" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white transition-all">
                                GH
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.3em]">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><a href="#hero" className="text-white hover:text-neutral-400 transition-colors">Home</a></li>
                            <li><a href="/about" className="text-white hover:text-neutral-400 transition-colors">About</a></li>
                            <li><a href="#projects" className="text-white hover:text-neutral-400 transition-colors">Projects</a></li>
                            <li><Link to="/blog" className="text-white hover:text-neutral-400 transition-colors">Journal</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.3em]">Contact</h3>
                        <p className="text-neutral-400 font-light leading-relaxed">
                            Have a project in mind? Let's discuss how we can bring your vision to life.
                        </p>
                        <a href="mailto:hello@gabhasti.tech" className="block text-xl font-bold text-white hover:text-neutral-400 transition-colors">
                            hello@gabhasti.tech
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                    <p className="text-neutral-600 text-xs font-mono">
                        © 2026 GABHASTI — gabhasti.tech
                    </p>
                    <div className="flex gap-8 text-neutral-600 text-xs font-mono">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
};
