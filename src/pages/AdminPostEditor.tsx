import { useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BlogPostEditor } from '@/components/blog/BlogPostEditor';
import { useAuth } from '@/hooks/useAuth';
import { useBlogPost } from '@/hooks/useBlogPosts';

export const AdminPostEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { post, loading: postLoading, error: postError } = useBlogPost(slug || '');

  // Remove backend auth logic - always allow access for mockup
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate('/auth');
  //   }
  // }, [user, authLoading, navigate]);

  // useEffect(() => {
  //   if (!authLoading && !postLoading && slug && post) {
  //     if (user?.id !== post.user_id && !isAdmin) {
  //       navigate('/blog');
  //     }
  //   }
  // }, [user, isAdmin, authLoading, postLoading, post, slug, navigate]);

  // Auth check - allow all authenticated users to create posts
  useEffect(() => {
    // Don't redirect while loading
    if (authLoading) return;

    // If no user, redirect to auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // For new posts, any authenticated user can create
    // For editing, check permissions below
  }, [user, authLoading, navigate]);

  // Permission check for editing - only check if we have a slug and post
  useEffect(() => {
    if (authLoading || postLoading) return;
    
    // If no slug, it's a new post - allow if user is authenticated
    if (!slug) {
      if (!user) {
        navigate('/auth');
      }
      return;
    }
    
    // If we have a slug but no post yet, wait
    if (slug && postLoading) return;
    
    // If we have a slug and post is loaded
    if (slug && post) {
      // Allow editing if user owns the post OR is admin
      if (user?.id !== post.user_id && !isAdmin) {
        navigate('/blog');
      }
    } else if (slug && !post && !postLoading) {
      // Post not found - redirect to blog
      navigate('/blog');
    }
  }, [user, isAdmin, authLoading, postLoading, post, slug, navigate]);

  // --- Loading State ---
  if (authLoading || (slug && postLoading)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 animate-pulse">
          Loading Editor...
        </p>
      </div>
    );
  }

  // --- Error State ---
  if (slug && (postError || !post)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-200">Post not found</h1>
            <button
            onClick={() => window.history.back()}
            className="text-neutral-400 hover:text-white font-mono text-sm uppercase tracking-widest block"
            >
            ← Back to previous page
            </button>
        </div>
      </div>
    );
  }

  const isEditing = !!slug;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-3 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.15em] font-medium">Dashboard</span>
          </Link>
          
          <div className="text-xs font-mono uppercase tracking-[0.15em] text-neutral-500">
            {isEditing ? "Mode: Revision" : "Mode: Creation"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Title Section */}
          <header>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
              // {isEditing ? 'Edit' : 'Create'}
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
          </header>

          {/* Editor Container */}
          <div className="border border-white/5 bg-neutral-900/10 rounded-sm">
            <div className="p-8 md:p-10">
              <BlogPostEditor
                post={post || undefined}
                onSave={() => navigate('/admin')}
                onCancel={() => navigate('/admin')}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};