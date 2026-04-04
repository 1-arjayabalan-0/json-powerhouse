/**
 * JSON Parse Web Worker
 * 
 * Offloads JSON.parse from the main thread for large payloads.
 * Prevents UI freezing on multi-MB JSON files.
 */

export interface ParseRequest {
    id: string;
    type: 'parse';
    json: string;
}

export interface ParseSuccess {
    id: string;
    type: 'success';
    data: any;
    parseTimeMs: number;
    sizeBytes: number;
}

export interface ParseError {
    id: string;
    type: 'error';
    error: string;
    sizeBytes: number;
}

export type ParseResponse = ParseSuccess | ParseError;

// @ts-ignore - Worker global scope
const ctx: Worker = self as any;

ctx.onmessage = (e: MessageEvent<ParseRequest>) => {
    const { id, type, json } = e.data;

    if (type === 'parse') {
        const sizeBytes = new Blob([json]).size;
        const start = performance.now();

        try {
            const data = JSON.parse(json);
            const parseTimeMs = performance.now() - start;

            ctx.postMessage({
                id,
                type: 'success',
                data,
                parseTimeMs,
                sizeBytes,
            } as ParseSuccess);
        } catch (err: any) {
            ctx.postMessage({
                id,
                type: 'error',
                error: err.message || 'Parse failed',
                sizeBytes,
            } as ParseError);
        }
    }
};
