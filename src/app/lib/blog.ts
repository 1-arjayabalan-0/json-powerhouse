import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    updated?: string;
    tags: string[];
    relatedTools: string[];
    draft: boolean;
    readingMinutes: number;
}

export interface Post extends PostMeta {
    content: string;
}

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toDateString(value: unknown, field: string, file: string): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    throw new Error(`Blog post ${file}: "${field}" must be a YYYY-MM-DD date`);
}

function requireString(value: unknown, field: string, file: string): string {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Blog post ${file}: missing "${field}"`);
    return value;
}

function stringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(String) : [];
}

function readPostFile(dir: string, slug: string): Post {
    const file = path.join(dir, `${slug}.mdx`);
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return {
        slug,
        title: requireString(data.title, 'title', file),
        description: requireString(data.description, 'description', file),
        date: toDateString(data.date, 'date', file),
        updated: data.updated ? toDateString(data.updated, 'updated', file) : undefined,
        tags: stringArray(data.tags),
        relatedTools: stringArray(data.relatedTools),
        draft: data.draft === true,
        readingMinutes: Math.max(1, Math.round(words / 220)),
        content,
    };
}

function slugsIn(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => f.slice(0, -4))
        .filter(s => SLUG_RE.test(s));
}

export function getAllPosts(dir: string = BLOG_DIR): PostMeta[] {
    return slugsIn(dir)
        .map(slug => readPostFile(dir, slug))
        .filter(p => !p.draft)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ content: _content, ...meta }) => meta)
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, dir: string = BLOG_DIR): Post | null {
    if (!SLUG_RE.test(slug)) return null;
    if (!fs.existsSync(path.join(dir, `${slug}.mdx`))) return null;
    const post = readPostFile(dir, slug);
    return post.draft ? null : post;
}

export function getPostsForTool(toolId: string, dir: string = BLOG_DIR): PostMeta[] {
    return getAllPosts(dir).filter(p => p.relatedTools.includes(toolId));
}

export function getAllTags(dir: string = BLOG_DIR): string[] {
    return Array.from(new Set(getAllPosts(dir).flatMap(p => p.tags))).sort();
}
