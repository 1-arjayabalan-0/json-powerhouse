import { useState, useEffect } from 'react';

export function usePersistentState(key: string, initialState: string = ""): [string, (value: string) => void] {
    const [state, setState] = useState(initialState);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Only run on client
        const stored = sessionStorage.getItem(key);
        if (stored !== null) {
            setState(stored);
        }
        setIsHydrated(true);
    }, [key]);

    const setPersistentState = (value: string) => {
        setState(value);
        sessionStorage.setItem(key, value);
    };

    return [state, setPersistentState];
}
