"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";

export const TimelineSection: React.FC = () => {
    const data = [
        {
            title: "2025",
            content: (
                <div>
                    <p className="text-neutral-500 text-sm md:text-base font-normal mb-8">
                        Created Tatakai - an anime streaming WebApp, and TatakaiAPI - a unified anime API aggregating multiple data sources.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/repo/tatakaiproject.png"
                            alt="Tatakai project"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                        <img
                            src="/assets/repo/tatakaiapi.png"
                            alt="TatakaiAPI project"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "2023",
            content: (
                <div>
                    <p className="text-neutral-500 text-sm md:text-base font-normal mb-8">
                        Created LauncherX - a custom Minecraft launcher with enhanced features and optimized performance.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/repo/LauncherX-github-image.png"
                            alt="LauncherX project"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                       
                    </div>
                </div>
            ),
        },
        {
            title: "2020",
            content: (
                <div>
                    <p className="text-neutral-500 text-sm md:text-base font-normal mb-8">
                        Exploring new ideas and innovations. Worked on server management and development including Minecraft servers and GTA 5 servers.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/Extra/Kysta Server-github-image.png"
                            alt="Server management"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                        <img
                            src="/assets/Extra/player.jpg" // I am lazy to find a better images
                            alt="Game development"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "2018",
            content: (
                <div>
                    <p className="text-neutral-500 text-sm md:text-base font-normal mb-8">
                        Created a public SMP - TenXMC (Now Closed). First major community project managing a Minecraft server.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/Extra/TenXMC-github-image.png"
                            alt="Minecraft server"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                
                    </div>
                </div>
            ),
        },
        {
            title: "2016",
            content: (
                <div>
                    <p className="text-neutral-500 text-sm md:text-base font-normal mb-8">
                        Started my internet journey - created my first "Hello World" website. The beginning of everything.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/Extra/code.jpg"
                            alt="First code"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                          <img
                            src="/assets/Extra/helloworld.jpg"
                            alt="Hello World"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section id="timeline" className="w-full">
            <Timeline data={data} />
        </section>
    );
};