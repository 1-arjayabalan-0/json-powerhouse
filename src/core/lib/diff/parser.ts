import JSON5 from 'json5';
import { ParseResult, ParsedJSON } from './types';

export function parseInput(input: string): ParseResult {
    if (!input.trim()) {
        return { data: null };
    }
    try {
        const data = JSON5.parse(input);
        return { data: normalize(data) };
    } catch (e: any) {
        return {
            data: null,
            error: {
                message: e.message,
                line: e.lineNumber,
                column: e.columnNumber
            }
        };
    }
}

export function normalize(value: ParsedJSON): ParsedJSON {
    if (Array.isArray(value)) {
        return value.map(normalize);
    }
    if (value && typeof value === 'object') {
        return Object.keys(value)
            .sort()
            .reduce((acc, key) => {
                acc[key] = normalize(value[key]);
                return acc;
            }, {} as any);
    }
    return value;
}
