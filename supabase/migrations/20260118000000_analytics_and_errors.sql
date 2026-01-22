-- Migration for Analytics and Error Logging

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    time_on_page INTEGER DEFAULT 0, -- in seconds
    scroll_depth INTEGER DEFAULT 0, -- percentage
    activities JSONB DEFAULT '[]', -- array of activity objects
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_id TEXT UNIQUE NOT NULL, -- custom error ID
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    error_type TEXT NOT NULL, -- 'client', 'server', 'network', etc.
    error_message TEXT NOT NULL,
    error_stack TEXT,
    page_path TEXT,
    user_agent TEXT,
    ip_address TEXT,
    additional_data JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON public.analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_error_logs_error_id ON public.error_logs(error_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Anyone can insert analytics"
    ON public.analytics FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view analytics"
    ON public.analytics FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can update analytics"
    ON public.analytics FOR UPDATE
    USING (public.is_admin());

-- Error logs policies
CREATE POLICY "Anyone can insert error logs"
    ON public.error_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view error logs"
    ON public.error_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can update error logs"
    ON public.error_logs FOR UPDATE
    USING (public.is_admin());

-- Add trigger for updated_at on analytics
CREATE TRIGGER update_analytics_updated_at
    BEFORE UPDATE ON public.analytics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_id column to projects if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update projects policies to allow users to create their own projects
DROP POLICY IF EXISTS "Only admins can insert projects" ON public.projects;
CREATE POLICY "Users can insert their own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Only admins can update projects" ON public.projects;
CREATE POLICY "Users can update their own projects or admins can update any"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete projects" ON public.projects;
CREATE POLICY "Users can delete their own projects or admins can delete any"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
