# Gabhasti.tech - Modern Portfolio & Blog Platform

A modern, fast portfolio and blog platform built with React, TypeScript, Vite, and Supabase.

## Features

- ✨ **Modern Design** - Clean, minimal UI with smooth animations
- 📝 **Blog System** - Full-featured blogging with Markdown support
- 👤 **User Profiles** - Customizable user profiles with avatars and bios
- 🔐 **Authentication** - Secure auth with Supabase
- 📊 **Analytics** - Privacy-focused analytics with opt-out
- 🎨 **Portfolio** - Showcase projects with GitHub integration
- 📧 **Contact Forms** - Built-in contact form with message management
- 🛡️ **Admin Panel** - Comprehensive admin dashboard
- 🔍 **Search** - Fast blog post search functionality
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel-ready
- **Content**: Markdown with GitHub Flavored Markdown

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/snoxzxyx/gabhasti.tech.git
cd gabhasti.tech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server:
```bash
npm run dev
```

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: GitHub Integration

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Production Deployment

### Prerequisites for Production

1. **Apply Database Migrations:**
```bash
# In your Supabase dashboard or CLI
supabase db push
# Or run migrations manually in Supabase SQL Editor
```

2. **Set Environment Variables** in your hosting platform (Vercel/Netlify/etc.):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional
VITE_DD_CLIENT_TOKEN=pub...           # Recommended for error tracking
NODE_ENV=production
```

### Production Build

```bash
# Clean production build (removes console logs)
npm run build:prod

# Or use the start script for local testing
npm run start:prod
```

### Production Features

- **Console logs removed** - No debug output in production
- **Minified bundles** - Optimized for performance
- **Code splitting** - Faster loading with manual chunks
- **Error tracking** - Datadog integration for monitoring
- **Analytics** - GA4 page view tracking

## SEO Notes

- **Per-page SEO** is handled client-side via `react-helmet-async` in `src/components/Seo.tsx`.\n- **Static files**: `public/robots.txt` and `public/sitemap.xml`.\n- **Blog post URLs**: `/blog/:slug`.\n\nIf you want the sitemap to include every blog post automatically, we can generate it during build by querying Supabase (requires Supabase CLI or a small build script).

## Database Setup

Run the Supabase migrations in order:

```bash
# In your Supabase project
supabase db reset
```

Or apply migrations individually:
```bash
supabase migration up
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `VITE_GA_MEASUREMENT_ID` | GA4 Measurement ID for page views | Optional (for analytics) |
| `VITE_DD_CLIENT_TOKEN` | Datadog Browser Logs client token | Recommended (for error logs) |
| `VITE_DD_SITE` | Datadog site, e.g. `datadoghq.com` | Optional (defaults to `datadoghq.com`) |
| `NODE_ENV` | Set to 'production' for prod builds | Optional (auto-set by build) |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Build and serve production locally
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── blog/           # Blog-specific components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
├── pages/              # Page components
├── integrations/       # External service integrations
└── App.tsx            # Main app component
```

## Performance Optimizations

- **Client-side caching** - Reduces API calls
- **Code splitting** - Optimized bundle sizes
- **Lazy loading** - Components load on demand
- **Image optimization** - Automatic image optimization
- **Console removal** - Production builds remove debug logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
