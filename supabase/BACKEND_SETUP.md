# Admin Backend Setup Guide

This guide explains how to set up and apply the complete backend recreation for the admin system.

## Overview

The backend is entirely Supabase-based with the following features:

1. **User Management**: Profiles, roles, and authentication
2. **Content Management**: Blog posts, comments, projects
3. **Admin Dashboard**: Overview, analytics, logs, safety controls
4. **Communication**: Contact messages, comments moderation
5. **Analytics & Monitoring**: Page views, error logging

## Database Schema

### Core Tables
- `profiles` - User profiles
- `user_roles` - User role assignments (admin/user)
- `blog_posts` - Blog/journal entries
- `comments` - Post comments
- `projects` - Portfolio projects
- `banned_users` - User ban records
- `analytics` - Page analytics
- `error_logs` - Error tracking
- `contact_messages` - Contact form submissions

## Applying the Migration

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project root
cd d:\Gabhasti.tech

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20260120000000_complete_backend_recreation.sql`
4. Paste and run the SQL in the SQL Editor

### Option 3: Using Supabase Migration Tool

```bash
# Apply all migrations
supabase migration up
```

## Setting Up Admin User

After applying the migration, you need to set an admin user. You can do this in two ways:

### Method 1: Via SQL (Recommended)

```sql
-- Replace 'your-email@example.com' with your admin email
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'your-email@example.com';
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    END IF;
END $$;
```

### Method 2: Uncomment in Migration

Edit `supabase/migrations/20260120000000_complete_backend_recreation.sql` and uncomment the admin setup section at the bottom, then update the email address.

## Features Included

### 1. Overview Dashboard
- Total posts, published posts, views
- Total comments, users, banned users
- Contact messages count
- Recent activity feed

### 2. Journal Management
- View all blog posts (published and drafts)
- Publish/unpublish posts
- Delete posts
- View post statistics

### 3. Projects Management
- View all projects
- Toggle project visibility
- Delete projects

### 4. Network/Comms
- Manage comments (pin, delete)
- View and manage contact messages
- Mark messages as read/unread

### 5. User Profiles
- View all user profiles
- Ban/unban users
- View user details

### 6. Safety Controls
- Auto-moderation settings
- Restricted keywords management
- View banned users list
- Unban users

### 7. Analytics
- Page view statistics
- Unique visitors tracking
- Top pages analysis
- Real-time activity stream

### 8. System Logs
- Error log viewing
- Error resolution tracking
- Detailed error information

## Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Admin-only access**: Sensitive operations require admin role
- **User isolation**: Users can only modify their own content
- **Banned user checks**: Banned users cannot create content

## Storage Buckets

Two storage buckets are created:
- `blog-images`: For blog post images
- `avatars`: For user profile avatars

Both buckets have appropriate RLS policies for public viewing and authenticated uploads.

## Troubleshooting

### Issue: Admin check fails
**Solution**: Ensure the `is_admin()` function exists and your user has the admin role in `user_roles` table.

### Issue: Cannot access admin panel
**Solution**: 
1. Verify you're logged in
2. Check that your user has `role = 'admin'` in `user_roles` table
3. Check browser console for errors

### Issue: RLS policies blocking queries
**Solution**: Ensure all policies are correctly applied. Run the migration again if needed.

### Issue: Storage uploads fail
**Solution**: 
1. Verify storage buckets exist
2. Check storage policies are applied
3. Ensure user is authenticated

## Verifying Setup

After applying the migration, verify:

1. **Functions exist**:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('is_admin', 'has_role', 'is_user_banned');
   ```

2. **Tables exist**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('profiles', 'user_roles', 'blog_posts', 'comments', 'projects', 'analytics', 'error_logs', 'contact_messages', 'banned_users');
   ```

3. **RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('profiles', 'user_roles', 'blog_posts', 'comments', 'projects', 'analytics', 'error_logs', 'contact_messages', 'banned_users');
   ```

4. **Admin role assigned**:
   ```sql
   SELECT ur.*, u.email 
   FROM user_roles ur 
   JOIN auth.users u ON ur.user_id = u.id 
   WHERE ur.role = 'admin';
   ```

## Next Steps

1. Apply the migration
2. Set up your admin user
3. Test the admin panel at `/admin`
4. Verify all features are working
5. Generate new TypeScript types if needed:
   ```bash
   supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```

## Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Review browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure Supabase client is properly initialized
