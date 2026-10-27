import { TextViewerConfig } from '@/core/types/text-viewer-config';

export interface TableColumn {
    key: string;
    mode: 'text' | 'compact';
    maxLength: number;
}

export interface TableRow {
    cells: Record<string, string>;
}

export interface TextTable {
    columns: TableColumn[];
    rows: TableRow[];
    isEmpty: boolean;
}

export function normalizeText(value: string): string {
    return value.replace(/\r\n?/g, '\n');
}

function stringifyCompact(value: unknown): string {
    if (value === undefined) return '';
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value);
    }
}

function toRowObject(data: unknown): Record<string, unknown>[] {
    if (Array.isArray(data)) {
        return Array.from(data, item =>
            item !== null && typeof item === 'object' && !Array.isArray(item)
                ? (item as Record<string, unknown>)
                : { value: item }
        );
    }
    if (data !== null && typeof data === 'object') {
        return [data as Record<string, unknown>];
    }
    return [];
}

export function extractTextTable(data: unknown, config: TextViewerConfig): TextTable {
    const objects = toRowObject(data);
    if (objects.length === 0) {
        return { columns: [], rows: [], isEmpty: true };
    }

    const keys: string[] = [];
    for (const obj of objects) {
        if (obj == null) continue;
        for (const key of Object.keys(obj)) {
            if (!keys.includes(key)) keys.push(key);
        }
    }
    if (keys.length === 0) {
        return { columns: [], rows: [], isEmpty: true };
    }

    const columns: TableColumn[] = keys.map(key => {
        let maxLength = 0;
        let hasLongString = false;
        for (const obj of objects) {
            const value = obj[key];
            if (typeof value === 'string') {
                const len = normalizeText(value).length;
                if (len > maxLength) maxLength = len;
                if (len >= config.textThreshold) hasLongString = true;
            } else {
                const len = stringifyCompact(value).length;
                if (len > maxLength) maxLength = len;
            }
        }
        let mode: TableColumn['mode'] = hasLongString ? 'text' : 'compact';
        if (config.forceTextFields.includes(key)) mode = 'text';
        if (config.excludeTextFields.includes(key)) mode = 'compact';
        return { key, mode, maxLength };
    });

    const rows: TableRow[] = objects.map(obj => {
        const cells = Object.fromEntries(
            keys.map(key => {
                const value = obj[key];
                return [key, typeof value === 'string' ? normalizeText(value) : stringifyCompact(value)];
            })
        );
        return { cells };
    });

    return { columns, rows, isEmpty: false };
}
