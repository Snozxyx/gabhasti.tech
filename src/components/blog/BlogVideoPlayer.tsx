"use client";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlogVideoPlayerProps {
  url: string;
  className?: string;
}

export const BlogVideoPlayer = ({ url, className }: BlogVideoPlayerProps) => {

  // Check if it's a YouTube or Vimeo URL
  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video URL
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  const isEmbed = embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com');

  if (isEmbed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl shadow-black/50 group",
          className
        )}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-2xl" />
      </motion.div>
    );
  }

  // Native video player for direct URLs
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        className={cn(
        "relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900/50 shadow-2xl shadow-black/50 group",
        className
      )}
    >
      <video
        src={url}
        className="absolute inset-0 w-full h-full object-contain"
        controls
        playsInline
      />
      <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-2xl" />
    </motion.div>
  );
};
