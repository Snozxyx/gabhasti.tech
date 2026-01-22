import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type BlogPost = Tables<'blog_posts'>;

interface UseBlogPostsOptions {
  publishedOnly?: boolean;
  limit?: number;
  userId?: string;
}

export const useBlogPosts = (options: UseBlogPostsOptions = {}) => {
  const { publishedOnly = true, limit, userId } = options;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    console.log("[useBlogPosts] Fetching posts...", { publishedOnly, limit, userId });
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('is_published', true);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      console.log("[useBlogPosts] Fetch result:", { count: data?.length, error });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("[useBlogPosts] Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
      console.log("[useBlogPosts] Loading: false");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [publishedOnly, limit, userId]);

  return { posts, loading, error, refetch: fetchPosts };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        setPost(data);

        // Increment view count
        if (data) {
          await supabase
            .from('blog_posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
};
