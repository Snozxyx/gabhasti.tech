"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Upload, 
  Edit, 
  Save, 
  User, 
  Calendar,
  FileText,
  FolderGit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userBlogPosts, setUserBlogPosts] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);

  const isOwnProfile = currentUser && profile && currentUser.id === profile.user_id;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      fetchUserContent();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*');

      if (username) {
        query = query.eq('username', username);
      } else if (currentUser) {
        query = query.eq('user_id', currentUser.id);
      } else {
        navigate('/auth');
        return;
      }

      const { data, error } = await query.single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    if (!profile) return;

    try {
      // Fetch user's blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', profile.user_id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setUserBlogPosts(posts || []);

      // Fetch user's projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.user_id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setUserProjects(projects || []);
    } catch (error) {
      console.error('Failed to fetch user content:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl || null,
        })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast.success('Profile updated!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex items-start gap-8 mb-12">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.display_name || 'User'}
                className="w-32 h-32 rounded-full border-2 border-white/10 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-2 border-white/10 bg-neutral-900 flex items-center justify-center">
                <User className="w-16 h-16 text-neutral-600" />
              </div>
            )}
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full cursor-pointer hover:bg-neutral-200 transition-colors">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile.display_name || profile.username || 'User'}
                </h1>
                {profile.username && (
                  <p className="text-neutral-400 font-mono">@{profile.username}</p>
                )}
              </div>
              {isOwnProfile && (
                <Button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="bg-white text-black hover:bg-neutral-200"
                >
                  {editing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-white mb-2 block">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-black border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-white mb-2 block">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-black border-white/10 text-white"
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleSave}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setDisplayName(profile.display_name || '');
                      setBio(profile.bio || '');
                      setAvatarUrl(profile.avatar_url || '');
                    }}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {profile.bio && (
                  <p className="text-neutral-300 leading-relaxed mb-4">{profile.bio}</p>
                )}
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="space-y-12">
          {/* Blog Posts */}
          {userBlogPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts
                </h2>
                {isOwnProfile && (
                  <Link
                    to="/admin/posts/new"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Create Post →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-neutral-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all"
                  >
                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                      {post.view_count > 0 && <span>{post.view_count} views</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {userProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5" />
                  Projects
                </h2>
                {isOwnProfile && (
                  <Link
                    to="/projects/manage"
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Manage Projects →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
                  >
                    {project.image_url && (
                      <div className="aspect-video overflow-hidden bg-neutral-900">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
