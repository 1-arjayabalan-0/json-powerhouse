import { MetadataRoute } from 'next';

const BASE_URL = 'https://json-powerhouse.codarivu.com';

type RouteConfig = {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
};

const routes: RouteConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/tools/json/formatter', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/json/validator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/json/minifier', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/json/normalize', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/json/viewer', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/json/transform', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/json/diff', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/json/json5', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/code/json-to-typescript', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-java', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-kotlin', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-python', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-csharp', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-swift', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-go', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-dart', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-rust', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/tools/code/json-to-php', priority: 0.7, changeFrequency: 'weekly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}