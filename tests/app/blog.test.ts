import path from 'path';
import { getAllPosts, getPost, getPostsForTool, getAllTags } from '@/app/lib/blog';

const dir = path.join(__dirname, '..', 'fixtures', 'blog');

describe('blog lib', () => {
    it('lists published posts newest first', () => {
        const posts = getAllPosts(dir);
        expect(posts.map(p => p.slug)).toEqual(['second-post', 'first-post']);
    });

    it('parses frontmatter', () => {
        const [second] = getAllPosts(dir);
        expect(second).toMatchObject({
            title: 'Second Post',
            description: 'The second fixture post.',
            date: '2026-03-02',
            updated: '2026-03-05',
            tags: ['typescript'],
            relatedTools: ['json-to-typescript'],
            draft: false,
        });
        expect(second.readingMinutes).toBeGreaterThanOrEqual(1);
    });

    it('returns a post with body and null for unknown or unsafe slugs', () => {
        const post = getPost('first-post', dir);
        expect(post?.content).toContain('## Heading');
        expect(post?.content).not.toContain('title:');
        expect(getPost('missing', dir)).toBeNull();
        expect(getPost('../secret', dir)).toBeNull();
    });

    it('filters posts by related tool and skips drafts', () => {
        expect(getPostsForTool('json-formatter', dir).map(p => p.slug)).toEqual(['first-post']);
        expect(getPostsForTool('json-to-go', dir)).toEqual([]);
    });

    it('collects unique sorted tags from published posts', () => {
        expect(getAllTags(dir)).toEqual(['errors', 'json', 'typescript']);
    });
});
