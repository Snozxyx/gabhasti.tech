import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { toast } from 'sonner';
import {
  BarChart3,
  FileText,
  MessageSquare,
  Users,
  LogOut,
  Shield,
  Terminal,
  Layout,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Modular Components
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminJournal } from '@/components/admin/AdminJournal';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminComms } from '@/components/admin/AdminComms';
import { AdminNetwork } from '@/components/admin/AdminNetwork';
import { AdminSafety } from '@/components/admin/AdminSafety';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminLogs } from '@/components/admin/AdminLogs';

type AdminTab = 'overview' | 'journal' | 'projects' | 'comms' | 'network' | 'safety' | 'analytics' | 'logs';

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { posts, refetch: refetchPosts } = useBlogPosts({ publishedOnly: false });

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [projects, setProjects] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalUsers: 0,
    bannedUsers: 0,
    contactMessages: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true); // Start as true to wait for check
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);
  
  // Track if initial data has been fetched to prevent duplicate calls
  const hasFetchedRef = useRef(false);

  // Check admin status directly when component mounts or user changes
  useEffect(() => {
    if (!user || authLoading) {
      setIsCheckingAdmin(false);
      return;
    }
    
    // If isAdmin is already true from context, we're good
    if (isAdmin) {
      console.log('[Admin] User is admin from context');
      setIsCheckingAdmin(false);
      setDirectAdminCheck(true);
      return;
    }
    
    // Double-check admin status directly - do it immediately
    const checkAdminDirectly = async () => {
      setIsCheckingAdmin(true);
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        console.log('[Admin] Direct admin check result:', { 
          role: data?.role, 
          error, 
          userId: user.id,
          isAdminFromContext: isAdmin 
        });
        
        if (error) {
          console.error('[Admin] Admin check error:', error);
          setDirectAdminCheck(false);
          setIsCheckingAdmin(false);
          return;
        }
        
        if (data?.role === 'admin') {
          console.log('[Admin] User IS admin - allowing access');
          setDirectAdminCheck(true);
          setIsCheckingAdmin(false);
          return;
        }
        
        // Not admin
        console.log('[Admin] User is NOT admin - will redirect');
        setDirectAdminCheck(false);
        setIsCheckingAdmin(false);
      } catch (err) {
        console.error('[Admin] Admin check exception:', err);
        setDirectAdminCheck(false);
        setIsCheckingAdmin(false);
      }
    };
    
    // Check immediately, but also wait a bit for AuthContext check
    checkAdminDirectly();
    
    // Also wait a bit for AuthContext to complete
    const timer = setTimeout(() => {
      // If AuthContext says admin, use that
      if (isAdmin) {
        setDirectAdminCheck(true);
        setIsCheckingAdmin(false);
      } else if (directAdminCheck === null) {
        // If direct check hasn't completed, check again
        checkAdminDirectly();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [user, authLoading]); // Remove isAdmin from deps to avoid loops

  // Update when isAdmin changes from context
  useEffect(() => {
    if (isAdmin && directAdminCheck === null) {
      console.log('[Admin] isAdmin changed to true from context');
      setDirectAdminCheck(true);
      setIsCheckingAdmin(false);
    }
  }, [isAdmin]);

  // Simple auth redirection - no duplicate checks
  useEffect(() => {
    if (authLoading || isCheckingAdmin) {
      console.log('[Admin] Waiting for checks...', { authLoading, isCheckingAdmin });
      return;
    }
    
    if (!user) {
      hasFetchedRef.current = false;
      navigate('/auth');
      return;
    }
    
    // Only redirect if we've confirmed user is not admin
    // Wait for directAdminCheck to complete (not null) before making decision
    if (directAdminCheck === null) {
      console.log('[Admin] Admin check still in progress, waiting...', { directAdminCheck, isAdmin });
      return; // Wait for check to complete
    }
    
    // Use directAdminCheck result (it's not null now)
    // If directAdminCheck is true, user is definitely admin - allow access
    if (directAdminCheck === true) {
      console.log('[Admin] User is admin (direct check confirmed) - allowing access - NO REDIRECT');
      return; // Don't redirect, allow access
    }
    
    // If directAdminCheck is false, check if context says admin (might have updated)
    const userIsAdmin = isAdmin === true;
    
    console.log('[Admin] Checking redirect...', { directAdminCheck, isAdmin, userIsAdmin });
    
    if (!userIsAdmin) {
      console.log('[Admin] Redirecting - user is not admin', { directAdminCheck, isAdmin });
      hasFetchedRef.current = false;
      navigate('/');
      return;
    }
    
    console.log('[Admin] User is admin (from context) - allowing access - NO REDIRECT');
  }, [user, isAdmin, authLoading, isCheckingAdmin, directAdminCheck, navigate]);

  // Fetch all data when admin is confirmed
  const fetchData = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      setLoading(true);
      const [projectsRes, commentsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('comments')
          .select('*, profiles(display_name, avatar_url, username)')
          .order('created_at', { ascending: false })
      ]);

      if (projectsRes.error) {
        console.error('Projects fetch error:', projectsRes.error);
        throw projectsRes.error;
      }
      if (commentsRes.error) {
        console.error('Comments fetch error:', commentsRes.error);
        throw commentsRes.error;
      }

      setProjects(projectsRes.data || []);
      setComments(commentsRes.data || []);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const fetchStats = useCallback(async () => {
    if (!user || !isAdmin) return;

    setStatsLoading(true);
    try {
      const getCount = async (
        table: 'blog_posts' | 'comments' | 'profiles' | 'contact_messages',
        filter?: (q: any) => any
      ) => {
        try {
          let query = supabase.from(table).select('*', { count: 'exact', head: true });
          if (filter) query = filter(query);
          const { count, error } = await query;
          if (error) {
            console.error(`Count error for ${table}:`, error);
            return 0;
          }
          return count || 0;
        } catch (err) {
          console.error(`Count exception for ${table}:`, err);
          return 0;
        }
      };

      const [
        totalPosts,
        publishedPosts,
        totalComments,
        totalUsers,
        bannedUsers,
        contactMessages
      ] = await Promise.all([
        getCount('blog_posts'),
        getCount('blog_posts', (q) => q.eq('is_published', true)),
        getCount('comments'),
        getCount('profiles'),
        getCount('profiles', (q) => q.eq('is_banned', true)),
        getCount('contact_messages')
      ]);

      const { data: viewsData, error: viewsError } = await supabase
        .from('blog_posts')
        .select('view_count');

      if (viewsError) {
        console.error('Views fetch error:', viewsError);
      }

      const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;

      setStats({
        totalPosts,
        publishedPosts,
        totalViews,
        totalComments,
        totalUsers,
        bannedUsers,
        contactMessages,
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
      toast.error('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  }, [user, isAdmin]);

  // Initial Data Fetching - only when authenticated and admin, and only once
  useEffect(() => {
    if (user && isAdmin && !authLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
      fetchStats();
    }
  }, [user, isAdmin, authLoading, fetchData, fetchStats]);

  // Handlers
  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !isPublished })
        .eq('id', id);

      if (error) throw error;

      toast.success(isPublished ? 'Post unpublished' : 'Post published');
      refetchPosts();
      fetchStats();
    } catch (error: any) {
      console.error('Toggle publish error:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Post deleted');
      refetchPosts();
      fetchStats();
    } catch (error: any) {
      console.error('Delete post error:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleToggleProjectVisibility = async (id: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_visible: !isVisible })
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.map(p => p.id === id ? { ...p, is_visible: !isVisible } : p));
      toast.success(isVisible ? 'Project hidden' : 'Project visible');
    } catch (error: any) {
      console.error('Toggle project visibility error:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (error: any) {
      console.error('Delete project error:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== id));
      toast.success('Comment deleted');
      fetchStats();
    } catch (error: any) {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handlePinComment = async (id: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_pinned: !isPinned })
        .eq('id', id);

      if (error) throw error;

      setComments(comments.map(c => c.id === id ? { ...c, is_pinned: !isPinned } : c));
      toast.success(isPinned ? 'Comment unpinned' : 'Comment pinned');
    } catch (error: any) {
      console.error('Pin comment error:', error);
      toast.error('Failed to pin comment');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Loading state - simple and clean
  if (authLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">
            {authLoading ? 'Loading...' : 'Verifying admin access...'}
          </p>
        </div>
      </div>
    );
  }

  // Not authorized - will redirect via useEffect
  // Wait for check to complete before deciding
  if (directAdminCheck === null && isCheckingAdmin) {
    // Still checking, show loading (already handled above, but just in case)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  // Use directAdminCheck if available, otherwise fall back to isAdmin
  const userIsAdmin = directAdminCheck !== null ? directAdminCheck : isAdmin;
  
  if (!user || (!userIsAdmin && !isCheckingAdmin && directAdminCheck !== null)) {
    // Only return null if we've confirmed user is not admin
    return null;
  }

  const navItems = [
    { id: 'overview', label: 'Terminal', icon: Layout },
    { id: 'journal', label: 'Journal', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'comms', label: 'Network', icon: MessageSquare },
    { id: 'network', label: 'Profiles', icon: Users },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-neutral-900/10 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold">A</div>
            <span className="font-mono text-sm tracking-tighter hidden md:block uppercase">Admin Control</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                activeTab === item.id
                  ? "bg-white/10 text-white"
                  : "text-neutral-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "group-hover:text-white")} />
              <span className="text-sm font-medium hidden md:block">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-white rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:block">Terminate</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            posts={posts}
            statsLoading={statsLoading}
          />
        )}
        {activeTab === 'journal' && (
          <AdminJournal
            posts={posts}
            handleTogglePublish={handleTogglePublish}
            handleDelete={handleDeletePost}
          />
        )}
        {activeTab === 'projects' && (
          <AdminProjects
            projects={projects}
            loading={loading}
            handleToggleVisibility={handleToggleProjectVisibility}
            handleDelete={handleDeleteProject}
          />
        )}
        {activeTab === 'comms' && (
          <AdminComms
            comments={comments}
            loading={loading}
            handleDeleteComment={handleDeleteComment}
            handlePinComment={handlePinComment}
          />
        )}
        {activeTab === 'network' && <AdminNetwork />}
        {activeTab === 'safety' && <AdminSafety />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'logs' && <AdminLogs />}
      </main>
    </div>
  );
};

export default Admin;
