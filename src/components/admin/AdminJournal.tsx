import { Link } from 'react-router-dom';
import { Plus, Eye, EyeOff, Edit, Trash2, Pin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { SectionHeader, ActionButton } from './AdminShared';
import { cn } from '@/lib/utils';

interface AdminJournalProps {
    posts: any[];
    handleTogglePublish: (id: string, isPublished: boolean) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
}

export const AdminJournal = ({ posts, handleTogglePublish, handleDelete }: AdminJournalProps) => {
    return (
        <div className="space-y-8">
            <SectionHeader title="Journal Entries" subtitle="Content">
                <Link to="/admin/posts/new">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 uppercase text-xs tracking-wider">
                        <Plus className="w-4 h-4 mr-2" /> New Entry
                    </Button>
                </Link>
            </SectionHeader>

            <div className="grid gap-2">
                {posts.map((post) => (
                    <div key={post.id} className="group bg-neutral-900/10 border border-white/5 p-4 rounded-sm hover:border-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-16 h-12 bg-neutral-900 border border-white/5 rounded-sm overflow-hidden flex-shrink-0" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        {post.is_pinned && <Pin className="w-3 h-3 text-white" />}
                                        <h3 className="text-base font-medium text-white">{post.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={cn("text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm border", post.is_published ? "border-green-500/20 text-green-500" : "border-neutral-800 text-neutral-600")}>
                                            {post.is_published ? 'LIVE' : 'DRAFT'}
                                        </span>
                                        <span className="text-[10px] font-mono text-neutral-600">{format(new Date(post.created_at), 'MMM dd')}</span>
                                        <span className="text-[10px] font-mono text-neutral-600">{post.view_count || 0} views</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <ActionButton onClick={() => handleTogglePublish(post.id, !!post.is_published)} active={!!post.is_published} icon={post.is_published ? Eye : EyeOff} />
                                <Link to={`/admin/posts/edit/${post.slug}`}><ActionButton icon={Edit} /></Link>
                                <ActionButton onClick={() => handleDelete(post.id)} icon={Trash2} variant="danger" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
