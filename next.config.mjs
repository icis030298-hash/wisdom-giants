import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./src/data/*.json', './src/data/fact-layers/*.json'],
    },
  },
  async redirects() {
    const removedSlugs = ['elon-musk', 'oprah-winfrey', 'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu'];
    const locales = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'];
    return removedSlugs.flatMap(slug =>
      locales.map(locale => ({
        source: `/${locale}/giant/${slug}`,
        destination: `/${locale}#giants`,
        permanent: false,
      }))
    );
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
