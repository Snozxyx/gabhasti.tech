import { useState, useEffect } from 'react';
import { Globe, Clock, TrendingUp, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SectionHeader, StatCard, LoadingSpinner } from './AdminShared';

export const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        avgTimeOnPage: 0,
        topPages: [] as any[],
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('analytics')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setAnalytics(data || []);

            const uniqueSessions = new Set(data?.map((a: any) => a.session_id) || []);
            const totalTime = data?.reduce((sum: number, a: any) => sum + (a.time_on_page || 0), 0) || 0;
            const pageViews: Record<string, number> = {};

            data?.forEach((a: any) => {
                pageViews[a.page_path] = (pageViews[a.page_path] || 0) + 1;
            });

            const topPages = Object.entries(pageViews)
                .map(([path, count]) => ({ path, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setStats({
                totalViews: data?.length || 0,
                uniqueVisitors: uniqueSessions.size,
                avgTimeOnPage: data?.length ? Math.round(totalTime / data.length) : 0,
                topPages,
            });
        } catch (error) {
            toast.error('Failed to load intelligence');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Analytics" subtitle="Data" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Network Traffic" value={stats.totalViews} icon={TrendingUp} />
                <StatCard label="Unique Nodes" value={stats.uniqueVisitors} icon={Users} />
                <StatCard label="Avg Engagement" value={`${stats.avgTimeOnPage}s`} icon={Clock} />
                <StatCard label="Entry Points" value={stats.topPages.length} icon={Globe} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-white/5 bg-neutral-900/10 rounded-sm p-6 overflow-hidden">
                    <h3 className="text-lg font-light text-white mb-6 uppercase tracking-wider text-xs font-mono text-neutral-500">// Top Traversed Paths</h3>
                    <div className="space-y-4">
                        {stats.topPages.map((page, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <span className="text-sm text-neutral-400 font-mono group-hover:text-white transition-colors">{page.path}</span>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden w-24">
                                        <div
                                            className="h-full bg-white transition-all duration-1000"
                                            style={{ width: `${(page.count / stats.totalViews) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-mono text-white w-8 text-right">{page.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-white/5 bg-neutral-900/10 rounded-sm p-6">
                    <h3 className="text-lg font-light text-white mb-6 uppercase tracking-wider text-xs font-mono text-neutral-500">// Real-time Stream</h3>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-4">
                            {analytics.slice(0, 5).map((item) => (
                                <div key={item.id} className="text-xs border-b border-white/[0.02] pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-neutral-200 font-mono">{item.page_path}</span>
                                        <span className="text-neutral-600 font-mono italic">{format(new Date(item.created_at), 'HH:mm:ss')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-neutral-500">
                                        {item.country && (
                                            <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                                                <MapPin className="w-3 h-3" />
                                                {item.country}
                                            </span>
                                        )}
                                        {item.time_on_page > 0 && (
                                            <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                                                <Clock className="w-3 h-3" />
                                                {item.time_on_page}s
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
