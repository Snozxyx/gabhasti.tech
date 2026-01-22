"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BlogImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export const BlogImage = ({ src, alt = '', caption, className }: BlogImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={cn(
        "aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground",
        className
      )}>
        Failed to load image
      </div>
    );
  }

  return (
    <Dialog>
      <figure className={cn("my-8", className)}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 shadow-2xl shadow-black/50"
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            className={cn(
              "w-full h-auto transition-all duration-500",
              "group-hover:scale-[1.02]",
              !isLoaded && "opacity-0"
            )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </DialogTrigger>
        {caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
            {caption}
          </figcaption>
        )}
      </figure>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
};
