import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { siteConfig } from "@/lib/seo";

const AboutMe = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            <Seo
                title="About"
                description="About Gabhasti Giri Sinha — values, growth, and the journey of self-evolution."
                canonicalPath="/about"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    name: "About",
                    url: `${siteConfig.url}/about`,
                }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-neutral-500 font-mono text-sm tracking-widest uppercase mb-4 block">
              // The Journey of Self-Evolution
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">
                            Building Beyond<br />
                            <span className="text-neutral-500 italic">Comfort Zones.</span>
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20">
                        <motion.div
                            className="md:col-span-8 space-y-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 1 }}
                        >
                            <section className="prose prose-invert prose-lg max-w-none">
                                <p className="text-2xl leading-relaxed text-neutral-300 font-medium">
                                    I am a driven, self-aware, and constantly evolving individual who believes that personal growth is a lifelong journey shaped by learning, discipline, and experience.
                                </p>

                                <div className="h-px w-20 bg-white/20 my-12" />

                                <p className="text-neutral-400">
                                    I approach life with curiosity and intention, always seeking to understand not just the world around me but also my own strengths, values, and areas for improvement. I see challenges not as obstacles but as opportunities that push me to think deeper, work harder, and become more resilient.
                                </p>

                                <p className="text-neutral-400 mt-8">
                                    I value knowledge and self-improvement highly, and I make a conscious effort to keep learning from every situation, whether it comes through formal education, personal exploration, or real-life experiences. I believe that consistency and effort matter more than instant results, and I try to stay patient and focused on long-term goals rather than short-term rewards. This mindset helps me remain grounded even when progress feels slow.
                                </p>

                                <p className="text-neutral-400 mt-8">
                                    Creativity and critical thinking play an important role in who I am. I enjoy exploring ideas, questioning assumptions, and finding better ways to approach problems. I prefer meaningful work over easy success, and I am not afraid to invest time and energy into things that truly matter to me. I believe that growth happens outside comfort zones, so I actively challenge myself to improve my skills, mindset, and confidence.
                                </p>

                                <p className="text-neutral-400 mt-8 font-serif italic text-xl border-l-2 border-white/10 pl-6 py-2">
                                    "I understanding that collaboration and empathy are essential for both personal and collective success."
                                </p>

                                <p className="text-neutral-400 mt-8">
                                    I place strong importance on values such as honesty, integrity, and responsibility. I try to be genuine in my actions and respectful in my interactions with others. Whether working independently or as part of a team, I aim to communicate clearly, listen carefully, and contribute positively.
                                </p>

                                <p className="text-neutral-400 mt-8">
                                    Adaptability is one of my core strengths. I recognize that change is inevitable, and instead of resisting it, I try to learn how to navigate it effectively. I stay open-minded, flexible, and willing to adjust my perspective when needed. At the same time, I remain committed to my principles and do not easily lose sight of what I stand for.
                                </p>

                                <p className="text-neutral-400 mt-8">
                                    Overall, I see myself as someone who is still in the process of becoming better each day. I do not claim to have everything figured out, but I am committed to growth, learning, and self-discipline. I believe that success is not defined solely by achievements, but by character, consistency, and the ability to grow through both success and failure. My goal is to continue evolving into a more capable, thoughtful, and purposeful version of myself while staying true to my values and aspirations.
                                </p>
                            </section>
                        </motion.div>

                        <motion.div
                            className="md:col-span-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 1 }}
                        >
                            <div className="sticky top-32 space-y-8">
                                <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-xl">
                                    <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Values</h3>
                                    <ul className="space-y-4">
                                        {['Honesty', 'Integrity', 'Responsibility', 'Consistency', 'Discipline'].map((val) => (
                                            <li key={val} className="flex items-center gap-3 text-sm text-neutral-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                                {val}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                    <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Commitment</h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed italic">
                                        "Success is not defined solely by achievements, but by character, consistency, and the ability to grow through both success and failure."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export { AboutMe };
