import { Link } from 'react-router-dom';
import { Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { SectionHeader, ActionButton, LoadingSpinner } from './AdminShared';

interface AdminProjectsProps {
    projects: any[];
    loading: boolean;
    handleToggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
}

export const AdminProjects = ({ projects, loading, handleToggleVisibility, handleDelete }: AdminProjectsProps) => {
    return (
        <div className="space-y-8">
            <SectionHeader title="Projects" subtitle="Portfolio">
                <Link to="/projects/manage">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 uppercase text-xs tracking-wider">
                        <Plus className="w-4 h-4 mr-2" /> Manage Projects
                    </Button>
                </Link>
            </SectionHeader>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid gap-2">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-neutral-900/10 border border-white/5 p-4 rounded-sm hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    {project.image_url && (
                                        <img src={project.image_url} alt={project.title} className="w-16 h-12 object-cover rounded border border-white/5" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-base font-medium text-white">{project.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-mono text-neutral-600">{format(new Date(project.created_at), 'MMM dd, yyyy')}</span>
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex gap-1">
                                                    {project.tags.slice(0, 3).map((tag: string) => (
                                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ActionButton
                                        onClick={() => handleToggleVisibility(project.id, project.is_visible ?? true)}
                                        active={project.is_visible ?? true}
                                        icon={project.is_visible ? Eye : EyeOff}
                                    />
                                    <ActionButton onClick={() => handleDelete(project.id)} icon={Trash2} variant="danger" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-20 border border-white/5 rounded-sm bg-neutral-900/10">
                            <p className="text-neutral-500 font-mono text-sm">No projects found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
