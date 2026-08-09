import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/[locale]/giant/[slug]': [
      './src/data/narratives/**/*',
      './src/data/fact-layers/**/*',
      './src/data/wikipedia-links.json'
    ],
  },
  experimental: {
  },
  async redirects() {
    const removedSlugs = ['elon-musk', 'oprah-winfrey', 'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu'];
    const locales = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'];
    
    const slugRedirects = removedSlugs.flatMap(slug =>
      locales.map(locale => ({
        source: `/${locale}/giant/${slug}`,
        destination: `/${locale}#giants`,
        permanent: false,
      }))
    );
    
    const testToDnaRedirects = locales.map(locale => ({
      source: `/${locale}/test`,
      destination: `/${locale}/dna`,
      statusCode: 301,
    }));

    const duplicatePairs = [
      { from: 'ataturk', to: 'mustafa-kemal-ataturk' },
      { from: 'queen-elizabeth-i', to: 'elizabeth-i' },
      { from: 'averroes-ibn-rushd', to: 'ibn-rushd' },
      { from: 'avicenna-ibn-sina', to: 'ibn-sina' },
      { from: 'zarathushtra', to: 'zoroaster' },
      { from: 'queen-nzinga', to: 'nzinga-of-ndongo-and-matamba' },
    ];

    const duplicateRedirects = duplicatePairs.flatMap(({ from, to }) =>
      locales.map(locale => ({
        source: `/${locale}/giant/${from}`,
        destination: `/${locale}/giant/${to}`,
        permanent: true,
      }))
    );

    return [...slugRedirects, ...testToDnaRedirects, ...duplicateRedirects];
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
