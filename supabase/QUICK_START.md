# Quick Start - Admin Backend Recreation

## Apply the Migration

### Using Supabase CLI (Fastest)
```bash
supabase db push
```

### Using Supabase Dashboard
1. Open SQL Editor in Supabase Dashboard
2. Copy entire content of `20260120000000_complete_backend_recreation.sql`
3. Paste and execute

## Set Admin User

Run this SQL (replace email):

```sql
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    END IF;
END $$;
```

## Verify Setup

```sql
-- Check admin function exists
SELECT public.is_admin();

-- Check your admin status
SELECT ur.role, u.email 
FROM user_roles ur 
JOIN auth.users u ON ur.user_id = u.id 
WHERE u.email = 'YOUR_EMAIL@example.com';
```

## What's Included

✅ All database tables (profiles, blog_posts, comments, projects, etc.)
✅ Helper functions (is_admin, has_role, is_user_banned)
✅ Row Level Security policies
✅ Storage buckets (blog-images, avatars)
✅ Triggers for auto-updating timestamps
✅ User signup trigger

## Admin Features

- **Overview**: Dashboard with stats
- **Journal**: Blog post management
- **Projects**: Project management
- **Network**: Comments and messages
- **Profiles**: User management
- **Safety**: Ban/unban users
- **Analytics**: View analytics data
- **Logs**: Error log management

## Troubleshooting

**Can't access admin?**
- Check you have admin role: `SELECT * FROM user_roles WHERE user_id = auth.uid();`
- Verify `is_admin()` function exists

**RLS blocking queries?**
- Re-run the migration
- Check policies: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`

**Storage not working?**
- Verify buckets exist: Check Storage in Supabase Dashboard
- Check policies are applied
