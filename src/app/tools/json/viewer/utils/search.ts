export interface SearchResult {
    path: string;
    type: 'key' | 'value';
}

export function searchJson(data: any, query: string): SearchResult[] {
    if (!query) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    function traverse(value: any, path: string) {
        // Check Value
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            if (String(value).toLowerCase().includes(lowerQuery)) {
                results.push({ path, type: 'value' });
            }
        }

        // Check Object/Array
        if (value && typeof value === 'object') {
            Object.keys(value).forEach(key => {
                const currentPath = path ? `${path}.${key}` : key;

                // Check Key
                if (key.toLowerCase().includes(lowerQuery)) {
                    results.push({ path: currentPath, type: 'key' });
                }

                traverse(value[key], currentPath);
            });
        }
    }

    traverse(data, "");
    return results;
}
