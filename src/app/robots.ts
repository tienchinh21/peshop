import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/gio-hang',
        '/thanh-toan',
        '/don-hang',
        '/tai-khoan',
        '/yeu-thich',
        '/shop/',
        '/dang-ky',
        '/xac-thuc',
        '/api/',
        '/_next/',
        '/_vercel/'
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}