import { Link } from 'react-router-dom';
import { FileText, Eye, TrendingUp, MessageSquare, Users, Ban, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { StatCard, SectionHeader } from './AdminShared';
import { cn } from '@/lib/utils';

interface AdminOverviewProps {
    stats: {
        totalPosts: number;
        publishedPosts: number;
        totalViews: number;
        totalComments: number;
        totalUsers: number;
        bannedUsers: number;
        contactMessages: number;
    };
    posts: any[];
    statsLoading: boolean;
}

export const AdminOverview = ({ stats, posts, statsLoading }: AdminOverviewProps) => {
    return (
        <div className="space-y-12">
            <SectionHeader title="System Status" subtitle="Dashboard" />

            {statsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="p-6 border border-white/5 bg-neutral-900/10 rounded-sm animate-pulse">
                            <div className="h-4 bg-neutral-800 rounded mb-4 w-24" />
                            <div className="h-8 bg-neutral-800 rounded w-16" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <StatCard label="Total Journal Entries" value={stats.totalPosts} icon={FileText} />
                    <StatCard label="Published" value={stats.publishedPosts} icon={Eye} />
                    <StatCard label="Total Reads" value={stats.totalViews} icon={TrendingUp} />
                    <StatCard label="Community Comments" value={stats.totalComments} icon={MessageSquare} />
                    <StatCard label="Contact Messages" value={stats.contactMessages} icon={MessageSquare} />
                    <StatCard label="Registered Users" value={stats.totalUsers} icon={Users} />
                    <StatCard label="Restricted Accounts" value={stats.bannedUsers} icon={Ban} isWarning />
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-light text-white">Recent Activity</h2>
                    <Link to="/admin/posts/new" className="text-xs font-mono text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
                        CREATE NEW <Plus className="w-3 h-3" />
                    </Link>
                </div>

                <div className="space-y-1">
                    {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="group flex items-center justify-between py-4 px-4 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-2 h-2 rounded-full", post.is_published ? "bg-green-500/50" : "bg-neutral-800")} />
                                <div>
                                    <h3 className="text-sm font-medium text-white group-hover:text-neutral-200">{post.title}</h3>
                                    <p className="text-[10px] font-mono text-neutral-600 uppercase mt-1">
                                        {format(new Date(post.created_at), 'MMM dd')} • {post.view_count || 0} READS
                                    </p>
                                </div>
                            </div>
                            <Link to={`/admin/posts/edit/${post.slug}`}>
                                <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
