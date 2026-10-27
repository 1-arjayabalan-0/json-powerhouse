import type { ToolId } from '@/app/config/tool-registry';

export interface ToolContent {
    intro: string[];
    features: string[];
    howTo: { title: string; description: string }[];
    examples: { title: string; description?: string; input: string; output: string; lang: string }[];
    faq: { question: string; answer: string }[];
    related: ToolId[];
}
