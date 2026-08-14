import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

const CANONICAL_HOST_SUFFIX = 'giantswisdom.com';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')?.toLowerCase() ?? '';
  const isCanonicalHost =
    host === CANONICAL_HOST_SUFFIX || host.endsWith(`.${CANONICAL_HOST_SUFFIX}`);

  // Vercel deployment aliases (*.vercel.app) serve the exact same pages as the
  // canonical domain. Letting crawlers walk them burns crawl budget on duplicates
  // and multiplies ISR writes, so keep them out of the index entirely.
  if (!isCanonicalHost) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*/chats', '/scratch/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      }
    ],
    sitemap: 'https://www.giantswisdom.com/sitemap.xml',
  };
}
