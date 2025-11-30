export interface Tool {
    id: string;
    name: string;
    path: string;
    icon?: string;
    description?: string;
}

export interface ToolCategory {
    id: string;
    name: string;
    icon: string;
    tools: Tool[];
}

export const toolsConfig: ToolCategory[] = [
    {
        id: 'json-tools',
        name: 'JSON Tools',
        icon: 'data_object',
        tools: [
            { id: 'json-formatter', name: 'JSON Formatter', path: '/tools/json-formatter', icon: 'format_align_left' },
            { id: 'json-minifier', name: 'JSON Minifier', path: '/tools/json-minifier', icon: 'compress' },
            { id: 'json-prettifier', name: 'JSON Prettifier', path: '/tools/json-prettifier', icon: 'auto_awesome' },
            { id: 'json-validator', name: 'JSON Validator', path: '/tools/json-validator', icon: 'task_alt' },
            { id: 'json-viewer', name: 'JSON Viewer (Tree)', path: '/tools/json-viewer', icon: 'account_tree' },
            // { id: 'json-diff', name: 'JSON Diff Checker', path: '/tools/json-diff', icon: 'difference' },
            // { id: 'json-merge', name: 'JSON Merge Tool', path: '/tools/json-merge', icon: 'merge' },
            { id: 'json-beautifier', name: 'JSON Beautifier', path: '/tools/json-beautifier', icon: 'brush' },
            // { id: 'json-editor', name: 'JSON Editor', path: '/tools/json-editor', icon: 'edit_note' },
            { id: 'json-json5', name: 'JSON ↔ JSON5', path: '/tools/json-json5', icon: 'swap_horiz' },
            { id: 'json-normalize', name: 'Strip Comments / Normalize', path: '/tools/json-normalize', icon: 'cleaning_services' },
        ],
    },
    // {
    //     id: 'code-generators',
    //     name: 'Code Generators',
    //     icon: 'code',
    //     tools: [
    //         { id: 'json-to-typescript', name: 'JSON → TypeScript', path: '/tools/json-to-typescript', icon: 'javascript' },
    //         { id: 'json-to-java', name: 'JSON → Java', path: '/tools/json-to-java', icon: 'coffee' },
    //         { id: 'json-to-kotlin', name: 'JSON → Kotlin', path: '/tools/json-to-kotlin', icon: 'code' },
    //         { id: 'json-to-dart', name: 'JSON → Dart', path: '/tools/json-to-dart', icon: 'flutter_dash' },
    //         { id: 'json-to-swift', name: 'JSON → Swift Codable', path: '/tools/json-to-swift', icon: 'code' },
    //         { id: 'json-to-go', name: 'JSON → Go Struct', path: '/tools/json-to-go', icon: 'code' },
    //         { id: 'json-to-csharp', name: 'JSON → C# Class', path: '/tools/json-to-csharp', icon: 'code' },
    //         { id: 'json-to-python', name: 'JSON → Python Dataclass', path: '/tools/json-to-python', icon: 'code' },
    //         { id: 'json-to-rust', name: 'JSON → Rust Struct', path: '/tools/json-to-rust', icon: 'code' },
    //         { id: 'json-to-php', name: 'JSON → PHP Class', path: '/tools/json-to-php', icon: 'code' },
    //     ],
    // },
    // {
    //     id: 'backend-database',
    //     name: 'Backend & Database',
    //     icon: 'storage',
    //     tools: [
    //         { id: 'json-to-sql', name: 'JSON → SQL Table Schema', path: '/tools/json-to-sql', icon: 'table_view' },
    //         { id: 'json-to-mysql', name: 'JSON → MySQL Schema', path: '/tools/json-to-mysql', icon: 'database' },
    //         { id: 'json-to-postgresql', name: 'JSON → PostgreSQL Schema', path: '/tools/json-to-postgresql', icon: 'database' },
    //         { id: 'json-to-sqlite', name: 'JSON → SQLite Schema', path: '/tools/json-to-sqlite', icon: 'database' },
    //         { id: 'json-to-mongodb', name: 'JSON → MongoDB Schema', path: '/tools/json-to-mongodb', icon: 'database' },
    //         { id: 'json-to-dynamodb', name: 'JSON → DynamoDB Schema', path: '/tools/json-to-dynamodb', icon: 'cloud' },
    //         { id: 'json-to-prisma', name: 'JSON → Prisma Schema', path: '/tools/json-to-prisma', icon: 'schema' },
    //         { id: 'json-to-firestore', name: 'JSON → Firestore Model', path: '/tools/json-to-firestore', icon: 'local_fire_department' },
    //     ],
    // },
    // {
    //     id: 'markup-serialization',
    //     name: 'Markup & Serialization',
    //     icon: 'description',
    //     tools: [
    //         { id: 'json-to-yaml', name: 'JSON → YAML', path: '/tools/json-to-yaml', icon: 'article' },
    //         { id: 'json-to-xml', name: 'JSON → XML', path: '/tools/json-to-xml', icon: 'code_blocks' },
    //         { id: 'json-to-csv', name: 'JSON → CSV', path: '/tools/json-to-csv', icon: 'table_chart' },
    //         { id: 'json-to-toml', name: 'JSON → TOML', path: '/tools/json-to-toml', icon: 'settings' },
    //         { id: 'json-to-ini', name: 'JSON → INI', path: '/tools/json-to-ini', icon: 'settings' },
    //         { id: 'json-to-markdown', name: 'JSON → Markdown Table', path: '/tools/json-to-markdown', icon: 'table_rows' },
    //         { id: 'json-to-html', name: 'JSON → HTML Table', path: '/tools/json-to-html', icon: 'table_view' },
    //     ],
    // },
    // {
    //     id: 'developer-tools',
    //     name: 'Developer Tools',
    //     icon: 'construction',
    //     tools: [
    //         { id: 'js-minifier', name: 'JavaScript Minifier', path: '/tools/js-minifier', icon: 'compress' },
    //         { id: 'css-minifier', name: 'CSS Minifier', path: '/tools/css-minifier', icon: 'compress' },
    //         { id: 'html-minifier', name: 'HTML Minifier', path: '/tools/html-minifier', icon: 'compress' },
    //         { id: 'api-builder', name: 'API Request Builder', path: '/tools/api-builder', icon: 'api' },
    //         { id: 'curl-to-js', name: 'cURL → JavaScript/Fetch', path: '/tools/curl-to-js', icon: 'code' },
    //         { id: 'curl-to-axios', name: 'cURL → Axios/Node', path: '/tools/curl-to-axios', icon: 'code' },
    //         { id: 'env-manager', name: 'Environment Variable Manager', path: '/tools/env-manager', icon: 'settings' },
    //         { id: 'openapi-viewer', name: 'OpenAPI (Swagger) Viewer', path: '/tools/openapi-viewer', icon: 'api' },
    //     ],
    // },
    // {
    //     id: 'utilities',
    //     name: 'Utility Tools',
    //     icon: 'build',
    //     tools: [
    //         { id: 'uuid-generator', name: 'UUID Generator', path: '/tools/uuid-generator', icon: 'fingerprint' },
    //         { id: 'hash-generator', name: 'Hash Generators (MD5/SHA)', path: '/tools/hash-generator', icon: 'tag' },
    //         { id: 'base64', name: 'Base64 Encode/Decode', path: '/tools/base64', icon: 'lock' },
    //         { id: 'jwt-decoder', name: 'JWT Decoder', path: '/tools/jwt-decoder', icon: 'vpn_key' },
    //         { id: 'color-picker', name: 'Color Picker / Converter', path: '/tools/color-picker', icon: 'palette' },
    //         { id: 'regex-tester', name: 'Regex Tester', path: '/tools/regex-tester', icon: 'search' },
    //         { id: 'timestamp-converter', name: 'Timestamp Converter', path: '/tools/timestamp-converter', icon: 'schedule' },
    //         { id: 'url-parser', name: 'URL Parser/Encoder', path: '/tools/url-parser', icon: 'link' },
    //         { id: 'text-diff', name: 'Text Diff Tool', path: '/tools/text-diff', icon: 'difference' },
    //         { id: 'number-formatter', name: 'Number Formatter', path: '/tools/number-formatter', icon: 'pin' },
    //     ],
    // },
];

// Helper function to get tool by path
export function getToolByPath(path: string): Tool | undefined {
    for (const category of toolsConfig) {
        const tool = category.tools.find(t => t.path === path);
        if (tool) return tool;
    }
    return undefined;
}

// Helper function to get category by tool path
export function getCategoryByToolPath(path: string): ToolCategory | undefined {
    return toolsConfig.find(category =>
        category.tools.some(tool => tool.path === path)
    );
}

// Helper function to get all tools as flat array
export function getAllTools(): Tool[] {
    return toolsConfig.flatMap(category => category.tools);
}
