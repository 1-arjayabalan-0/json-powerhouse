import { create } from 'jsondiffpatch';

const diffpatcher = create({
    // Configuration for visual diff
    arrays: {
        detectMove: true,
        includeValueOnMove: false
    },
    textDiff: {
        minLength: 60
    }
});

export function generateVisualDelta(left: any, right: any) {
    return diffpatcher.diff(left, right);
}

export function formatVisualDelta(delta: any) {
    // This would be used if we need to format it to HTML, but we might use a component for that.
    return delta;
}
