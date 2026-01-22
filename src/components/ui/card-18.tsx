import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const cardVariants = cva(
    'group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-neutral-950 text-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-white/10',
    {
        variants: {
            variant: {
                default: 'p-4 md:p-6',
                featured: 'flex-col md:flex-row',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BlogPostCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    tag: string;
    date: string;
    title: string;
    description: string;
    imageUrl?: string;
    href: string;
    readMoreText?: string;
}

const BlogPostCard = React.forwardRef<HTMLDivElement, BlogPostCardProps>(
    ({ className, variant, tag, date, title, description, imageUrl, href, readMoreText = 'Read the full article' }, ref) => {

        const cardHover: any = {
            hover: {
                y: -4,
                transition: {
                    duration: 0.2,
                    ease: 'easeInOut',
                },
            },
        };

        const content = (
            <>
                {variant === 'featured' && imageUrl && (
                    <div className="relative w-full overflow-hidden md:w-1/2 lg:w-3/5 min-h-[300px]">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 to-transparent" />
                    </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                    <div>
                        <div className="mb-4 flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-white/60">{tag}</span>
                            <span>{date}</span>
                        </div>

                        <h3 className="mb-3 text-xl font-bold leading-tight text-white lg:text-3xl tracking-tight">
                            <span className="bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                                {title}
                            </span>
                        </h3>

                        <p className="text-neutral-500 font-light leading-relaxed text-sm md:text-base line-clamp-3">{description}</p>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <Button variant="outline" className="group/button rounded-full px-6 text-xs uppercase tracking-widest font-bold h-10">
                            {readMoreText}
                            <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-300 group-hover/button:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </>
        );

        return (
            <motion.div
                ref={ref}
                className={cn(cardVariants({ variant, className }))}
                variants={cardHover}
                whileHover="hover"
            >
                <a href={href} className="absolute inset-0 z-10" aria-label={`Read more about ${title}`}>
                    <span className="sr-only">Read More</span>
                </a>
                <div className="relative z-0 flex h-full w-full flex-col md:flex-row">{content}</div>
            </motion.div>
        );
    }
);

BlogPostCard.displayName = 'BlogPostCard';

export { BlogPostCard };
