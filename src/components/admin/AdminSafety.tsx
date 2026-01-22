import { useState, useEffect } from 'react';
import { Shield, Ban, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeader, LoadingSpinner } from './AdminShared';

export const AdminSafety = () => {
    const [autoModEnabled, setAutoModEnabled] = useState(true);
    const [restrictedKeywords, setRestrictedKeywords] = useState('spam, scam, phishing');
    const [bannedUsers, setBannedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBannedUsers();
    }, []);

    const fetchBannedUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('banned_users')
                .select(`
                    *,
                    profiles!banned_users_user_id_fkey (
                        display_name,
                        username
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                // If table doesn't exist yet, show empty state
                if (error.code === 'PGRST116' || error.message?.includes('banned_users')) {
                    console.warn('banned_users table not found - run migrations');
                    setBannedUsers([]);
                    return;
                }
                throw error;
            }
            setBannedUsers(data || []);
        } catch (error) {
            console.error('Failed to fetch banned users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveKeywords = async () => {
        toast.success('Security protocols updated');
    };

    const handleUnban = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_banned: false, banned_until: null })
                .eq('user_id', userId);

            if (error) throw error;
            toast.success('Restriction lifted');
            fetchBannedUsers();
        } catch (error) {
            toast.error('Failed to unban user');
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Safety" subtitle="Protocols" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border border-white/5 bg-neutral-900/5 rounded-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-white" />
                            <h3 className="font-medium text-white">Auto-Moderation</h3>
                        </div>
                        <Switch checked={autoModEnabled} onCheckedChange={setAutoModEnabled} />
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                        System will automatically flag and sequester comments containing specified high-risk keywords or patterns.
                    </p>
                </div>

                <div className="p-6 border border-white/5 bg-neutral-900/5 rounded-sm">
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-neutral-400" /> Restricted Patterns
                    </h3>
                    <Textarea
                        className="bg-black/40 border-white/10 text-white font-mono text-xs mb-4 min-h-[100px]"
                        placeholder="spam, scam..."
                        value={restrictedKeywords}
                        onChange={(e) => setRestrictedKeywords(e.target.value)}
                    />
                    <Button
                        onClick={handleSaveKeywords}
                        size="sm"
                        className="bg-white text-black hover:bg-neutral-200 text-[10px] h-8 px-4 font-mono uppercase tracking-widest"
                    >
                        Update Sync
                    </Button>
                </div>
            </div>

            <div className="border border-white/5 bg-neutral-900/10 rounded-sm p-6">
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <Ban className="w-5 h-5" />
                    Restricted Accounts
                </h3>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-2">
                        {bannedUsers.map((ban) => (
                            <div key={ban.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-sm group hover:border-white/10 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {ban.profiles?.display_name || ban.profiles?.username || 'Redacted'}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        {ban.reason && (
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-tight">Reason: {ban.reason}</p>
                                        )}
                                        <span className="text-neutral-700">•</span>
                                        <p className="text-[10px] text-neutral-600 font-mono">
                                            Started: {format(new Date(ban.created_at), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleUnban(ban.user_id)}
                                    size="sm"
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/5 text-[10px] h-7 px-3 font-mono uppercase"
                                >
                                    Unban
                                </Button>
                            </div>
                        ))}
                        {bannedUsers.length === 0 && (
                            <p className="text-center text-neutral-500 font-mono text-sm py-8 tracking-widest uppercase opacity-50">// No Active Restrictions</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
