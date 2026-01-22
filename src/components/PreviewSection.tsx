"use client";
import React from 'react';
import { ZoomParallax } from "@/components/ui/zoom-parallax";

import Backiee from "@/assets/project/backiee-310808-landscape.jpg";
import Img6 from "@/assets/project/img (6).png";
import Gojo from "@/assets/project/satoru-gojo-3840x2160-15227.png";
import WPBlack from "@/assets/project/wp12183505-black-pc-8k-wallpapers.png";
import WPDark1 from "@/assets/project/wp8017973-8k-dark-wallpapers.jpg";

export const PreviewSection: React.FC = () => {

    const images = [
        {
            src: Img6,
            alt: 'Landscape abstract',
        },
        {
            src: Gojo,
            alt: 'Anime wallpaper',
        },
        {
            src: Backiee,
            alt: 'Abstract composition',
        },
        {
            src: WPBlack,
            alt: 'Black PC wallpaper',
        },
        {
            src: WPDark1,
            alt: 'Dark 8K wallpaper 1',
        },
    ];

    return (
        <section id="explorations" className="relative w-full py-0 bg-black">
            <div className="relative flex flex-col items-center justify-center mb-20 px-6 pt-32">
                <h2 className="text-center text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
                    Core Explorations
                </h2>
                <p className="text-neutral-500 text-lg max-w-lg text-center font-light">
                    A collection of visual experiences and design experiments that push the boundaries of modern creative development.
                </p>
            </div>
            <ZoomParallax images={images} className="h-[1000vh]" />
        </section>
    );
}
