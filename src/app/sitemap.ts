/**
 * Dynamic Sitemap Generation
 * 
 * This file generates a dynamic XML sitemap for the PeShop e-commerce platform.
 * It includes:
 * - Static pages (homepage, product listing, search)
 * - Dynamic product pages
 * - Dynamic shop pages
 * 
 * The sitemap is automatically regenerated based on ISR revalidation.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/seo/sitemap.service';

/**
 * Generate dynamic sitemap
 * 
 * This function is called by Next.js to generate the sitemap.xml file.
 * It fetches all products and shops from the API and combines them with static pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await generateCompleteSitemap();
    
    // Convert to Next.js MetadataRoute.Sitemap format
    return entries.map((entry) => ({
      url: entry.url,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap with homepage if generation fails
    return [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peshop.vn',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}

/**
 * Revalidate sitemap every hour
 * This ensures the sitemap stays up-to-date with new products and shops
 */
export const revalidate = 3600; // 1 hour
