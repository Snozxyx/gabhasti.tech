import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type BlogPostInsert = TablesInsert<'blog_posts'>;
type BlogPostUpdate = TablesUpdate<'blog_posts'>;

export const createBlogPost = async (post: Omit<BlogPostInsert, 'user_id'>) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      user_id: session.session.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBlogPost = async (id: string, post: BlogPostUpdate) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const togglePublish = async (id: string, isPublished: boolean) => {
  return updateBlogPost(id, { is_published: isPublished });
};

export const togglePin = async (id: string, isPinned: boolean) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) throw new Error('Not authenticated');

  return updateBlogPost(id, { 
    is_pinned: isPinned,
    pinned_by: isPinned ? session.session.user.id : null
  });
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
};

export const uploadCoverImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadContentImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `content/${fileName}`;

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
