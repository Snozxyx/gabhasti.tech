import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { BlogImage } from './BlogImage';
import { BlogVideoPlayer } from './BlogVideoPlayer';

interface MarkdownRendererProps {
  content: string;
  contentType?: 'markdown' | 'html' | 'text';
  className?: string;
}

export const MarkdownRenderer = ({ content, contentType = 'markdown', className }: MarkdownRendererProps) => {
  if (contentType === 'html') {
    // Process HTML to add IDs to headings and style content
    const processedContent = content
      .replace(/<h([1-6])([^>]*)>([^<]+)<\/h[1-6]>/gi, (_, level, attrs, text) => {
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        return `<h${level}${attrs} id="${id}" class="scroll-mt-24">${text}</h${level}>`;
      });
    
    // Apply styles to images and videos in HTML
    const styledContent = processedContent
      .replace(/<img([^>]*)>/gi, '<img$1 class="rounded-xl my-8 w-full border border-white/10 shadow-2xl" />')
      .replace(/<video([^>]*)>/gi, '<video$1 class="rounded-xl my-8 w-full border border-white/10 shadow-2xl" />')
      .replace(/<iframe([^>]*)>/gi, '<iframe$1 class="rounded-xl my-8 w-full border border-white/10 shadow-2xl" />');
    
    // Add IDs to headings after render
    useEffect(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
          heading.id = id;
          heading.classList.add('scroll-mt-24');
        }
      });
    }, [content]);
    
    return (
      <div 
        className={cn("prose-blog text-white [&_*]:text-white [&_p]:text-white [&_li]:text-white [&_strong]:text-white [&_em]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full [&_img]:border [&_img]:border-white/10 [&_img]:shadow-2xl [&_video]:rounded-xl [&_video]:my-8 [&_video]:w-full [&_video]:border [&_video]:border-white/10 [&_video]:shadow-2xl [&_iframe]:rounded-xl [&_iframe]:my-8 [&_iframe]:w-full [&_iframe]:border [&_iframe]:border-white/10 [&_iframe]:shadow-2xl", className)}
        dangerouslySetInnerHTML={{ __html: styledContent }}
      />
    );
  }

  if (contentType === 'text') {
    return (
      <div className={cn("prose-blog whitespace-pre-wrap text-white", className)}>
        {content}
      </div>
    );
  }

  // Extract video URLs from content (format: <!-- video: URL -->)
  const extractVideoUrl = (text: string): string | null => {
    const match = text.match(/<!--\s*video:\s*(.+?)\s*-->/);
    return match ? match[1].trim() : null;
  };

  // Markdown rendering
  return (
    <div className={cn("prose-blog text-white [&_*]:text-white [&_p]:text-white [&_li]:text-white [&_strong]:text-white [&_em]:text-white", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, ...props }) => {
            const src = props.src || '';
            const alt = props.alt || '';
            
            // Check if it's a video URL
            const videoUrl = extractVideoUrl(alt);
            if (videoUrl) {
              return (
                <div className="my-8">
                  <BlogVideoPlayer url={videoUrl} />
                </div>
              );
            }
            
            // Use BlogImage component for modern styling
            return (
              <div className="my-8">
                <BlogImage 
                  src={src} 
                  alt={alt}
                  className="w-full"
                />
              </div>
            );
          },
          p: ({ node, children, ...props }) => (
            <p className="text-white font-light leading-relaxed mb-6" {...props}>
              {children}
            </p>
          ),
          h1: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h1 id={id} className="text-white font-bold text-3xl mt-8 mb-4 scroll-mt-24" {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h2 id={id} className="text-white font-bold text-2xl mt-8 mb-4 scroll-mt-24" {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h3 id={id} className="text-white font-bold text-xl mt-6 mb-3 scroll-mt-24" {...props}>
                {children}
              </h3>
            );
          },
          h4: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h4 id={id} className="text-white font-bold text-lg mt-6 mb-3 scroll-mt-24" {...props}>
                {children}
              </h4>
            );
          },
          h5: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h5 id={id} className="text-white font-bold text-base mt-4 mb-2 scroll-mt-24" {...props}>
                {children}
              </h5>
            );
          },
          h6: ({ node, children, ...props }) => {
            const getText = (children: any): string => {
              if (typeof children === 'string') return children;
              if (Array.isArray(children)) {
                return children.map(getText).join('');
              }
              if (children?.props?.children) return getText(children.props.children);
              return String(children);
            };
            const text = getText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            return (
              <h6 id={id} className="text-white font-bold text-sm mt-4 mb-2 scroll-mt-24" {...props}>
                {children}
              </h6>
            );
          },
          ul: ({ node, children, ...props }) => (
            <ul className="text-white my-4 pl-6 list-disc space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="text-white my-4 pl-6 list-decimal space-y-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="text-white" {...props}>
              {children}
            </li>
          ),
          a: ({ node, ...props }) => (
            <a 
              {...props} 
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300 transition-colors"
            />
          ),
          strong: ({ node, children, ...props }) => (
            <strong className="text-white font-semibold" {...props}>
              {children}
            </strong>
          ),
          em: ({ node, children, ...props }) => (
            <em className="text-white italic" {...props}>
              {children}
            </em>
          ),
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-neutral-800/80 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-500/20" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("text-indigo-200", className)} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-white/10 rounded-xl p-6 overflow-x-auto my-8 text-sm text-white shadow-2xl shadow-black/50 group" {...props}>
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/30"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/30"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/30"></div>
              </div>
              <div className="pr-8">
                {children}
              </div>
            </pre>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote 
              className="border-l-4 border-indigo-500/50 pl-4 italic my-6 text-neutral-300"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-white/10 my-8" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
