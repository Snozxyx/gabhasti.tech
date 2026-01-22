-- Migration for Portfolio Expansion

-- 1. Add spotlight feature to blog posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS is_spotlight BOOLEAN DEFAULT false;

-- 2. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    github_url TEXT,
    live_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    is_github_repo BOOLEAN DEFAULT false,
    github_repo_id TEXT UNIQUE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Project Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects are viewable by everyone') THEN
        CREATE POLICY "Projects are viewable by everyone" ON public.projects
            FOR SELECT USING (is_visible = true OR (auth.uid() IS NOT NULL AND public.is_admin()));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Only admins can insert projects') THEN
        CREATE POLICY "Only admins can insert projects" ON public.projects
            FOR INSERT WITH CHECK (public.is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Only admins can update projects') THEN
        CREATE POLICY "Only admins can update projects" ON public.projects
            FOR UPDATE USING (public.is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Only admins can delete projects') THEN
        CREATE POLICY "Only admins can delete projects" ON public.projects
            FOR DELETE USING (public.is_admin());
    END IF;
END $$;

-- 3. Set admin role for specific email
-- Note: This assumes the user already exists in auth.users
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'gabhastigirisinha@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Check if role already exists
        IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id) THEN
            UPDATE public.user_roles SET role = 'admin' WHERE user_id = target_user_id;
        ELSE
            INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'admin');
        END IF;
    END IF;
END $$;
