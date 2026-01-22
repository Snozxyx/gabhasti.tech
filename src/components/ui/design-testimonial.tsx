"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { FC } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

const testimonials = [
    {
        quote: "Transformed our entire creative process overnight.",
        author: "Sarah Chen",
        role: "Annoymous",
        company: "Discord",
    },
    {
        quote: "The most elegant solution we've ever implemented.",
        author: "Marcus Webb",
        role: "Freelancer",
        company: "Instagram",
    },
    {
        quote: "Pure craftsmanship in every single detail.",
        author: "Elena Frost",
        role: "Freelancer",
        company: "Instagram",
    },
]

export const Testimonial: FC = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Mouse position for magnetic effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 200 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    // Transform for parallax on the large number
    const numberX = useTransform(x, [-200, 200], [-20, 20])
    const numberY = useTransform(y, [-200, 200], [-10, 10])

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            mouseX.set(e.clientX - centerX)
            mouseY.set(e.clientY - centerY)
        }
    }

    const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    useEffect(() => {
        const timer = setInterval(goNext, 6000)
        return () => clearInterval(timer)
    }, [])

    const current = testimonials[activeIndex]

    return (
        <div className="flex items-center justify-center min-h-[600px] w-full bg-transparent overflow-hidden">
            <div ref={containerRef} className="relative w-full max-w-5xl" onMouseMove={handleMouseMove}>
                {/* Oversized index number */}
                <motion.div
                    className="absolute -left-8 top-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-bold text-white/[0.03] select-none pointer-events-none leading-none tracking-tighter"
                    style={{ x: numberX, y: numberY }}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="block"
                        >
                            {String(activeIndex + 1).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>

                {/* Main content */}
                <div className="relative flex">
                    {/* Left column - vertical text */}
                    <div className="hidden md:flex flex-col items-center justify-center pr-16 border-r border-white/10">
                        <motion.span
                            className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase"
                            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Testimonials
                        </motion.span>

                        <div className="relative h-32 w-px bg-white/10 mt-8">
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-white origin-top"
                                animate={{
                                    height: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                                }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>

                    {/* Center - main content */}
                    <div className="flex-1 pl-0 md:pl-16 py-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                                className="mb-8"
                            >
                                <span className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-white/10 rounded-full px-3 py-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                    {current.company}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div className="relative mb-12 min-h-[140px]">
                            <AnimatePresence mode="wait">
                                <motion.blockquote
                                    key={activeIndex}
                                    className="text-3xl md:text-5xl font-light text-white leading-[1.15] tracking-tight"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {current.quote.split(" ").map((word, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block mr-[0.3em]"
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        duration: 0.5,
                                                        delay: i * 0.05,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    },
                                                },
                                                exit: {
                                                    opacity: 0,
                                                    y: -10,
                                                    transition: { duration: 0.2, delay: i * 0.02 },
                                                },
                                            }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </motion.blockquote>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-end justify-between">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex items-center gap-4"
                                >
                                    <motion.div
                                        className="w-8 h-px bg-white/40"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        style={{ originX: 0 }}
                                    />
                                    <div>
                                        <p className="text-base font-bold text-white tracking-tight">{current.author}</p>
                                        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{current.role}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={goPrev}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                                <button
                                    onClick={goNext}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
