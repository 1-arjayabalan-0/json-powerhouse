import sitemap from '@/app/sitemap';
import { SITE_CONTENT_UPDATED, SITE_URL } from '@/app/config/site';
import { getVisibleTools } from '@/app/config/tool-registry';

describe('sitemap', () => {
    const entries = sitemap();
    const lastmod = (path: string) => {
        const entry = entries.find(e => e.url === `${SITE_URL}${path}`);
        return entry?.lastModified instanceof Date ? entry.lastModified.toISOString().slice(0, 10) : entry?.lastModified;
    };

    it('lists every visible tool once', () => {
        for (const tool of getVisibleTools()) {
            expect(entries.filter(e => e.url === `${SITE_URL}${tool.path}`)).toHaveLength(1);
        }
    });

    it('uses a tool page\'s own content date when it has one', () => {
        expect(lastmod('/tools/schema/json-to-prisma')).toBe('2026-11-08');
        expect(lastmod('/tools/json/validator')).toBe('2026-11-08');
    });

    it('falls back to the site-wide content date', () => {
        expect(lastmod('/tools/code/json-to-go')).toBe(SITE_CONTENT_UPDATED);
        expect(lastmod('')).toBe(SITE_CONTENT_UPDATED);
    });
});
