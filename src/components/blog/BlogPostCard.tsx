"use client";

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowUpRight, Pin, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { ReadingTime } from './ReadingTime';

type BlogPost = Tables<'blog_posts'>;

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'featured';
  isHovered?: boolean;
  isDimmed?: boolean;
  onHover?: () => void;
}

const gradients = [
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-orange-500/20 to-yellow-500/20',
  'from-green-500/20 to-teal-500/20',
  'from-red-500/20 to-orange-500/20',
];

export const BlogPostCard = ({
  post,
  index = 0,
  variant = 'default',
  isHovered,
  isDimmed,
  onHover,
}: BlogPostCardProps) => {
  const gradient = gradients[index % gradients.length];
  const formattedDate = format(new Date(post.created_at), 'MMM dd, yyyy');

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group block mb-12 md:mb-16"
      >
        <Link to={`/blog/${post.slug}`}>
          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-neutral-950">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-[400px] overflow-hidden">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = `w-full h-full bg-gradient-to-br ${gradient}`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-neutral-950" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent md:hidden" />
              </div>

              <div className="relative p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  {post.is_pinned && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-mono uppercase tracking-wider text-yellow-500">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                  {post.tag && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/60">
                      <Tag className="w-3 h-3" />
                      {post.tag}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <ReadingTime content={post.content} contentType={post.content_type as any} />
                </div>

                <h3 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight group-hover:text-neutral-200 transition-colors">
                  {post.title}
                </h3>

                <p className="text-neutral-500 font-light leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt || post.content.slice(0, 150) + '...'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-4 transition-all">
                    Read article
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  {post.view_count !== null && post.view_count > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <Eye className="w-3 h-3" />
                      {post.view_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      onMouseEnter={onHover}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group cursor-pointer flex flex-col gap-4 transition-all duration-500 ease-out",
        isDimmed ? "opacity-20 blur-[1px] grayscale" : "opacity-100 grayscale-0"
      )}
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 rounded-2xl border border-white/10">
          {post.cover_image_url ? (
            <motion.img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = `w-full h-full bg-gradient-to-br ${gradient}`;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <motion.div
              className={`w-full h-full bg-gradient-to-br ${gradient}`}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3 text-neutral-500">
              {post.is_pinned && (
                <Pin className="w-3 h-3 text-yellow-500" />
              )}
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                {post.tag || 'Article'}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {formattedDate}
              </span>
            </div>
            <ArrowUpRight
              className={cn(
                "w-4 h-4 text-white transition-all duration-300",
                isHovered ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 -translate-x-2 translate-y-2"
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold leading-tight text-white group-hover:text-neutral-200 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">
              {post.excerpt || post.content.slice(0, 100) + '...'}
            </p>
            <div className="flex items-center justify-between pt-2">
              <ReadingTime content={post.content} contentType={post.content_type as any} />
              {post.view_count !== null && post.view_count > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <Eye className="w-3 h-3" />
                  {post.view_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
