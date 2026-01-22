"use client";
import React from "react";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";

const PROJECTS: FocusRailItem[] = [
    {
        id: 1,
        title: "Tatakai",
        description: "An anime streaming WebApp built for seamless viewing experience with modern UI and extensive library support.",
        meta: "Anime Streaming • WebApp",
        imageSrc: "/assets/repo/tatakaiproject.png",
        href: "https://github.com/snozxyx/tatakai",
    },
    {
        id: 2,
        title: "TatakaiAPI",
        description: "A unified API that aggregates multiple anime data sources into one seamless, developer-friendly interface.",
        meta: "API • Backend",
        imageSrc: "/assets/repo/tatakaiapi.png",
        href: "https://github.com/snozxyx/takatakai-api",
    },
    {
        id: 3,
        title: "LauncherX",
        description: "A custom Minecraft launcher with enhanced features, custom skins support, and optimized performance settings.",
        meta: "Desktop App • Gaming",
        imageSrc: "/assets/repo/LauncherX-github-image.png",
        href: "https://github.com/snozxyx/launcher",
    },
    {
        id: 4,
        title: "LiFi",
        description: "An Arduino-powered long-range LiFi project enabling data transmission through light signals over extended distances.",
        meta: "Hardware • IoT",
        imageSrc: "/assets/repo/Light Fidelity -github-image.png",
        href: "https://github.com/snozxyx/lifi",
    },
];

export const ProjectSection: React.FC = () => {
    return (
        <section id="projects" className="relative w-full py-16 md:py-32 bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="mb-12 md:mb-20 text-center px-6">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tighter">Featured Works</h2>
                <p className="text-neutral-500 font-light max-w-lg mx-auto text-sm md:text-base">Selected projects showcasing my journey in development and innovation.</p>
            </div>

            <FocusRail
                items={PROJECTS}
                autoPlay={true}
                loop={true}
                interval={5000}
                imageClassName="object-cover md:object-contain bg-neutral-950 p-2 md:p-6"
            />
        </section>
    );
};