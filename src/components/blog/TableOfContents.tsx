"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  contentType?: 'markdown' | 'html' | 'text';
  className?: string;
}

export const TableOfContents = ({ content, contentType = 'markdown', className }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (contentType === 'html') {
      // Extract headings from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const extractedHeadings: Heading[] = Array.from(headingElements).map((el, index) => {
        const level = parseInt(el.tagName.charAt(1));
        const text = el.textContent || '';
        const id = el.id || `heading-${index}`;
        return { id, text, level };
      });
      
      setHeadings(extractedHeadings);
    } else if (contentType === 'markdown') {
      // Extract headings from markdown
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const extractedHeadings: Heading[] = [];
      let match;
      let index = 0;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        
        extractedHeadings.push({ id, text, level });
        index++;
      }
      
      setHeadings(extractedHeadings);
    }
  }, [content, contentType]);

  // Set up intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Add IDs to headings in the DOM
  useEffect(() => {
    if (headings.length === 0) return;

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (!element) {
        // Try to find by text content
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach((el) => {
          if (el.textContent?.trim() === heading.text && !el.id) {
            el.id = heading.id;
          }
        });
      }
    });
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      
      setActiveId(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto", className)}
    >
      <div className="border-l border-white/10 pl-6 space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
          Contents
        </h3>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={cn(
                "block text-left text-sm transition-colors duration-200 hover:text-white",
                heading.level === 1 && "pl-0 font-medium",
                heading.level === 2 && "pl-3 font-normal",
                heading.level === 3 && "pl-6 font-light text-xs",
                heading.level >= 4 && "pl-9 font-light text-xs",
                activeId === heading.id
                  ? "text-white border-l-2 border-white/40 pl-4 -ml-6"
                  : "text-neutral-400"
              )}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
