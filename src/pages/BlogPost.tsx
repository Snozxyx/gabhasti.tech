"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame,
  type MotionValue 
} from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { deleteBlogPost } from '@/lib/blog';
import { CommentSection } from '@/components/blog/CommentSection';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { BlogVideoPlayer } from '@/components/blog/BlogVideoPlayer';
import { BlogImage } from '@/components/blog/BlogImage';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ReadingTime } from '@/components/blog/ReadingTime';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { siteConfig } from "@/lib/seo";

// --- Helper Component: Grid Pattern (From Reference) ---
const GridPattern = ({ 
  offsetX, 
  offsetY, 
  className 
}: { 
  offsetX: MotionValue<number>, 
  offsetY: MotionValue<number>,
  className?: string
}) => {
  return (
    <svg className={cn("w-full h-full", className)}>
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neutral-800"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

// --- Main Component ---
export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(slug || '');
  const { user, isAdmin } = useAuth();
  const [adjacent, setAdjacent] = useState<{ prev?: { slug: string; title: string } | null; next?: { slug: string; title: string } | null }>({ prev: null, next: null });

  // Animation Refs & Motion Values
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  // Smooth mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Grid Animation
  useAnimationFrame((t) => {
    const speed = 0.25; 
    gridOffsetX.set((t * speed) % 50);
    gridOffsetY.set((t * speed) % 50);
  });

  // Spotlight mask
  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, white, transparent)`;

  const canEdit = user && post && (user.id === post.user_id || isAdmin);

  // Fetch next/previous posts by created_at (published only)
  useEffect(() => {
    const fetchAdjacent = async () => {
      if (!post) return;
      try {
        const { data: newer } = await supabase
          .from('blog_posts')
          .select('slug,title,created_at')
          .eq('is_published', true)
          .gt('created_at', post.created_at)
          .order('created_at', { ascending: true })
          .limit(1);

        const { data: older } = await supabase
          .from('blog_posts')
          .select('slug,title,created_at')
          .eq('is_published', true)
          .lt('created_at', post.created_at)
          .order('created_at', { ascending: false })
          .limit(1);

        setAdjacent({
          prev: older?.[0] ?? null,
          next: newer?.[0] ?? null,
        });
      } catch {
        // non-blocking
      }
    };

    fetchAdjacent();
  }, [post]);

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      await deleteBlogPost(post.id);
      toast.success('Post deleted');
      navigate('/blog');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };
      

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // --- Error State ---
  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-200">Post not found</h1>
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const contentType = post.content_type as 'markdown' | 'html' | 'text' || 'markdown';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-black text-white selection:bg-white/20 overflow-hidden"
    >
      <Seo
        title={post.title}
        description={post.excerpt || `${post.title} — by ${siteConfig.name}.`}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        image={post.cover_image_url || undefined}
        publishedTime={post.created_at}
        tags={post.tag ? [post.tag] : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt || undefined,
          datePublished: post.created_at,
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/blog/${post.slug}`,
          },
          image: post.cover_image_url ? [post.cover_image_url] : undefined,
        }}
      />
      <ReadingProgressBar />

      {/* --- Background Layers (Fixed) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* 1. Base Grid */}
        <div className="absolute inset-0 opacity-[0.1]">
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </div>

        {/* 2. Spotlight Grid */}
        <motion.div
          className="absolute inset-0 opacity-100 mix-blend-soft-light"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} className="text-white/30" />
        </motion.div>

        {/* 3. Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-[10%] -top-[20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[140px]" 
          />
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute -left-[10%] top-[40%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[140px]" 
          />
        </div>
      </div>

      {/* --- Foreground Content --- */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
          <div className="site-container h-20 flex items-center justify-between">
            <Link
              to="/blog"
              className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-xs font-mono uppercase tracking-widest">Back</span>
            </Link>
            {canEdit && (
              <div className="flex items-center gap-2">
                <Link to={`/admin/posts/edit/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/5">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-900/10">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="pt-32 pb-14 relative">
          <div className="site-container">
            <div className="reading-width text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Meta Data */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
                {post.tag && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                    <Tag className="w-3 h-3" />
                    {post.tag}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                </span>
                {post.view_count !== null && post.view_count > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    {post.view_count} views
                  </span>
                )}
                <ReadingTime content={post.content} contentType={contentType} />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 drop-shadow-2xl">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto italic">
                  {post.excerpt}
                </p>
              )}
            </motion.div>
            </div>
          </div>
        </header>

        {/* Media Section */}
        <div className="space-y-12">
          {post.cover_image_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="px-6"
            >
              <div className="max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                <BlogImage 
                  src={post.cover_image_url} 
                  alt={post.title}
                  className="!my-0 w-full"
                />
              </div>
            </motion.div>
          )}

          {post.video_url && (
             <div className="site-container">
              <div className="max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10">
                <BlogVideoPlayer url={post.video_url} />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <article className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="reading-width"
              >
                <MarkdownRenderer content={post.content} contentType={contentType} />
              </motion.div>
              
              {/* Table of Contents */}
              <div className="hidden lg:block">
                <TableOfContents 
                  content={post.content} 
                  contentType={contentType}
                />
              </div>
            </div>
          </div>
        </article>

        {/* Next / Previous */}
        <div className="pb-12">
          <div className="site-container">
            <div className="reading-width grid grid-cols-1 md:grid-cols-2 gap-4">
              {adjacent.prev ? (
                <Link
                  to={`/blog/${adjacent.prev.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Previous</p>
                  <p className="text-white text-xl leading-tight">{adjacent.prev.title}</p>
                </Link>
              ) : (
                <div />
              )}
              {adjacent.next ? (
                <Link
                  to={`/blog/${adjacent.next.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors md:text-right"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Next</p>
                  <p className="text-white text-xl leading-tight">{adjacent.next.title}</p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="px-6 pb-24">
          <div className="max-w-3xl mx-auto pt-12 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Discussion</h3>
            <CommentSection postId={post.id} postAuthorId={post.user_id} />
          </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black py-12 px-6 relative z-20">
          <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            <p>© 2026 GABHASTI</p>
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
          </div>
        </footer>

      </div>
  );
};