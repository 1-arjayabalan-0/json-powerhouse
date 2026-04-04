"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import type { ParseRequest, ParseResponse, ParseSuccess, ParseError } from "@/workers/json-parse.worker";

export interface UseJsonWorkerResult {
    /** The parsed JSON data */
    data: any;
    /** Whether parsing is in progress */
    isParsing: boolean;
    /** Parse error message if any */
    error: string | null;
    /** Time taken to parse in milliseconds */
    parseTimeMs: number;
    /** Size of the input in bytes */
    sizeBytes: number;
    /** Whether the worker was used (vs synchronous fallback) */
    usedWorker: boolean;
}

const WORKER_THRESHOLD_BYTES = 100 * 1024; // 100KB - use worker above this size

/**
 * Hook for parsing JSON with Web Worker support for large files.
 * Falls back to synchronous parsing for small inputs or when Worker is unavailable.
 */
export function useJsonWorker(input: string): UseJsonWorkerResult {
    const [data, setData] = useState<any>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parseTimeMs, setParseTimeMs] = useState(0);
    const [sizeBytes, setSizeBytes] = useState(0);
    const [usedWorker, setUsedWorker] = useState(false);

    const workerRef = useRef<Worker | null>(null);
    const pendingIdRef = useRef<string | null>(null);

    // Cleanup worker on unmount
    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const parseWithWorker = useCallback((json: string, id: string): Promise<ParseResponse> => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                try {
                    workerRef.current = new Worker(
                        new URL('@/workers/json-parse.worker.ts', import.meta.url),
                        { type: 'module' }
                    );
                } catch (e) {
                    reject(new Error('Worker not available'));
                    return;
                }
            }

            const worker = workerRef.current;

            const handler = (e: MessageEvent<ParseResponse>) => {
                if (e.data.id === id) {
                    worker.removeEventListener('message', handler);
                    resolve(e.data);
                }
            };

            worker.addEventListener('message', handler);

            worker.postMessage({
                id,
                type: 'parse',
                json,
            } as ParseRequest);
        });
    }, []);

    const parseSync = useCallback((json: string): ParseResponse => {
        const sizeBytes = new Blob([json]).size;
        const start = performance.now();
        const id = 'sync';

        try {
            const data = JSON.parse(json);
            return {
                id,
                type: 'success',
                data,
                parseTimeMs: performance.now() - start,
                sizeBytes,
            };
        } catch (err: any) {
            return {
                id,
                type: 'error',
                error: err.message || 'Parse failed',
                sizeBytes,
            };
        }
    }, []);

    // Parse when input changes
    useEffect(() => {
        if (!input.trim()) {
            setData(null);
            setError(null);
            setParseTimeMs(0);
            setSizeBytes(0);
            setIsParsing(false);
            return;
        }

        const inputSize = new Blob([input]).size;
        setSizeBytes(inputSize);

        // Cancel any pending worker request
        if (pendingIdRef.current && workerRef.current) {
            // Old request will be ignored via ID matching
            pendingIdRef.current = null;
        }

        const requestId = `${Date.now()}-${Math.random()}`;
        pendingIdRef.current = requestId;
        setIsParsing(true);

        const doParse = async () => {
            if (inputSize > WORKER_THRESHOLD_BYTES) {
                // Try worker first
                try {
                    const result = await parseWithWorker(input, requestId);

                    if (pendingIdRef.current !== requestId) return; // Stale request

                    setUsedWorker(true);
                    setIsParsing(false);
                    setParseTimeMs(result.type === 'success' ? result.parseTimeMs : 0);

                    if (result.type === 'success') {
                        setData((result as ParseSuccess).data);
                        setError(null);
                    } else {
                        setData(null);
                        setError((result as ParseError).error);
                    }
                    return;
                } catch {
                    // Worker failed, fall through to sync
                }
            }

            // Synchronous fallback
            const result = parseSync(input);

            if (pendingIdRef.current !== requestId) return; // Stale request

            setUsedWorker(false);
            setIsParsing(false);
            setParseTimeMs(result.type === 'success' ? result.parseTimeMs : 0);

            if (result.type === 'success') {
                setData((result as ParseSuccess).data);
                setError(null);
            } else {
                setData(null);
                setError((result as ParseError).error);
            }
        };

        doParse();
    }, [input, parseWithWorker, parseSync]);

    return { data, isParsing, error, parseTimeMs, sizeBytes, usedWorker };
}
