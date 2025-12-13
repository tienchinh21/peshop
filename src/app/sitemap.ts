import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/seo/sitemap.service';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await generateCompleteSitemap();
    return entries.map(entry => ({
      url: entry.url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peshop.vn',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    }];
  }
}
export const revalidate = 3600;