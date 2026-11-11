// Kept free of imports so next.config.ts can load it without pulling in React or icons.
// tests/config/tool-redirects.test.ts checks this list against the tool registry.

/** Tool id → the tool's real path. */
export const TOOL_PATHS: Record<string, string> = {
    'json-formatter': '/tools/json/formatter',
    'json-minifier': '/tools/json/minifier',
    'json-validator': '/tools/json/validator',
    'json-viewer': '/tools/json/viewer',
    'json-text-viewer': '/tools/json/text-viewer',
    'json-json5': '/tools/json/json5',
    'json-diff': '/tools/json/diff',
    'json-transform': '/tools/json/transform',
    'json-normalize': '/tools/json/normalize',
    'json-to-typescript': '/tools/code/json-to-typescript',
    'json-to-java': '/tools/code/json-to-java',
    'json-to-kotlin': '/tools/code/json-to-kotlin',
    'json-to-dart': '/tools/code/json-to-dart',
    'json-to-swift': '/tools/code/json-to-swift',
    'json-to-go': '/tools/code/json-to-go',
    'json-to-csharp': '/tools/code/json-to-csharp',
    'json-to-python': '/tools/code/json-to-python',
    'json-to-rust': '/tools/code/json-to-rust',
    'json-to-php': '/tools/code/json-to-php',
    'json-to-postgresql': '/tools/schema/json-to-postgresql',
    'json-to-mysql': '/tools/schema/json-to-mysql',
    'json-to-sqlite': '/tools/schema/json-to-sqlite',
    'json-to-prisma': '/tools/schema/json-to-prisma',
    'json-to-json-schema': '/tools/schema/json-to-json-schema',
};

/** Extra short names people (or other sites) are likely to use. */
const ALIASES: Record<string, string> = {
    'json-json5': 'json5',
    'json-diff': 'json-diff-checker',
    'json-viewer': 'json-tree-viewer',
};

export function toolRedirects() {
    const entries = Object.entries(TOOL_PATHS).map(([id, destination]) => ({
        source: `/tools/${id}`, destination, permanent: true,
    }));
    for (const [id, alias] of Object.entries(ALIASES)) {
        entries.push({ source: `/tools/${alias}`, destination: TOOL_PATHS[id], permanent: true });
    }
    return entries;
}
