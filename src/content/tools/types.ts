import type { ToolId } from '@/app/config/tool-registry';

export interface ToolContent {
    /** Last meaningful content change (YYYY-MM-DD), used as the sitemap lastmod. Defaults to SITE_CONTENT_UPDATED. */
    updated?: string;
    intro: string[];
    features: string[];
    howTo: { title: string; description: string }[];
    examples: { title: string; description?: string; input: string; output: string; lang: string }[];
    faq: { question: string; answer: string }[];
    related: ToolId[];
}
