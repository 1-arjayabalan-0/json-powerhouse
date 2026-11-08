import { MetadataRoute } from 'next';
import { getAllPosts } from '@/app/lib/blog';
import { getVisibleTools } from '@/app/config/tool-registry';
import { SITE_CONTENT_UPDATED, SITE_URL } from '@/app/config/site';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly';

const staticPages: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
];

// Most-used tools rank a little higher; every other visible tool gets the default.
const toolPriority: Record<string, number> = {
  'json-formatter': 0.9,
  'json-validator': 0.9,
  'json-to-typescript': 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = new Date(SITE_CONTENT_UPDATED);
  const posts = getAllPosts();

  const pages = staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: contentUpdated,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Hidden tools (unfinished) and test pages are left out on purpose.
  const tools = getVisibleTools().map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: contentUpdated,
    changeFrequency: 'weekly' as const,
    priority: toolPriority[tool.id] ?? 0.8,
  }));

  const blogIndex = {
    url: `${SITE_URL}/blog`,
    lastModified: posts.length ? new Date(posts[0].updated ?? posts[0].date) : contentUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  };

  const postEntries = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pages, ...tools, blogIndex, ...postEntries];
}
