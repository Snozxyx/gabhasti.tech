import { Helmet } from 'react-helmet-async';
import { absoluteUrl, buildTitle, siteConfig, type SeoProps } from '@/lib/seo';

export const Seo = ({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  noindex,
  jsonLd,
}: SeoProps) => {
  const metaTitle = buildTitle(title);
  const metaDescription = description || siteConfig.description;
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : siteConfig.url;
  const ogImage = absoluteUrl(image || '/logo.png');

  return (
    <Helmet>
      <html lang="en" />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {siteConfig.twitterHandle && <meta name="twitter:site" content={siteConfig.twitterHandle} />}

      {/* Article */}
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' &&
        tags?.map((t) => <meta key={t} property="article:tag" content={t} />)}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

