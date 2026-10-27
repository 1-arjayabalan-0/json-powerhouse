import { tools, toolGroups, getToolById, getToolByPath, getVisibleTools } from '@/app/config/tool-registry';

describe('tool registry', () => {
    it('has unique ids and paths', () => {
        const ids = tools.map(t => t.id);
        const paths = tools.map(t => t.path);
        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('puts every tool under /tools/ in a known group', () => {
        const groupIds = toolGroups.map(g => g.id);
        for (const t of tools) {
            expect(t.path.startsWith('/tools/')).toBe(true);
            expect(groupIds).toContain(t.group);
            expect(t.tagline.length).toBeGreaterThan(10);
        }
    });

    it('looks tools up by id and path', () => {
        expect(getToolById('json-formatter')?.path).toBe('/tools/json/formatter');
        expect(getToolByPath('/tools/code/json-to-csharp')?.id).toBe('json-to-csharp');
        expect(getToolByPath('/tools/code/json-to-csharp/')?.id).toBe('json-to-csharp');
        expect(getToolByPath('/nope')).toBeUndefined();
        expect(getToolByPath(null)).toBeUndefined();
    });

    it('hides normalize and php from visible lists', () => {
        const visible = getVisibleTools().map(t => t.id);
        expect(visible).not.toContain('json-normalize');
        expect(visible).not.toContain('json-to-php');
        expect(getVisibleTools('json').every(t => t.group === 'json')).toBe(true);
        expect(getVisibleTools('code')).toHaveLength(9);
        expect(getVisibleTools('json')).toHaveLength(8);
    });
});
