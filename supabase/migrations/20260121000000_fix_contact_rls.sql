-- Fix contact_messages RLS policies to ensure anonymous inserts work
-- This migration ensures that anyone can submit contact messages

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can delete contact messages" ON public.contact_messages;

-- Ensure RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies with explicit anonymous access
CREATE POLICY "Anyone can insert contact messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

-- Only admins can view messages
CREATE POLICY "Only admins can view contact messages"
    ON public.contact_messages FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can update contact messages"
    ON public.contact_messages FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete contact messages"
    ON public.contact_messages FOR DELETE
    USING (public.is_admin());