"use client"

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";

export function isDesktopNow(): boolean {
    return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

function subscribe(cb: () => void) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

/** True at the `lg` breakpoint and above. Server snapshot is false. */
export function useDesktop(): boolean {
    return useSyncExternalStore(subscribe, isDesktopNow, () => false);
}
