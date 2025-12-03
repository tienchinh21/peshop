/**
 * Robots.txt Generation
 * 
 * This file generates the robots.txt file for the PeShop e-commerce platform.
 * It configures crawling rules for search engine bots:
 * - Allows crawling of all public pages
 * - Disallows crawling of protected routes (cart, checkout, account, etc.)
 * - Disallows crawling of API routes and internal Next.js routes
 * - References the sitemap for efficient crawling
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo/config';

/**
 * Generate robots.txt configuration
 * 
 * This function is called by Next.js to generate the robots.txt file.
 * It defines which routes search engines can and cannot crawl.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',                    // Homepage
          '/san-pham',            // Product listing
          '/san-pham/*',          // Product details
          '/shop-view/*',         // Shop pages
          '/tim-kiem',            // Search page
        ],
        disallow: [
          // Protected routes - require authentication
          '/gio-hang',            // Cart
          '/thanh-toan',          // Checkout
          '/don-hang',            // Orders
          '/tai-khoan',           // Account
          '/yeu-thich',           // Wishlist
          '/shop',                // Shop management
          '/shop/*',              // All shop management routes
          
          // Public auth routes - no need to index
          '/dang-ky',             // Registration
          '/xac-thuc',            // Authentication
          
          // API routes
          '/api/*',
          
          // Next.js internal routes
          '/_next/*',
          '/_vercel/*',
          
          // Private files
          '/*.json',
          '/*.xml',
        ],
      },
      // Specific rules for major search engines (optional, inherits from *)
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/san-pham',
          '/san-pham/*',
          '/shop-view/*',
          '/tim-kiem',
        ],
        disallow: [
          '/gio-hang',
          '/thanh-toan',
          '/don-hang',
          '/tai-khoan',
          '/yeu-thich',
          '/shop',
          '/shop/*',
          '/dang-ky',
          '/xac-thuc',
          '/api/*',
          '/_next/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
