import { TOOL_PATHS, toolRedirects } from '@/app/config/tool-redirects';
import { tools } from '@/app/config/tool-registry';

describe('tool redirects', () => {
    it('has a short URL for every tool, pointing at its real path', () => {
        for (const tool of tools) expect(TOOL_PATHS[tool.id]).toBe(tool.path);
        expect(Object.keys(TOOL_PATHS)).toHaveLength(tools.length);
    });

    it('redirects permanently and never onto itself', () => {
        const redirects = toolRedirects();
        expect(redirects).toContainEqual({ source: '/tools/json-formatter', destination: '/tools/json/formatter', permanent: true });
        expect(redirects).toContainEqual({ source: '/tools/json-to-typescript', destination: '/tools/code/json-to-typescript', permanent: true });
        const realPaths = new Set<string>(tools.map(t => t.path));
        for (const r of redirects) {
            expect(r.permanent).toBe(true);
            expect(realPaths.has(r.source)).toBe(false);
            expect(realPaths.has(r.destination)).toBe(true);
        }
    });
});
