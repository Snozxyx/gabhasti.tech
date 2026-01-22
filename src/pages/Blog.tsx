"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, User, Plus } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Blog = () => {
  const { posts, loading } = useBlogPosts();
  const { user } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tag?.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-mono uppercase tracking-widest">Back</span>
          </Link>
          <span className="text-sm font-bold tracking-tight">
            GABHASTI<span className="text-neutral-600">.</span>
          </span>
          <div className="flex items-center gap-3">
            {user && (
              <Link
                to="/profile"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            {user && (
              <Link
                to="/admin/posts/new"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Create Post"
              >
                <Plus className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
              // 03 — Journal
            </span>
            <h1 className="text-5xl md:text-8xl font-medium tracking-tighter text-white">
              Written <br className="hidden md:block" />
              <span className="text-neutral-500">Thoughts.</span>
            </h1>
          </div>
          <p className="max-w-xl text-neutral-400 font-light leading-relaxed text-sm md:text-base">
            Exploring the intersection of design, technology, and philosophy. 
            A collection of ideas on building the future of the digital landscape.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/40 border-white/10 focus:border-white/20 text-white h-14 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-4 text-sm text-neutral-500">
              Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </p>
          )}
        </motion.div>
      </header>

      {/* Grid */}
      <main className="px-6 md:px-12 pb-40 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-neutral-500 text-center py-12">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">
              {searchQuery ? 'No posts found matching your search' : 'No posts yet'}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {filteredPosts.map((post, index) => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                index={index}
                isHovered={hoveredIndex === index}
                isDimmed={hoveredIndex !== null && hoveredIndex !== index}
                onHover={() => setHoveredIndex(index)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-600">
          <p>© 2026 GABHASTI</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://github.com/snozxyx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a>
            <a href="mailto:contact@gabhasti.tech" className="hover:text-white transition-colors">Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
