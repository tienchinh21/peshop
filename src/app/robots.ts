import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo/config';
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [{
      userAgent: '*',
      allow: ['/', '/san-pham', '/san-pham/*', '/shop-view/*', '/tim-kiem'],
      disallow: ['/gio-hang', '/thanh-toan', '/don-hang', '/tai-khoan', '/yeu-thich', '/shop', '/shop/*', '/dang-ky', '/xac-thuc', '/api/*', '/_next/*', '/_vercel/*', '/*.json', '/*.xml']
    }, {
      userAgent: 'Googlebot',
      allow: ['/', '/san-pham', '/san-pham/*', '/shop-view/*', '/tim-kiem'],
      disallow: ['/gio-hang', '/thanh-toan', '/don-hang', '/tai-khoan', '/yeu-thich', '/shop', '/shop/*', '/dang-ky', '/xac-thuc', '/api/*', '/_next/*']
    }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}