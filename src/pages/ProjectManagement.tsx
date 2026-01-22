import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Github, 
  Link as LinkIcon,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { createProject, updateProject, deleteProject, type Project } from '@/lib/projects';
import { uploadCoverImage } from '@/lib/blog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const ProjectManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isGithubRepo, setIsGithubRepo] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data as Project[]);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setImageUrl(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSyncGithub = async () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    try {
      // Extract repo info from GitHub URL
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        toast.error('Invalid GitHub URL');
        return;
      }

      // In a real implementation, you would fetch repo data from GitHub API
      toast.info('GitHub sync feature coming soon');
    } catch (error) {
      toast.error('Failed to sync repository');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const projectData = {
        title: title.trim(),
        description: description.trim() || null,
        github_url: githubUrl.trim() || null,
        live_url: liveUrl.trim() || null,
        image_url: imageUrl.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        is_visible: isVisible,
        is_github_repo: isGithubRepo,
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast.success('Project updated!');
        toast.success('Project updated!');
      } else {
        await createProject(projectData);
        toast.success('Project created!');
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setGithubUrl(project.github_url || '');
    setLiveUrl(project.live_url || '');
    setTags(project.tags?.join(', ') || '');
    setImageUrl(project.image_url || '');
    setIsVisible(project.is_visible ?? true);
    setIsGithubRepo(project.is_github_repo ?? false);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setTags('');
    setImageUrl('');
    setIsVisible(true);
    setIsGithubRepo(false);
    setIsModalOpen(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
              // Projects
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              Manage Projects
            </h1>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-neutral-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-medium text-white">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.is_visible ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-600" />
                    )}
                    <span className="text-xs text-neutral-500">
                      {format(new Date(project.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 border border-white/5 rounded-xl bg-neutral-900/50">
            <p className="text-neutral-500 font-mono">No projects yet.</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-white text-black hover:bg-neutral-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-medium text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="title" className="text-white mb-2 block">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black border-white/10 text-white"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="githubUrl" className="text-white mb-2 block">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-black border-white/10 text-white"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="liveUrl" className="text-white mb-2 block">
                    Live URL
                  </Label>
                  <Input
                    id="liveUrl"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="bg-black border-white/10 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags" className="text-white mb-2 block">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-black border-white/10 text-white"
                  placeholder="React, TypeScript, Next.js"
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-white mb-2 block">
                  Cover Image
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-black border-white/10 text-white"
                    disabled={uploading}
                  />
                  {imageUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isVisible}
                    onCheckedChange={setIsVisible}
                    id="visible"
                  />
                  <Label htmlFor="visible" className="text-white cursor-pointer">
                    Visible to public
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isGithubRepo}
                    onCheckedChange={setIsGithubRepo}
                    id="githubRepo"
                  />
                  <Label htmlFor="githubRepo" className="text-white cursor-pointer">
                    GitHub Repository
                  </Label>
                </div>
              </div>

              {isGithubRepo && (
                <Button
                  type="button"
                  onClick={handleSyncGithub}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Sync from GitHub
                </Button>
              )}

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-neutral-200"
                  disabled={uploading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
