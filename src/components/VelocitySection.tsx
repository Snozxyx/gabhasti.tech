"use client";

import React from "react";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export const VelocitySection: React.FC = () => {
    return (
        <section className="relative w-full py-24 bg-transparent overflow-hidden">
            <VelocityScroll
                text="LIMITLESS POTENTIAL • CONSTANT GROWTH • DRIVEN BY PURPOSE • "
                default_velocity={3}
                className="font-sans text-center text-5xl md:text-8xl font-bold tracking-tighter text-white/10 uppercase"
            />
        </section>
    );
};
