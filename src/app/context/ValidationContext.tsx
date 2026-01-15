"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import { JSONError } from '@/core/lib/converters/validateJson';

interface ValidationContextType {
    errors: JSONError[];
    warnings: JSONError[];
    setErrors: (errors: JSONError[]) => void;
    setWarnings: (warnings: JSONError[]) => void;
    onErrorClick?: (error: JSONError) => void;
    setOnErrorClick: (handler: (error: JSONError) => void) => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export function ValidationProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<JSONError[]>([]);
    const [warnings, setWarnings] = useState<JSONError[]>([]);
    const [onErrorClick, setOnErrorClick] = useState<((error: JSONError) => void) | undefined>(undefined);

    return (
        <ValidationContext.Provider value={{ errors, warnings, setErrors, setWarnings, onErrorClick, setOnErrorClick }}>
            {children}
        </ValidationContext.Provider>
    );
}

export function useValidation() {
    const context = useContext(ValidationContext);
    if (context === undefined) {
        throw new Error('useValidation must be used within a ValidationProvider');
    }
    return context;
}

