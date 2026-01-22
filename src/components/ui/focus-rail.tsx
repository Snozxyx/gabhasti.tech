"use client";

import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
    id: string | number;
    title: string;
    description?: string;
    imageSrc: string;
    href?: string;
    meta?: string;
};

interface FocusRailProps {
    items: FocusRailItem[];
    initialIndex?: number;
    loop?: boolean;
    autoPlay?: boolean;
    interval?: number;
    className?: string;
    imageClassName?: string;
}

function wrap(min: number, max: number, v: number) {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
};

const TAP_SPRING = {
    type: "spring",
    stiffness: 450,
    damping: 18,
    mass: 1,
};



export function FocusRail({
    items,
    initialIndex = 0,
    loop = true,
    autoPlay = false,
    interval = 4000,
    className,
    imageClassName,
}: FocusRailProps) {
    const [active, setActive] = React.useState(initialIndex);
    const [isHovering, setIsHovering] = React.useState(false);
    const lastWheelTime = React.useRef<number>(0);

    const count = items.length;
    const activeIndex = wrap(0, count, active);
    const activeItem = items[activeIndex];

    const handlePrev = React.useCallback(() => {
        if (!loop && active === 0) return;
        setActive((p) => p - 1);
    }, [loop, active]);

    const handleNext = React.useCallback(() => {
        if (!loop && active === count - 1) return;
        setActive((p) => p + 1);
    }, [loop, active, count]);

    const onWheel = React.useCallback(
        (e: React.WheelEvent) => {
            const now = Date.now();
            if (now - lastWheelTime.current < 400) return;
            const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const delta = isHorizontal ? e.deltaX : e.deltaY;
            if (Math.abs(delta) > 20) {
                if (delta > 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
                lastWheelTime.current = now;
            }
        },
        [handleNext, handlePrev]
    );

    React.useEffect(() => {
        if (!autoPlay || isHovering) return;
        const timer = setInterval(() => handleNext(), interval);
        return () => clearInterval(timer);
    }, [autoPlay, isHovering, handleNext, interval]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
    };

    const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
        const swipeConfidenceThreshold = 10000;
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            handleNext();
        } else if (swipe > swipeConfidenceThreshold) {
            handlePrev();
        }
    };

    const [isSmall, setIsSmall] = React.useState<boolean>(typeof window !== "undefined" ? window.innerWidth < 768 : false);

    React.useEffect(() => {
        const onResize = () => setIsSmall(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const visibleIndices = isSmall ? [-1, 0, 1] : [-2, -1, 0, 1, 2];

    return (
        <div
            className={cn(
                "group relative flex h-[620px] w-full flex-col overflow-hidden bg-black text-white outline-none select-none",
                className
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onWheel={onWheel}
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`bg-${activeItem.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isSmall ? 0.25 : 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src={activeItem.imageSrc}
                            alt=""
                            className={cn("h-full w-full object-cover", isSmall ? "blur-md saturate-125" : "blur-3xl saturate-200")}
                        />
                        <div className={isSmall ? "absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent" : "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
                    <motion.div
                        className={cn(
                            "relative mx-auto flex w-full max-w-6xl items-center justify-center cursor-grab active:cursor-grabbing",
                            isSmall ? "h-[320px] perspective-[900px]" : "h-[420px] perspective-[1400px]"
                        )}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={onDragEnd}
                    >
                    {visibleIndices.map((offset) => {
                        const absIndex = active + offset;
                        const index = wrap(0, count, absIndex);
                        const item = items[index];
                        if (!loop && (absIndex < 0 || absIndex >= count)) return null;

                        const isCenter = offset === 0;
                        const dist = Math.abs(offset);
                        const xOffset = offset * (isSmall ? 220 : 320);
                        const zOffset = -dist * (isSmall ? 90 : 180);
                        const scale = isCenter ? 1 : (isSmall ? 0.9 : 0.85);
                        const rotateY = offset * (isSmall ? -12 : -20);
                        const opacity = isCenter ? 1 : Math.max(0.12, 1 - dist * 0.5);
                        const blur = isCenter ? 0 : dist * (isSmall ? 4 : 6);
                        const brightness = isCenter ? 1 : (isSmall ? 0.65 : 0.5);

                        const widthClass = isCenter
                            ? (isSmall ? "w-[260px]" : "w-[320px] md:w-[720px]")
                            : (isSmall ? "w-[160px]" : "w-[200px] md:w-[260px]");

                        return (
                            <motion.div
                                key={absIndex}
                                className={cn(
                                    "absolute aspect-[16/9] rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl transition-shadow duration-300 overflow-hidden",
                                    widthClass,
                                    isCenter ? "z-20 shadow-white/5" : "z-10"
                                )}
                                initial={false}
                                animate={{
                                    x: xOffset,
                                    z: zOffset,
                                    scale: scale,
                                    rotateY: rotateY,
                                    opacity: opacity,
                                    filter: `blur(${blur}px) brightness(${brightness})`,
                                }}
                                transition={((val: string) => {
                                    if (val === "scale") return TAP_SPRING;
                                    return BASE_SPRING;
                                }) as any}
                                style={{ transformStyle: "preserve-3d" }}
                                onClick={() => {
                                    if (offset !== 0) setActive((p) => p + offset);
                                }}
                            >
                                <img
                                    src={item.imageSrc}
                                    alt={item.title}
                                    className={cn("h-full w-full pointer-events-none", imageClassName)}
                                    style={{ objectFit: isSmall ? "cover" : undefined }}
                                />
                                <div className={cn("absolute inset-0 rounded-2xl pointer-events-none", isSmall ? "bg-gradient-to-b from-black/40 via-black/10 to-transparent" : "bg-gradient-to-b from-black/65 via-black/10 to-transparent")} />
                                {isCenter && (
                                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 gap-3 pointer-events-none">
                                        {item.meta && (
                                            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-white/80">
                                                {item.meta}
                                            </span>
                                        )}
                                        <h3 className="text-lg md:text-2xl font-semibold tracking-tight text-white drop-shadow-lg">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="max-w-xl text-xs md:text-sm text-neutral-200/80 font-light drop-shadow">
                                                {item.description}
                                            </p>
                                        )}
                                        {item.href && (
                                            <div className="pointer-events-auto">
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-full bg-white text-black px-3 py-2 text-sm md:text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                                                >
                                                    Explore
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-6 md:flex-row pointer-events-auto">
                    <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left h-32 justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem.id}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                            >
                                {activeItem.meta && (
                                    <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                                        {activeItem.meta}
                                    </span>
                                )}
                                <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white">
                                    {activeItem.title}
                                </h2>
                                {activeItem.description && (
                                    <p className="max-w-md text-neutral-500 font-light text-xs md:text-sm">
                                        {activeItem.description}
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 rounded-full bg-neutral-900/40 p-1 ring-1 ring-white/10 backdrop-blur-md">
                            <button
                                onClick={handlePrev}
                                className="rounded-full p-2 md:p-3 text-neutral-400 transition hover:bg-white/5 hover:text-white active:scale-95"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="min-w-[36px] text-center text-xs font-mono text-neutral-600">
                                {activeIndex + 1} / {count}
                            </span>
                            <button
                                onClick={handleNext}
                                className="rounded-full p-2 md:p-3 text-neutral-400 transition hover:bg-white/5 hover:text-white active:scale-95"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {activeItem.href && (
                            <a
                                href={activeItem.href}
                                className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                            >
                                Explore
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
