import { MetadataRoute } from 'next';

const BASE_URL = 'https://json-powerhouse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/terms',
    '/privacy',
    '/feedback',
    '/tools/tests/diagnostics',
    '/tools/json/validator',
    '/tools/json/formatter',
    '/tools/json/minifier',
    '/tools/json/normalize',
    '/tools/json/viewer',
    '/tools/json/transform',
    '/tools/json/diff',
    '/tools/json/json5',
    '/tools/code/json-to-typescript',
    '/tools/code/json-to-swift',
    '/tools/code/json-to-rust',
    '/tools/code/json-to-python',
    '/tools/code/json-to-php',
    '/tools/code/json-to-kotlin',
    '/tools/code/json-to-java',
    '/tools/code/json-to-go',
    '/tools/code/json-to-dart',
    '/tools/code/json-to-csharp',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}