export interface KeyValueStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export function configKey(toolId: string): string {
    return `jph:config:${toolId}`;
}

export function readToolConfig<T extends object>(storage: KeyValueStorage | null, toolId: string, defaults: T): T {
    if (!storage) return defaults;
    try {
        const raw = storage.getItem(configKey(toolId));
        if (raw === null) return defaults;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaults;
        return { ...defaults, ...(parsed as Partial<T>) };
    } catch {
        return defaults;
    }
}

export function writeToolConfig(storage: KeyValueStorage | null, toolId: string, config: object): void {
    if (!storage) return;
    try {
        storage.setItem(configKey(toolId), JSON.stringify(config));
    } catch {
        // storage full or blocked: settings simply won't persist
    }
}

export function clearToolConfig(storage: KeyValueStorage | null, toolId: string): void {
    if (!storage) return;
    try {
        storage.removeItem(configKey(toolId));
    } catch {
        // ignore
    }
}

export function getBrowserStorage(): KeyValueStorage | null {
    try {
        return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
        return null;
    }
}
