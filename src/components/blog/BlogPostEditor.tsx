"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye, EyeOff, FileText, Code, Image as ImageIcon, Link as LinkIcon, Type, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createBlogPost, updateBlogPost, generateSlug, uploadCoverImage, uploadContentImage } from '@/lib/blog';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type BlogPost = Tables<'blog_posts'>;

interface BlogPostEditorProps {
  post?: BlogPost;
  onSave?: (post: BlogPost) => void;
  onCancel?: () => void;
}

export const BlogPostEditor = ({ post, onSave, onCancel }: BlogPostEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [tag, setTag] = useState(post?.tag || '');
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || '');
  const [videoUrl, setVideoUrl] = useState(post?.video_url || '');
  const [contentType, setContentType] = useState<'markdown' | 'html' | 'text'>(
    (post?.content_type as 'markdown' | 'html' | 'text') || 'markdown'
  );
  const [isPublished, setIsPublished] = useState(post?.is_published || false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUseImageUrl = () => {
    if (imageUrlInput.trim()) {
      setCoverImageUrl(imageUrlInput.trim());
      setImageUrlInput('');
      toast.success('Image URL set');
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingContentImage(true);
    try {
      const url = await uploadContentImage(file);
      const textarea = document.getElementById('content') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const imageMarkdown = `![${file.name}](${url})`;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newContent);
        
        // Set cursor position after insertion
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
        }, 0);
      }
      toast.success('Image uploaded and inserted');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingContentImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      let newText = '';

      switch (syntax) {
        case 'image':
          newText = `![${selectedText || 'alt text'}](url)`;
          break;
        case 'link':
          newText = `[${selectedText || 'link text'}](url)`;
          break;
        case 'video':
          newText = `\n\n<!-- video: YOUR_VIDEO_URL -->\n\n`;
          break;
        case 'code':
          newText = `\`\`\`\n${selectedText || 'code here'}\n\`\`\``;
          break;
        case 'bold':
          newText = `**${selectedText || 'bold text'}**`;
          break;
        case 'italic':
          newText = `*${selectedText || 'italic text'}*`;
          break;
        case 'heading':
          newText = `## ${selectedText || 'Heading'}`;
          break;
        default:
          newText = selectedText;
      }

      const newContent = content.substring(0, start) + newText + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        tag: tag.trim() || null,
        cover_image_url: coverImageUrl || null,
        video_url: videoUrl || null,
        content_type: contentType,
        is_published: isPublished,
        slug: post?.slug || generateSlug(title),
      };

      let savedPost: BlogPost;
      if (post) {
        savedPost = await updateBlogPost(post.id, postData);
      } else {
        savedPost = await createBlogPost(postData);
      }

      toast.success(post ? 'Post updated!' : 'Post created!');
      onSave?.(savedPost);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-white">
              {post ? 'Refine Content' : 'Create New'}
            </h2>
            <p className="text-sm text-neutral-400 font-light">
              {post ? 'Update your post below' : 'Start crafting your story'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsPublished(!isPublished)}
              className={cn(
                "text-sm font-medium transition-all duration-200",
                isPublished
                  ? "text-white bg-white/10 hover:bg-white/15 border border-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5"
              )}
            >
              {isPublished ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {isPublished ? 'Published' : 'Draft'}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="h-14 bg-black/40 border-white/10 text-white text-lg placeholder:text-neutral-600 focus:border-white/20 transition-colors"
            />
          </div>

          {/* Meta Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Tag
              </Label>
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Design, Tech..."
                className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentType" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Format
              </Label>
              <Select value={contentType} onValueChange={(v: 'markdown' | 'html' | 'text') => setContentType(v)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white focus:border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="markdown" className="text-white hover:bg-white/10">
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Markdown</span>
                  </SelectItem>
                  <SelectItem value="html" className="text-white hover:bg-white/10">
                    <span className="flex items-center gap-2"><Code className="w-4 h-4" /> HTML</span>
                  </SelectItem>
                  <SelectItem value="text" className="text-white hover:bg-white/10">
                    <span className="flex items-center gap-2"><Type className="w-4 h-4" /> Plain Text</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Video URL
              </Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube/Vimeo URL"
                className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="space-y-3">
            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Cover Image
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-black/40 border-white/10 text-white file:bg-white/10 file:border-0 file:text-white file:mr-4 file:px-4 file:py-2 file:rounded file:cursor-pointer hover:border-white/20 transition-colors"
                  disabled={uploading}
                />
              </div>
              <span className="text-neutral-600 text-sm self-center font-mono">or</span>
              <div className="flex-1 flex gap-2 w-full">
                <Input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste image URL..."
                  className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleUseImageUrl}
                  className="border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {uploading && (
              <p className="text-xs text-neutral-500 font-mono">Uploading...</p>
            )}
          </div>

          {coverImageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group"
            >
              <img 
                src={coverImageUrl} 
                alt="Cover preview" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief, engaging description..."
              rows={2}
              className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors resize-none"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Content
              </Label>
              {contentType === 'markdown' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase mr-2">Quick:</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => insertMarkdown('bold')} 
                    className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    title="Bold"
                  >
                    <strong className="text-xs">B</strong>
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => insertMarkdown('italic')} 
                    className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    title="Italic"
                  >
                    <em className="text-xs">I</em>
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => insertMarkdown('heading')} 
                    className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    title="Heading"
                  >
                    <span className="text-xs font-bold">H</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => insertMarkdown('link')} 
                    className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    title="Link"
                  >
                    <LinkIcon className="w-3 h-3" />
                  </Button>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleContentImageUpload}
                      className="hidden"
                      disabled={uploadingContentImage}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                      title="Upload Image"
                      disabled={uploadingContentImage}
                    >
                      {uploadingContentImage ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <ImageIcon className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                    </Button>
                  </label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => insertMarkdown('code')} 
                    className="h-7 px-2.5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    title="Code"
                  >
                    <Code className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')} className="w-full">
              <TabsList className="bg-black/40 border border-white/10 p-1 h-9">
                <TabsTrigger 
                  value="write" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 px-4 text-xs font-mono uppercase tracking-wider"
                >
                  Write
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 px-4 text-xs font-mono uppercase tracking-wider"
                >
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-4">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here... Start typing and let your ideas flow."
                  rows={24}
                  className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors resize-none font-mono text-sm leading-relaxed"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[500px] p-6 rounded-lg border border-white/10 bg-black/20 overflow-auto">
                  {content ? (
                    <div className="prose prose-invert prose-lg max-w-none">
                      <MarkdownRenderer content={content} contentType={contentType} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[500px]">
                      <p className="text-neutral-600 text-sm font-mono uppercase tracking-wider">Nothing to preview</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              className="text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-white text-black hover:bg-white/90 font-medium px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {post ? 'Update Post' : 'Publish Post'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
