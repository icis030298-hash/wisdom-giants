import { MetadataRoute } from 'next';
import { giants } from '@/lib/giants-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wisdomgiants.com';
  const locales = ['en', 'ko'];
  
  const routes = ['', '/about', '/privacy', '/terms'];
  
  const staticPages = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const giantPages = locales.flatMap(locale =>
    giants.map(giant => ({
      url: `${baseUrl}/${locale}/giant/${giant.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...giantPages];
}
