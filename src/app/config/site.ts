/** Canonical origin of the live site. Every absolute URL (sitemap, robots, canonicals, JSON-LD) must use it. */
export const SITE_URL = "https://json-powerhouse.codarivu.com";

/**
 * Last time page content changed (YYYY-MM-DD), reported as the sitemap's lastmod for
 * static and tool pages. Bump it on releases that change page content; blog posts use their own dates.
 */
export const SITE_CONTENT_UPDATED = "2026-10-30";
