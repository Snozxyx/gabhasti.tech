import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse tracking for the spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Spotlight mask: Smaller and sharper
  const maskImage = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, white, transparent)`;

  // Scroll animations for the About section background
  const { scrollYProgress } = useScroll();
  const background = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    ["#000000", "#0a0a0a", "#111111"]
  );

  return (
    <motion.main 
      style={{ backgroundColor: background }}
      className="w-full text-white selection:bg-white/20"
    >
      
      {/* --- HERO SECTION --- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* CLEANUP: Removed static grid and colored blobs.
            Only the spotlight reveal remains.
        */}
        
        {/* The Hidden Grid (Only revealed by mouse) */}
        <motion.div
          className="absolute inset-0 z-0 opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          {/* Very subtle grid inside the spotlight */}
          <GridPattern className="text-white/50" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto space-y-6 pointer-events-none select-none">
          
          {/* Greeting - Small and Elegant */}
          <div className="mb-4">
            <AnimatedText
              text="Namaste, World."
              textClassName="text-sm md:text-base font-medium text-neutral-400 tracking-[0.2em] uppercase"
              underlinePath="M 0,5 Q 75,0 150,5"
              underlineHoverPath="M 0,5 Q 75,10 150,5"
              underlineDuration={1}
            />
          </div>

          {/* Headline - Significantly Smaller & Cleaner */}
          <h1 className="text-3xl md:text-5xl font-sans font-medium tracking-tight text-white/90">
            <span className="block mb-2">Hello, I am a</span>
            <span className="inline-block font-serif italic text-neutral-300">
              <FlipWords 
                words={["Traveller", "Engineer", "Creator", "Dreamer"]} 
                className="text-white" 
              />
            </span>
          </h1>

          {/* Subtext - Minimalist */}
          <p className="text-sm md:text-base text-neutral-500 font-light max-w-lg leading-relaxed">
“I don’t need to announce my ambitions. I let my discipline speak, my consistency show, and my results prove who I am. While others rush, I build patiently—and I build to last.”          </p>
        </div>

        {/* Minimalist Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-white transition-colors">
              Scroll
            </span>
            <motion.div 
              className="w-[1px] h-8 bg-neutral-800 group-hover:bg-white transition-colors"
              animate={{ height: [32, 48, 32] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>
        </div>
      </div>

      {/* --- ABOUT SECTION --- */}
      {/* Scroll Gradient Effect is handled by the main wrapper's style prop */}
      <section id="about" className="relative min-h-[120vh] flex flex-col items-center pt-32 pb-20">
        
        {/* A subtle top fade to separate sections visually without hard lines */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6">
           {/* Text Reveal - Using the clean typography */}
           <TextRevealByWord 
             text="A curious mind with steady focus, always learning, always moving forward—quietly determined to become better than yesterday." 
             className="text-white/80"
           />
        </div>
      </section>

    </motion.main>
  );
};

// --- Helper: Pure CSS Grid (Lightweight) ---
const GridPattern = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="small-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#small-grid)" />
      </svg>
    </div>
  );
};