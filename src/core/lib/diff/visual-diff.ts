import { create } from 'jsondiffpatch';
import { diff_match_patch } from '@dmsnell/diff-match-patch';

const diffpatcher = create({
    // Configuration for visual diff
    arrays: {
        detectMove: true,
        includeValueOnMove: false
    },
    textDiff: {
        minLength: 60,
        diffMatchPatch: diff_match_patch
    }
});

export function generateVisualDelta(left: any, right: any) {
    return diffpatcher.diff(left, right);
}

export function formatVisualDelta(delta: any) {
    // This would be used if we need to format it to HTML, but we might use a component for that.
    return delta;
}
