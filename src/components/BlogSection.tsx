"use client";
import React from "react";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

export const BlogSection: React.FC = () => {
    const { posts, loading } = useBlogPosts({ limit: 4 });
    const featuredPost = posts[0];
    const gridPosts = posts.slice(1, 4);

    return (
        <section id="blog" className="relative w-full py-32 md:py-40 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/30 via-transparent to-transparent" />
            
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-10">
                <div className="mb-16 md:mb-24 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4"
                    >
                        Insights & Ideas
                    </motion.span>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
                    >
                        Journal
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-500 font-light max-w-lg mx-auto"
                    >
                        Thoughts on technology, design, and the digital world.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="text-neutral-500 text-center py-12">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-neutral-500 text-center py-12">No posts yet</div>
                ) : (
                    <>
                        {featuredPost && (
                            <BlogPostCard post={featuredPost} variant="featured" />
                        )}

                        <div className="grid md:grid-cols-3 gap-6">
                            {gridPosts.map((post, index) => (
                                <BlogPostCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    </>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link 
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                    >
                        View all posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
