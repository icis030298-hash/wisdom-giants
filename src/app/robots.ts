import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/chats'],
    },
    sitemap: 'https://www.giantswisdom.com/sitemap.xml',
  };
}

