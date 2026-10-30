import { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /_next/ must stay crawlable: search engines need its CSS and JS to render pages.
      disallow: ['/api/', '/feedback', '/tools/tests/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
