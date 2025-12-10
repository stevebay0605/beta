import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/og-default.jpg',
  url,
  type = 'website',
  noindex = false
}: SEOProps) {
  const siteUrl = 'https://pnfc.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = `${title} | PNFC - Plateforme Nationale de Formation Congolaise`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="PNFC" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      <meta name="language" content="fr-FR" />
      <meta name="geo.region" content="CG" />
      <meta name="geo.placename" content="Brazzaville" />
      <meta name="geo.position" content="-4.2634;15.2429" />
      <meta name="ICBM" content="-4.2634, 15.2429" />
    </Helmet>
  );
}
