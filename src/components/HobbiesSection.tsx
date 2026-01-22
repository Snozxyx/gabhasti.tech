"use client";
import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tv, BookOpen, FlaskConical, Hammer, Eye, HandHelping, } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Hobby {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}

const HOBBIES: Hobby[] = [
  {
    icon: <Tv className="w-6 h-6" />,
    title: "Anime Watcher",
    description: "Immersing in captivating stories, exploring different worlds through the art of Japanese animation.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Reading",
    description: "Deep diving into philosophy, technology, and books on self-improvement and design thinking.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Experiment",
    description: "Constantly exploring new technologies, frameworks, and innovative ideas to push boundaries.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: "Building",
    description: "Creating projects from scratch, turning ideas into reality through code and hardware.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Watching",
    description: "Observing the world, staying curious about trends, tech talks, and creative content.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
  },
  {
    icon: <HandHelping  className="w-6 h-6" />,
    title: "Helping",
    description: "Contributing to open source, mentoring, and sharing knowledge with the developer community.",
    image: "https://images.unsplash.com/photo-1582803824594-65b5b4632cad?q=80",
  },
];

const HobbyCard: React.FC<{ hobby: Hobby; index: number }> = ({ hobby, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="hobby-card group relative overflow-hidden rounded-xl border border-white/5 bg-neutral-950 transition-all duration-500 hover:border-white/20"
    >
      {/* Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hobby.image}
          alt={hobby.title}
          className="h-full w-full object-cover opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-6 md:p-8 min-h-[280px]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/80 transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
            {hobby.icon}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Passion #{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
          {hobby.title}
        </h3>

        <p className="text-neutral-400 font-light text-sm leading-relaxed">
          {hobby.description}
        </p>

        {/* Animated underline */}
        <div className="mt-6 h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-all duration-500 group-hover:via-white/40" />
      </div>
    </motion.div>
  );
};

export const HobbiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on heading
      gsap.to(headingRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Staggered reveal for cards with horizontal movement
      const cards = gridRef.current?.querySelectorAll(".hobby-card");
      if (cards) {
        cards.forEach((card, i) => {
          const direction = i % 2 === 0 ? -30 : 30;
          gsap.fromTo(
            card,
            { x: direction, rotateY: direction / 3 },
            {
              x: 0,
              rotateY: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 60%",
                scrub: 1,
              },
            }
          );
        });
      }

      // Progress line animation
      gsap.to(".hobbies-progress-line", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hobbies"
      className="relative w-full py-40 bg-black border-y border-white/5 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent" />

      {/* Progress line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5">
        <div className="hobbies-progress-line h-full w-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 origin-left scale-x-0" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading with parallax */}
        <div ref={headingRef} className="mb-24 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4"
          >
            Beyond the Code
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
          >
            Passions & Pursuits
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-500 font-light text-sm md:text-base max-w-lg italic"
          >
            The things that fuel creativity and bring balance to the craft.
          </motion.p>
        </div>

        {/* Hobbies Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {HOBBIES.map((hobby, index) => (
            <HobbyCard key={hobby.title} hobby={hobby} index={index} />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-40 top-1/3 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-40 bottom-1/4 w-60 h-60 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
};