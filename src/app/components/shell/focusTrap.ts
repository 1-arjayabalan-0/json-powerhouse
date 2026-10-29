import type { KeyboardEvent } from "react";

const FOCUSABLE = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

/** Keeps Tab / Shift+Tab inside `container` by wrapping at the edges. */
export function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
    if (e.key !== "Tab" || !container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
    }
}
