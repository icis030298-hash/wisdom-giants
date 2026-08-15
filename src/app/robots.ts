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
        // Interactive AI routes. Their server HTML is 400-700 characters of
        // shell — the actual experience renders client-side — so there is
        // nothing to index, and crawling them only spends crawl budget and
        // origin transfer.
        //
        // /debate is deliberately NOT here: unlike the others it serves
        // ~16,000 characters of server HTML, including the ProjectPhilosophy
        // section (the same high-density copy the home page carries for
        // AdSense review). Blocking it would hide that from crawlers.
        disallow: ['/api/', '/scratch/', '/*/chats', '/*/consult', '/*/dna', '/*/reels'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      }
    ],
    sitemap: 'https://www.giantswisdom.com/sitemap.xml',
  };
}
