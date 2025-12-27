import { seoConfig } from './config';
import { API_CONFIG } from '@/lib/config/api.config';
import type { Product } from '@/features/customer/products';
import type { ShopData } from '@/features/customer/shop-view';
import type { SitemapEntry } from './types';
export async function fetchAllProducts(): Promise<Product[]> {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.error('NEXT_PUBLIC_API_URL_DOTNET is not configured');
    return [];
  }
  
  try {
    // Chỉ fetch 1 page đầu để tránh timeout trên Vercel
    const url = `${baseUrl}/Product/get-products?page=1&pageSize=50`;
    console.log('Fetching products for sitemap from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.error || !data.data) {
      console.error('Error in products API response:', data.error);
      return [];
    }
    
    const products = data.data.products || [];
    console.log(`Fetched ${products.length} products for sitemap`);
    return products;
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}
export async function fetchAllShops(): Promise<ShopData[]> {
  console.warn('Shop listing API not implemented yet');
  return [];
}
export async function generateProductSitemap(): Promise<SitemapEntry[]> {
  const products = await fetchAllProducts();
  const baseUrl = seoConfig.site.url;
  return products.map(product => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: seoConfig.sitemap.changeFrequency.products as any,
    priority: seoConfig.sitemap.priority.products
  }));
}
export async function generateShopSitemap(): Promise<SitemapEntry[]> {
  const shops = await fetchAllShops();
  const baseUrl = seoConfig.site.url;
  return shops.map(shop => ({
    url: `${baseUrl}/shop-view/${shop.id}`,
    lastModified: new Date(),
    changeFrequency: seoConfig.sitemap.changeFrequency.shops as any,
    priority: seoConfig.sitemap.priority.shops
  }));
}
export function generateStaticSitemap(): SitemapEntry[] {
  const baseUrl = seoConfig.site.url;
  const now = new Date();
  const staticPages = [{
    path: '/',
    priority: seoConfig.sitemap.priority.homepage,
    changeFreq: seoConfig.sitemap.changeFrequency.homepage
  }, {
    path: '/san-pham',
    priority: seoConfig.sitemap.priority.categories,
    changeFreq: seoConfig.sitemap.changeFrequency.categories
  }, {
    path: '/tim-kiem',
    priority: seoConfig.sitemap.priority.static,
    changeFreq: seoConfig.sitemap.changeFrequency.static
  }];
  return staticPages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq as any,
    priority: page.priority
  }));
}
export async function generateCompleteSitemap(): Promise<SitemapEntry[]> {
  try {
    const [productEntries, shopEntries, staticEntries] = await Promise.all([generateProductSitemap(), generateShopSitemap(), generateStaticSitemap()]);
    const allEntries = [...staticEntries, ...productEntries, ...shopEntries];
    const uniqueUrls = new Set<string>();
    const uniqueEntries = allEntries.filter(entry => {
      if (uniqueUrls.has(entry.url)) {
        return false;
      }
      uniqueUrls.add(entry.url);
      return true;
    });
    return uniqueEntries;
  } catch (error) {
    console.error('Error generating complete sitemap:', error);
    return generateStaticSitemap();
  }
}