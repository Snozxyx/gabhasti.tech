export const siteConfig = {
  name: 'Gabhasti Giri Sinha',
  siteName: 'Gabhasti.tech',
  url: 'https://gabhasti.tech',
  description:
    'Portfolio and journal of Gabhasti Giri Sinha — building elegant software, products, and ideas.',
  twitterHandle: '@gabhastigiri',
  locale: 'en_US',
};

export type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
};

export const absoluteUrl = (path: string) => {
  if (!path) return siteConfig.url;
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const buildTitle = (title?: string) => {
  if (!title) return `${siteConfig.name} — ${siteConfig.siteName}`;
  return `${title} — ${siteConfig.siteName}`;
};
