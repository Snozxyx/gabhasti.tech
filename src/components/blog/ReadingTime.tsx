"use client";

import { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface ReadingTimeProps {
  content: string;
  contentType?: 'markdown' | 'html' | 'text';
  className?: string;
}

export const ReadingTime = ({ content, contentType = 'markdown', className }: ReadingTimeProps) => {
  const readingTime = useMemo(() => {
    let text = '';
    
    if (contentType === 'html') {
      // Strip HTML tags
      const div = document.createElement('div');
      div.innerHTML = content;
      text = div.textContent || div.innerText || '';
    } else if (contentType === 'markdown') {
      // Remove markdown syntax
      text = content
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .replace(/`[^`]+`/g, '') // Inline code
        .replace(/#{1,6}\s+/g, '') // Headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
        .replace(/\*([^*]+)\*/g, '$1') // Italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Images
        .replace(/^\s*[-*+]\s+/gm, '') // List items
        .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
        .trim();
    } else {
      text = content;
    }
    
    // Average reading speed: 200-250 words per minute
    // Using 225 as average
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / 225);
    
    return minutes;
  }, [content, contentType]);

  return (
    <div className={`flex items-center gap-1.5 text-xs font-mono text-neutral-400 ${className}`}>
      <Clock className="w-3 h-3" />
      <span>{readingTime} {readingTime === 1 ? 'min' : 'mins'} read</span>
    </div>
  );
};
