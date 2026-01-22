import { supabase } from '@/integrations/supabase/client';

export interface ErrorLog {
  error_type: string;
  error_message: string;
  error_stack?: string;
  page_path?: string;
  user_agent?: string;
  ip_address?: string;
  additional_data?: any;
}

export const generateErrorId = (): string => {
  return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const logError = async (error: ErrorLog) => {
  try {
    const errorId = generateErrorId();
    let userId = null;
    try {
      const user = await account.get();
      userId = user?.$id || null;
    } catch {
      // User not authenticated
    }
    const sessionId = sessionStorage.getItem('analytics_session_id') || null;

    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ERROR_LOGS,
      ID.unique(),
      {
        error_id: errorId,
        user_id: userId,
        session_id: sessionId,
        ...error,
        resolved: false,
        created_at: new Date().toISOString(),
      }
    );

    return errorId;
  } catch (err) {
    console.error('Failed to log error:', err);
    return null;
  }
};
