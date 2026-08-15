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
    // Generate the static pages in one worker instead of one per core.
    //
    // vercel.json sets NODE_OPTIONS=--max-old-space-size=7168 so the compile
    // step survives the 61MB blog-posts.ts. NODE_OPTIONS is inherited by every
    // child process, so on a 4-core / 8GB build machine the default three
    // static-generation workers each believe they may grow to 7GB. They do not
    // reach it, but they stop collecting early enough that the box starts
    // swapping, and the build sits at "Generating static pages (0/304)"
    // indefinitely rather than failing.
    //
    // One worker at 7GB fits. 304 pages generate sequentially, which is slower
    // than three-way parallelism but finishes, and the compile step is
    // unaffected because it is a single process either way.
    //
    // This is treating the symptom. The cause is that every worker has to load
    // a 61MB TypeScript literal; moving that file to .json is the real fix.
    cpus: 1,
    workerThreads: false,
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
