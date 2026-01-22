import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Trash2, Mail, MailCheck } from 'lucide-react';
import { SectionHeader, ActionButton, LoadingSpinner } from './AdminShared';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminEmailsProps {
  messages: any[];
  loading: boolean;
  handleMessageMarkRead: (id: string, read: boolean) => Promise<void>;
  handleMessageDelete: (id: string) => Promise<void>;
  handleMessageMarkReplied: (id: string, replied: boolean) => Promise<void>;
}

export const AdminEmails = ({ messages, loading, handleMessageMarkRead, handleMessageDelete, handleMessageMarkReplied }: AdminEmailsProps) => {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeader title="Emails" subtitle="Contact" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-1">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={cn(
                    'p-4 border rounded-sm cursor-pointer',
                    selected?.id === m.id ? 'bg-white/5 border-white/20' : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{m.subject || 'No Subject'}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{m.name} • {m.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <ActionButton onClick={(e: any) => { e.stopPropagation(); handleMessageMarkRead(m.id, m.read); }} active={m.read} icon={Eye} />
                      <ActionButton onClick={(e: any) => { e.stopPropagation(); handleMessageMarkReplied(m.id, m.replied); }} active={m.replied} icon={m.replied ? MailCheck : Mail} />
                      <ActionButton onClick={(e: any) => { e.stopPropagation(); handleMessageDelete(m.id); }} icon={Trash2} />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-3 font-mono">{format(new Date(m.created_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-20 border border-white/5 rounded-sm bg-neutral-900/10">
                  <p className="text-neutral-500 font-mono text-sm">No contact messages.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2">
          {selected ? (
            <div className="border border-white/10 bg-neutral-900/10 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Message Details</h3>
                <div className="flex items-center gap-2">
                  {!selected.read && (
                    <Button onClick={() => handleMessageMarkRead(selected.id, selected.read)} size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/10">Mark Read</Button>
                  )}
                  <Button onClick={() => handleMessageMarkReplied(selected.id, selected.replied)} size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/10">{selected.replied ? 'Mark Replied' : 'Mark Replied'}</Button>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-neutral-500 mb-1">From</p>
                  <p className="text-white">{selected.name}</p>
                  <p className="text-neutral-400 text-xs mt-1">{selected.email}</p>
                </div>

                {selected.subject && (
                  <div>
                    <p className="text-neutral-500 mb-1">Subject</p>
                    <p className="text-white">{selected.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-neutral-500 mb-1">Message</p>
                  <p className="text-white leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div>
                  <p className="text-neutral-500 mb-1">Meta</p>
                  <p className="text-white text-xs">IP: {selected.ip_address || '—'}</p>
                  <p className="text-white text-xs mt-1">User Agent: {selected.user_agent || '—'}</p>
                </div>

                <div>
                  <p className="text-neutral-500 mb-1">Received</p>
                  <p className="text-white text-xs">{format(new Date(selected.created_at), 'PPpp')}</p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button onClick={() => handleMessageMarkRead(selected.id, selected.read)} size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/10">Toggle Read</Button>
                  <Button onClick={() => handleMessageMarkReplied(selected.id, selected.replied)} size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/10">Toggle Replied</Button>
                  <Button onClick={() => { if (confirm('Delete this message?')) handleMessageDelete(selected.id); }} size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10">Delete</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border border-white/5 rounded-sm bg-neutral-900/10">
              <p className="text-neutral-500 font-mono text-sm">Select a message to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
