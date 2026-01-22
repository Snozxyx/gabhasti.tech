import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
type Skill = {
  name: string;
  level: "Intermediate" | "Advanced" | "Expert";
  category: string;
};

// --- Data ---
const SKILLS: Skill[] = [
  { name: "React", level: "Expert", category: "Frontend" },
  { name: "TypeScript", level: "Advanced", category: "Language" },
  { name: "Tailwind CSS", level: "Expert", category: "Design" },
  { name: "Framer Motion", level: "Advanced", category: "Animation" },
  { name: "Next.js", level: "Advanced", category: "Framework" },
  { name: "Three.js", level: "Intermediate", category: "3D" },
  { name: "Node.js", level: "Advanced", category: "Backend" },
  { name: "UI/UX Design", level: "Expert", category: "Creative" },
];

export const SkillSection: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section 
      id="skills" 
      className="relative w-full py-32 bg-black text-white overflow-hidden selection:bg-white/20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- Section Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-medium tracking-tight text-white"
            >
              Capabilities
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "100px" }}
              viewport={{ once: true }}
              className="h-1 bg-white"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 font-mono text-xs md:text-sm max-w-xs text-right leading-relaxed"
          >
            // A CURATED TOOLKIT FOR<br />
            // HIGH-PERFORMANCE INTERFACES
          </motion.p>
        </div>

        {/* --- Skills Grid --- */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          onMouseLeave={() => setHoveredSkill(null)}
        >
          {SKILLS.map((skill, index) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              index={index}
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

// --- Subcomponent: Individual Skill Card ---
const SkillCard = ({ 
  skill, 
  index, 
  hoveredSkill, 
  setHoveredSkill 
}: { 
  skill: Skill; 
  index: number; 
  hoveredSkill: string | null;
  setHoveredSkill: (name: string | null) => void;
}) => {
  // Determine if this specific card is being hovered, or if another is
  const isHovered = hoveredSkill === skill.name;
  const isDimmed = hoveredSkill !== null && !isHovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      className={cn(
        "relative group cursor-default p-6 h-40 flex flex-col justify-between transition-all duration-500 ease-out",
        "border border-white/5 bg-neutral-900/10 hover:bg-neutral-900/30",
        isDimmed ? "opacity-30 blur-[1px] scale-95 grayscale" : "opacity-100 scale-100 grayscale-0"
      )}
    >
      {/* Top Row: Category Tag */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
          0{index + 1} — {skill.category}
        </span>
        
        {/* Animated Arrow Icon */}
        <motion.span 
          animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0 }}
          className="text-white text-xs"
        >
          →
        </motion.span>
      </div>

      {/* Bottom Row: Name & Progress */}
      <div className="space-y-3">
        <h3 className={cn(
          "text-2xl font-medium tracking-tight transition-colors duration-300",
          isHovered ? "text-white" : "text-neutral-400"
        )}>
          {skill.name}
        </h3>

        {/* Visual Proficiency Bar */}
        <div className="w-full bg-neutral-800 h-[2px] overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white"
            initial={{ width: 0 }}
            animate={{ 
              width: isHovered ? getWidth(skill.level) : "0%" 
            }}
            transition={{ duration: 0.4, ease: "circOut" }}
          />
        </div>
        
        {/* Text Level Indicator (Only visible on hover) */}
        <div className="h-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.p
                key="level"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider"
              >
                Proficiency: {skill.level}
              </motion.p>
            ) : (
              <motion.div
                key="dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1 items-center"
              >
                {/* Static subtle dots when not hovered */}
                <div className="w-1 h-1 rounded-full bg-neutral-700" />
                <div className="w-1 h-1 rounded-full bg-neutral-700" />
                <div className="w-1 h-1 rounded-full bg-neutral-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Helper to calculate bar width based on level
const getWidth = (level: string) => {
  switch (level) {
    case "Expert": return "100%";
    case "Advanced": return "85%";
    case "Intermediate": return "60%";
    default: return "50%";
  }
};
