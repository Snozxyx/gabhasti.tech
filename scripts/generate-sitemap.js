/* eslint-disable no-console */
/**
 * Dynamic sitemap generator for blog posts.
 * Uses Supabase REST API with anon key (read-only).
 *
 * Required env:
 *  - VITE_SUPABASE_URL
 *  - VITE_SUPABASE_ANON_KEY
 *
 * Run: npm run sitemap
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://gabhasti.tech';

const baseRoutes = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  { loc: '/projects', changefreq: 'monthly', priority: 0.8 },
  { loc: '/blog', changefreq: 'daily', priority: 0.9 },
];

async function fetchPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('Missing Supabase env (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY). Using base routes only.');
    return [];
  }

  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,created_at&is_published=eq.true`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    console.warn('Failed to fetch posts for sitemap:', res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return data?.map((post) => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updated_at || post.created_at,
    changefreq: 'weekly',
    priority: 0.8,
  })) ?? [];
}

function buildXml(urls) {
  const entries = urls
    .map((u) => {
      const lastmod = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : '';
      return `<url><loc>${SITE_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority>${lastmod}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

async function main() {
  const posts = await fetchPosts();
  const urls = [...baseRoutes, ...posts];
  const xml = buildXml(urls);
  const outPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Sitemap written to ${outPath} with ${urls.length} URLs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
