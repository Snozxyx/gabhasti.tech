import { useState, useEffect } from 'react';
import { Users, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SectionHeader, ActionButton, LoadingSpinner } from './AdminShared';
import { logAuditEvent } from '@/lib/audit';

export const AdminNetwork = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [banReason, setBanReason] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId: string, isBanned: boolean) => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!isBanned && !banReason.trim()) {
                toast.error('Add a reason before banning');
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    is_banned: !isBanned,
                    banned_until: null,
                    banned_reason: !isBanned ? banReason : null,
                })
                .eq('user_id', userId);

            if (error) throw error;

            if (!isBanned) {
                await supabase
                    .from('banned_users')
                    .insert({
                        user_id: userId,
                        banned_by: currentUser?.id || '',
                        reason: banReason,
                    });
            }
            await logAuditEvent({
                action: isBanned ? 'unban_user' : 'ban_user',
                target_type: 'user',
                target_id: userId,
                metadata: {
                    reason: !isBanned ? banReason : undefined,
                },
            });

            toast.success(isBanned ? 'User unbanned' : 'User banned');
            fetchUsers();
            setBanReason('');
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Users" subtitle="Database" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-2">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.user_id}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setBanReason(user.banned_reason || '');
                                }}
                                className={cn(
                                    "group bg-neutral-900/10 border p-4 rounded-sm hover:border-white/10 transition-colors cursor-pointer",
                                    selectedUser?.user_id === user.user_id && "border-white/20 bg-white/5"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.display_name} className="w-12 h-12 rounded-full border border-white/5" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-neutral-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-base font-medium text-white">{user.display_name || user.username || 'User'}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[10px] font-mono text-neutral-600">{format(new Date(user.created_at), 'MMM dd, yyyy')}</p>
                                                {user.username && (
                                                    <>
                                                        <span className="text-neutral-700">•</span>
                                                        <p className="text-[10px] font-mono text-neutral-600">@{user.username}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "text-[10px] font-mono px-2 py-0.5 rounded border",
                                            user.is_banned
                                                ? "border-red-500/20 text-red-400 bg-red-500/5"
                                                : "border-green-500/20 text-green-400 bg-green-500/5"
                                        )}>
                                            {user.is_banned ? 'BANNED' : 'ACTIVE'}
                                        </span>
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBan(user.user_id, !!user.is_banned);
                                            }}
                                            icon={Ban}
                                            variant={user.is_banned ? "default" : "danger"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedUser && (
                    <div className="border border-white/10 bg-neutral-900/10 rounded-sm p-6 space-y-6">
                        <h3 className="text-lg font-medium text-white">User Intelligence</h3>
                        <div className="space-y-4">
                            <ProfileAttribute label="Identity" value={selectedUser.display_name || 'Anonymous'} />
                            <ProfileAttribute label="Alias" value={`@${selectedUser.username || 'N/A'}`} mono />
                            <ProfileAttribute label="Status" value={selectedUser.is_banned ? 'Restricted' : 'Operational'} highlight={!selectedUser.is_banned} />
                            <ProfileAttribute label="Established" value={format(new Date(selectedUser.created_at), 'PPP')} />

                            {selectedUser.bio && (
                                <div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Brief</p>
                                    <p className="text-sm text-neutral-300 leading-relaxed italic">"{selectedUser.bio}"</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Restriction Reason</p>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    placeholder="Add context for the ban (required)"
                                    className="w-full bg-black/30 border border-white/10 rounded-sm text-white text-sm p-2 focus:outline-none focus:border-white/30 resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileAttribute = ({ label, value, mono, highlight }: { label: string, value: string, mono?: boolean, highlight?: boolean }) => (
    <div>
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn(
            "text-sm",
            highlight ? "text-green-400" : "text-white",
            mono && "font-mono"
        )}>
            {value}
        </p>
    </div>
);
