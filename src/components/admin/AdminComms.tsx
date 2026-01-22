import { useState } from 'react';
import { Users, Pin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SectionHeader, ActionButton, LoadingSpinner } from './AdminShared';

interface AdminCommsProps {
    comments: any[];
    loading: boolean;
    handleDeleteComment: (id: string) => Promise<void>;
    handlePinComment: (id: string, isPinned: boolean) => Promise<void>;
}

export const AdminComms = ({
    comments,
    loading,
    handleDeleteComment,
    handlePinComment
}: AdminCommsProps) => {

    return (
        <div className="space-y-8">
            <SectionHeader title="Comments" subtitle="Community" />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-neutral-900/10 border border-white/5 p-4 rounded-sm hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    {comment.profiles?.avatar_url ? (
                                        <img src={comment.profiles.avatar_url} alt={comment.profiles.display_name} className="w-10 h-10 rounded-full border border-white/5" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-neutral-600" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {comment.is_pinned && <Pin className="w-3 h-3 text-indigo-400" />}
                                            <p className="text-sm text-white break-words">{comment.content}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <p className="text-[10px] font-mono text-neutral-600">
                                                {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                                            </p>
                                            <span className="text-neutral-700">•</span>
                                            <p className="text-[10px] font-mono text-neutral-600">
                                                {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ActionButton onClick={() => handlePinComment(comment.id, !!comment.is_pinned)} active={!!comment.is_pinned} icon={Pin} />
                                    <ActionButton onClick={() => handleDeleteComment(comment.id)} icon={Trash2} variant="danger" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <div className="text-center py-20 border border-white/5 rounded-sm bg-neutral-900/10">
                            <p className="text-neutral-500 font-mono text-sm">No comments found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
