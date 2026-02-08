
export function normalize(value: any): any {
    if (Array.isArray(value)) {
        return value.map(normalize);
    }
    if (value && typeof value === "object") {
        return Object.keys(value)
            .sort()
            .reduce((acc, key) => {
                acc[key] = normalize(value[key]);
                return acc;
            }, {} as any);
    }
    return value;
}
