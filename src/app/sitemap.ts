import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/seo/sitemap.service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://peshop.vn';
  
  try {
    const entries = await generateCompleteSitemap();
    
    if (entries.length === 0) {
      return getStaticSitemap(baseUrl);
    }
    
    return entries.map(entry => ({
      url: entry.url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return getStaticSitemap(baseUrl);
  }
}

function getStaticSitemap(baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/tim-kiem`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4
    }
  ];
}