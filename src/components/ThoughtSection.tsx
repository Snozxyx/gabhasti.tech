"use client";
import React from 'react';
import { WavePath } from "@/components/ui/wave-path";

export const ThoughtSection: React.FC = () => {
    return (
        <section id="thoughts" className="relative flex h-[60vh] w-full flex-col items-center justify-center bg-black py-24 overflow-hidden">
            <div className="flex w-[70vw] flex-col items-start md:items-end">
                <WavePath className="mb-12 opacity-50" />
                <div className="flex w-full flex-col items-start md:items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                        <p className="text-neutral-500 text-xs font-mono tracking-widest uppercase mb-2 md:mb-0 shrink-0">Logical Poetry</p>
                        <p className="text-neutral-400 w-full md:w-3/4 text-2xl md:text-4xl font-light tracking-tight leading-snug">
                            I believe that the best products are built at the intersection of <span className="text-white italic">logic</span> and <span className="text-white italic">poetry</span>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
