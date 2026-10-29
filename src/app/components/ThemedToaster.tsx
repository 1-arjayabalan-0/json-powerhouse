"use client"

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ThemedToaster() {
    const { resolvedTheme } = useTheme();
    return <Toaster position="bottom-right" richColors theme={resolvedTheme === 'light' ? 'light' : 'dark'} />;
}
