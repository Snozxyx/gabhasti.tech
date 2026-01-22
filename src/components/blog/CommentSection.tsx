"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Pin, Trash2, Reply, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
}

export const CommentSection = ({ postId, postAuthorId }: CommentSectionProps) => {
  const { comments, loading, addComment, deleteComment, pinComment } = useComments(postId);
  const { user, isAdmin } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canModerate = isAdmin || user?.id === postAuthorId;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(newComment.trim());
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await addComment(replyContent.trim(), parentId);
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply added!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handlePin = async (commentId: string, isPinned: boolean) => {
    try {
      await pinComment(commentId, !isPinned);
      toast.success(isPinned ? 'Comment unpinned' : 'Comment pinned');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-8">
        <MessageSquare className="w-6 h-6" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="bg-black/50 border-white/10 text-white placeholder:text-neutral-600 resize-none mb-3"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-neutral-400 text-sm mb-2">Sign in to join the conversation</p>
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-neutral-500 text-center py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-neutral-500 text-center py-8">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  comment.is_pinned
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-white/5 border-white/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    {comment.profile?.avatar_url ? (
                      <img
                        src={comment.profile.avatar_url}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">
                        {comment.profile?.display_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-neutral-600">
                        {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {comment.is_pinned && (
                        <span className="flex items-center gap-1 text-xs text-yellow-500">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{comment.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {user && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors"
                        >
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      )}
                      {canModerate && (
                        <button
                          onClick={() => handlePin(comment.id, comment.is_pinned || false)}
                          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-yellow-500 transition-colors"
                        >
                          <Pin className="w-3 h-3" /> {comment.is_pinned ? 'Unpin' : 'Pin'}
                        </button>
                      )}
                      {(user?.id === comment.user_id || canModerate) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-4 border-l border-white/10">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="bg-black/50 border-white/10 text-white placeholder:text-neutral-600 resize-none mb-2 text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={submitting}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l border-white/10 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                              {reply.profile?.avatar_url ? (
                                <img
                                  src={reply.profile.avatar_url}
                                  alt=""
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-neutral-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white text-xs">
                                  {reply.profile?.display_name || 'Anonymous'}
                                </span>
                                <span className="text-[10px] text-neutral-600">
                                  {format(new Date(reply.created_at), 'MMM dd HH:mm')}
                                </span>
                              </div>
                              <p className="text-neutral-300 text-xs whitespace-pre-wrap">{reply.content}</p>
                              {(user?.id === reply.user_id || canModerate) && (
                                <button
                                  onClick={() => handleDelete(reply.id)}
                                  className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-red-500 transition-colors mt-2"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
