import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { siteConfig } from "@/lib/seo";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<'projects'>;

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("is_visible", true)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProjects(data);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            <Seo
                title="Projects"
                description="Selected work and featured projects by Gabhasti Giri Sinha."
                canonicalPath="/projects"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    name: "Projects",
                    url: `${siteConfig.url}/projects`,
                }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <span className="text-neutral-500 font-mono text-sm tracking-widest uppercase mb-4 block">
              // Selected Works
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                            Featured<br />
                            <span className="text-neutral-500 italic">Projects.</span>
                        </h1>
                    </motion.div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AnimatePresence mode="popLayout">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="group relative"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-900 border border-white/5">
                                            {project.image_url ? (
                                                <img
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-800">
                                                    <Github className="w-20 h-20 opacity-20" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                                <div>
                                                    <div className="flex gap-2 mb-3">
                                                        {project.tags?.map((tag) => (
                                                            <span key={tag} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-neutral-300">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform">
                                                        {project.title}
                                                    </h3>
                                                </div>

                                                <div className="flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                    {project.github_url && (
                                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                                            <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white text-white hover:text-black border-white/10 backdrop-blur-md">
                                                                <Github className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {project.live_url && (
                                                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                                            <Button size="icon" variant="secondary" className="rounded-full bg-white text-black hover:bg-neutral-200 border-none">
                                                                <ArrowUpRight className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 px-4">
                                            <p className="text-neutral-500 line-clamp-2 leading-relaxed text-sm">
                                                {project.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && projects.length === 0 && (
                        <div className="text-center py-40 border border-white/5 rounded-3xl bg-neutral-900/50">
                            <p className="text-neutral-500 font-mono italic">No projects highlighted yet.</p>
                            <p className="text-neutral-600 text-sm mt-2">Visit my github.com/snozxyx to see more.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export { Projects };
