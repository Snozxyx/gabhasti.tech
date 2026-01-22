import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type CommentWithExtras = Tables<'comments'> & {
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  replies?: CommentWithExtras[];
};

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<CommentWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select('*')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          // Fetch profiles for comment and replies
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', comment.user_id)
            .maybeSingle();

          const repliesWithProfiles = await Promise.all(
            (replies || []).map(async (reply) => {
              const { data: replyProfile } = await supabase
                .from('profiles')
                .select('display_name, avatar_url')
                .eq('user_id', reply.user_id)
                .maybeSingle();
              return { ...reply, profile: replyProfile };
            })
          );

          return {
            ...comment,
            profile,
            replies: repliesWithProfiles,
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) throw new Error('Not authenticated');

    const { error } = await supabase.from('comments').insert({
      content,
      post_id: postId,
      user_id: session.session.user.id,
      parent_id: parentId || null,
    });

    if (error) throw error;
    await fetchComments();
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    await fetchComments();
  };

  const pinComment = async (commentId: string, isPinned: boolean) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('comments')
      .update({ 
        is_pinned: isPinned, 
        pinned_by: isPinned ? session.session.user.id : null 
      })
      .eq('id', commentId);

    if (error) throw error;
    await fetchComments();
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return { comments, loading, error, addComment, deleteComment, pinComment, refetch: fetchComments };
};
