import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  page_path: string;
  page_title?: string;
  referrer?: string;
  ip_address?: string;
  user_agent?: string;
  country?: string;
  city?: string;
  time_on_page?: number;
  scroll_depth?: number;
  activities?: any[];
}

export const trackPageView = async (event: AnalyticsEvent) => {
  try {
    const sessionId = getOrCreateSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('analytics').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      ...event,
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

export const trackActivity = async (activity: {
  type: string;
  data?: any;
  page_path: string;
}) => {
  try {
    const sessionId = getOrCreateSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    // Get current analytics record for this session/page
    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('session_id', sessionId)
      .eq('page_path', activity.page_path)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const activities = Array.isArray(existing?.activities) ? existing.activities : [];
    activities.push({
      ...activity,
      timestamp: new Date().toISOString(),
    });

    if (existing) {
      await supabase
        .from('analytics')
        .update({ activities })
        .eq('id', existing.id);
    } else {
      await supabase.from('analytics').insert({
        user_id: user?.id || null,
        session_id: sessionId,
        page_path: activity.page_path,
        activities,
      });
    }
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
};

export const updateTimeOnPage = async (pagePath: string, timeInSeconds: number) => {
  try {
    const sessionId = getOrCreateSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('session_id', sessionId)
      .eq('page_path', pagePath)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      await supabase
        .from('analytics')
        .update({ time_on_page: timeInSeconds })
        .eq('id', existing.id);
    }
  } catch (error) {
    console.error('Failed to update time on page:', error);
  }
};

export const updateScrollDepth = async (pagePath: string, depth: number) => {
  try {
    const sessionId = getOrCreateSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('session_id', sessionId)
      .eq('page_path', pagePath)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      await supabase
        .from('analytics')
        .update({ scroll_depth: Math.max(existing.scroll_depth || 0, depth) })
        .eq('id', existing.id);
    }
  } catch (error) {
    console.error('Failed to update scroll depth:', error);
  }
};

const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const getClientInfo = async () => {
  try {
    // Get IP and location (using a service like ipapi.co)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip_address: data.ip,
      country: data.country_name,
      city: data.city,
    };
  } catch (error) {
    return {
      ip_address: null,
      country: null,
      city: null,
    };
  }
};
