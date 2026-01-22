import { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionHeader, LoadingSpinner } from './AdminShared';

export const AdminLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [auditLoading, setAuditLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
        fetchAuditLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('error_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            toast.error('Failed to retrieve system logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            setAuditLoading(true);
            const { data, error } = await (supabase as any)
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setAuditLogs(data || []);
        } catch (error) {
            toast.error('Failed to retrieve audit logs');
        } finally {
            setAuditLoading(false);
        }
    };

    const handleResolve = async (logId: string) => {
        try {
            const { error } = await supabase
                .from('error_logs')
                .update({ resolved: true, resolved_at: new Date().toISOString() })
                .eq('id', logId);

            if (error) throw error;
            toast.success('Incident resolved');
            setLogs(logs.map(log => log.id === logId ? { ...log, resolved: true } : log));
        } catch (error) {
            toast.error('Failed to resolve incident');
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="System Logs" subtitle="Terminal" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-2">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                className={cn(
                                    "bg-neutral-900/10 border p-4 rounded-sm cursor-pointer transition-all duration-300",
                                    log.resolved ? "border-white/5 opacity-40 grayscale" : "border-white/10 hover:border-white/20",
                                    selectedLog?.id === log.id && "border-indigo-500/30 bg-indigo-500/5 opacity-100 grayscale-0"
                                )}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <code className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{log.error_id}</code>
                                        <p className="text-sm text-white mt-1 font-medium truncate">{log.error_message}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {log.resolved ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-600">
                                    <span className="uppercase tracking-tighter">{log.error_type}</span>
                                    {log.page_path && <span className="truncate max-w-[150px]">{log.page_path}</span>}
                                    <span className="flex-shrink-0">{format(new Date(log.created_at), 'MMM dd, HH:mm')}</span>
                                </div>
                            </div>
                        ))
                    )}
                    {logs.length === 0 && !loading && (
                        <div className="text-center py-20 border border-white/5 rounded-sm bg-neutral-900/10 opacity-50">
                            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">System Integrity Nominal.</p>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-24 h-fit">
                    {selectedLog ? (
                        <div className="border border-white/10 bg-neutral-900/10 rounded-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-neutral-500" />
                                    <span className="text-xs font-mono text-white uppercase tracking-widest">Metadata</span>
                                </div>
                                {!selectedLog.resolved && (
                                    <Button
                                        onClick={() => handleResolve(selectedLog.id)}
                                        size="sm"
                                        className="bg-white text-black hover:bg-neutral-200 text-[10px] h-7 px-3 font-mono uppercase"
                                    >
                                        Resolve
                                    </Button>
                                )}
                            </div>
                            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
                                <LogField label="Identifier" value={selectedLog.error_id} mono />
                                <LogField label="Classification" value={selectedLog.error_type} highlight />
                                <LogField label="Payload" value={selectedLog.error_message} />

                                {selectedLog.page_path && (
                                    <LogField label="Source Path" value={selectedLog.page_path} mono small />
                                )}

                                {selectedLog.error_stack && (
                                    <div>
                                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Stack Visualization</p>
                                        <pre className="text-[10px] font-mono text-neutral-400 bg-black p-4 rounded border border-white/5 overflow-x-auto leading-relaxed">
                                            {selectedLog.error_stack}
                                        </pre>
                                    </div>
                                )}

                                <LogField label="Timestamp" value={format(new Date(selectedLog.created_at), 'PPPpppp')} small />
                            </div>
                        </div>
                    ) : (
                        <div className="border border-white/5 bg-neutral-900/5 rounded-sm p-12 text-center flex flex-col items-center justify-center opacity-30 grayscale">
                            <Terminal className="w-8 h-8 text-neutral-600 mb-4" />
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">Select individual log for detailed telemetry</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="border border-white/5 bg-neutral-900/10 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <SectionHeader title="Audit Trail" subtitle="Admin Actions" />
                </div>
                {auditLoading ? (
                    <LoadingSpinner />
                ) : auditLogs.length > 0 ? (
                    <div className="space-y-3">
                        {auditLogs.map((audit) => (
                            <div key={audit.id} className="bg-black/20 border border-white/5 rounded-sm p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">{audit.action}</span>
                                    <span className="text-[10px] font-mono text-neutral-600">{format(new Date(audit.created_at), 'MMM dd, HH:mm')}</span>
                                </div>
                                <div className="text-sm text-white mt-1">
                                    {audit.target_type && (
                                        <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                                            {audit.target_type}: {audit.target_id || 'n/a'}
                                        </span>
                                    )}
                                </div>
                                {audit.metadata && Object.keys(audit.metadata).length > 0 && (
                                    <pre className="mt-2 text-[10px] font-mono text-neutral-400 bg-black/30 p-2 rounded border border-white/5 overflow-x-auto">
                                        {JSON.stringify(audit.metadata, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-neutral-500 font-mono text-sm py-8 tracking-widest uppercase opacity-50">// No Audit Events</p>
                )}
            </div>
        </div>
    );
};

const LogField = ({ label, value, mono, highlight, small }: { label: string, value: string, mono?: boolean, highlight?: boolean, small?: boolean }) => (
    <div>
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn(
            small ? "text-xs" : "text-sm",
            highlight ? "text-red-400" : "text-white",
            mono && "font-mono",
            "leading-relaxed"
        )}>
            {value}
        </p>
    </div>
);
