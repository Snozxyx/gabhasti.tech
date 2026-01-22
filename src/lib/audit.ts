import { supabase } from '@/integrations/supabase/client';

export type AuditAction =
  | 'admin_sign_in'
  | 'admin_tab_view'
  | 'ban_user'
  | 'unban_user';

export interface AuditLogEntry {
  action: AuditAction | string;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, any>;
}

export const logAuditEvent = async (entry: AuditLogEntry) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // `audit_logs` isn't in generated types yet; keep runtime working.
    const { error } = await (supabase as any).from('audit_logs').insert({
      actor_id: user.id,
      action: entry.action,
      target_type: entry.target_type,
      target_id: entry.target_id,
      metadata: entry.metadata || {},
    });

    if (error) {
      console.error('[Audit] Failed to write audit log', error);
    }
  } catch (error) {
    console.error('[Audit] Unexpected error', error);
  }
};
