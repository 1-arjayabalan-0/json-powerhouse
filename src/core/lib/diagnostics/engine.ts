import JSON5 from 'json5';
import { DiagnosticsReport, JsonIssue, Location, IssueType, FixRisk, FixMode } from '@/core/types/diagnostics';

// Helper to calculate line/column from index
function getLoc(text: string, index: number): Location {
    const prefix = text.substring(0, index);
    const lines = prefix.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
}

// Helper to generate a unique ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export interface DiagnoseOptions {
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
    allowSingleQuotes?: boolean;
    allowUnquotedKeys?: boolean;
    allowUnquotedValues?: boolean;
    // New options
    attemptLogStripping?: boolean;
    attemptUnescaping?: boolean;
    attemptPartialRepair?: boolean;
}

// Helper to close open structures for partial JSON
function repairPartialJson(text: string): string | null {
    const stack: string[] = [];
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (inString) {
            if (escape) {
                escape = false;
            } else if (char === '\\') {
                escape = true;
            } else if (char === '"') {
                inString = false;
            }
            continue;
        }
        
        if (char === '"') {
            inString = true;
        } else if (char === '{') {
            stack.push('}');
        } else if (char === '[') {
            stack.push(']');
        } else if (char === '}') {
            if (stack.length > 0 && stack[stack.length - 1] === '}') {
                stack.pop();
            }
        } else if (char === ']') {
            if (stack.length > 0 && stack[stack.length - 1] === ']') {
                stack.pop();
            }
        }
    }
    
    if (inString) {
        text += '"';
    }
    
    while (stack.length > 0) {
        text += stack.pop();
    }
    
    try {
        JSON5.parse(text);
        return text;
    } catch (e) {
        return null;
    }
}

export function diagnoseJson(input: string, options: DiagnoseOptions = {}): DiagnosticsReport {
    // Default options
    const opts = {
        allowComments: false,
        allowTrailingCommas: false,
        allowSingleQuotes: false,
        allowUnquotedKeys: false,
        allowUnquotedValues: false,
        attemptLogStripping: true,
        attemptUnescaping: true,
        attemptPartialRepair: true,
        ...options
    };

    // 1. Analyze raw input
    const issues: JsonIssue[] = [];
    let fixedJson: string | null = null;
    let confidence: 1 | 0.6 | 0 = 0;
    let status: 'valid' | 'fixed' | 'invalid' = 'invalid';
    let notes = '';

    if (!input.trim()) {
        return {
            status: 'invalid',
            confidence: 0,
            fixedJson: null,
            issues: [],
            notes: 'Input is empty.'
        };
    }

    // Pre-process: Normalize line endings and remove BOM
    // Auto-Fix: Remove BOM / invisible characters
    if (input.charCodeAt(0) === 0xFEFF) {
        input = input.slice(1);
        issues.push({
            id: generateId(),
            type: 'SYNTAX_RECOVERABLE',
            message: 'BOM (Byte Order Mark) detected and removed.',
            location: { line: 1, column: 1 },
            range: { start: 0, end: 0 }, // BOM is at 0, length 0 (removed)
            resolution: {
                mode: 'auto',
                autoApplied: true,
                suggestedFixes: []
            }
        });
    }

    // 2. Attempt Standard Parse & Unescaping
    try {
        const parsed = JSON.parse(input);
        
        // Check for Escaped JSON (Stringified JSON)
        if (opts.attemptUnescaping && typeof parsed === 'string') {
            const trimmed = parsed.trim();
            if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
                (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                try {
                    const innerObj = JSON.parse(trimmed); // Validate inner JSON
                    // It is valid escaped JSON
                    return {
                        status: 'fixed',
                        confidence: 1,
                        fixedJson: JSON.stringify(innerObj, null, 2),
                        issues: [{
                            id: generateId(),
                            type: 'FORMAT_ONLY',
                            message: 'Input was a stringified JSON.',
                            location: { line: 1, column: 1 },
                            range: { start: 0, end: input.length },
                            resolution: {
                                mode: 'auto',
                                autoApplied: true,
                                suggestedFixes: [{
                                    label: 'Unescape JSON',
                                    description: 'Converts stringified JSON to object.',
                                    risk: 'safe',
                                    preview: { before: input.slice(0, 50) + '...', after: trimmed.slice(0, 50) + '...' },
                                    replacement: JSON.stringify(innerObj, null, 2)
                                }]
                            }
                        }],
                        notes: 'Unescaped stringified JSON.'
                    };
                } catch (e) {
                    // Inner content wasn't valid JSON, proceed as valid string
                }
            }
        }

        return {
            status: 'valid',
            confidence: 1,
            fixedJson: input, // Already valid
            issues: [],
            notes: 'JSON is valid.'
        };
    } catch (e) {
        // Standard parse failed, proceed to diagnostics
    }

    // 2b. Attempt Log Stripping / Extraction
    // Only if standard parse failed
    if (opts.attemptLogStripping) {
        const firstBrace = input.indexOf('{');
        const firstBracket = input.indexOf('[');
        let start = -1;
        if (firstBrace !== -1 && firstBracket !== -1) start = Math.min(firstBrace, firstBracket);
        else if (firstBrace !== -1) start = firstBrace;
        else if (firstBracket !== -1) start = firstBracket;

        if (start !== -1) {
            const lastBrace = input.lastIndexOf('}');
            const lastBracket = input.lastIndexOf(']');
            let end = -1;
            if (lastBrace !== -1 && lastBracket !== -1) end = Math.max(lastBrace, lastBracket);
            else if (lastBrace !== -1) end = lastBrace;
            else if (lastBracket !== -1) end = lastBracket;

            if (end > start) {
                const candidate = input.substring(start, end + 1);
                // Check if candidate is different enough to be worth trying (avoid infinite loops or trivial substrings)
                if (candidate.length < input.length) {
                    try {
                        // Try parsing candidate with JSON5 (tolerant)
                        const obj = JSON5.parse(candidate);
                        // Success!
                        return {
                            status: 'fixed',
                            confidence: 0.6,
                            fixedJson: JSON.stringify(obj, null, 2),
                            issues: [{
                                id: generateId(),
                                type: 'SYNTAX_RECOVERABLE',
                                message: 'Extracted JSON from surrounding text/logs.',
                                location: { line: 1, column: 1 },
                                range: { start: 0, end: input.length },
                                resolution: {
                                    mode: 'auto',
                                    autoApplied: true,
                                    suggestedFixes: [{
                                        label: 'Extract JSON',
                                        description: 'Removes non-JSON text.',
                                        risk: 'safe',
                                        preview: { before: input.slice(0, 20) + '...', after: candidate.slice(0, 20) + '...' },
                                        replacement: JSON.stringify(obj, null, 2)
                                    }]
                                }
                            }],
                            notes: 'Extracted JSON from log/text.'
                        };
                    } catch (e) {
                        // Candidate didn't parse, fall through to standard diagnostics
                    }
                }
            }
        }
    }

    // 3. Attempt Tolerant Parsing (JSON5)
    let parsedObj: any = undefined;
    try {
        parsedObj = JSON5.parse(input);
        // If successful, we can potentially fix it
        status = 'fixed';
        fixedJson = JSON.stringify(parsedObj, null, 2);
    } catch (e: any) {
        // Even tolerant parsing failed -> Fatal
        status = 'invalid';
        confidence = 0;

        // 3b. Attempt Partial Repair
        if (opts.attemptPartialRepair) {
            const repaired = repairPartialJson(input);
            if (repaired) {
                 return {
                    status: 'fixed',
                    confidence: 0.6,
                    fixedJson: repaired, // Or prettified
                    issues: [{
                        id: generateId(),
                        type: 'SYNTAX_RECOVERABLE',
                        message: 'Repaired partial/truncated JSON.',
                        location: { line: 1, column: 1 },
                        range: { start: 0, end: input.length },
                        resolution: {
                            mode: 'auto',
                            autoApplied: true,
                            suggestedFixes: [{
                                label: 'Repair Truncated JSON',
                                description: 'Auto-closed open braces/quotes.',
                                risk: 'needs-review',
                                preview: { before: input.slice(-20), after: repaired.slice(-20) },
                                replacement: repaired
                            }]
                        }
                    }],
                    notes: 'Repaired partial JSON.'
                };
            }
        }

        // Extract location from error if possible
        let loc = { line: 0, column: 0 };
        if (e.lineNumber && e.columnNumber) {
            loc = { line: e.lineNumber, column: e.columnNumber };
        }

        issues.push({
            id: generateId(),
            type: 'SYNTAX_FATAL',
            message: e.message || 'Fatal syntax error',
            location: loc,
            range: { start: 0, end: 0 }, // Unknown range for generic error
            resolution: {
                mode: 'manual',
                autoApplied: false,
                suggestedFixes: []
            }
        });

        // Do NOT return here. Continue to find specific issues that might be fixable individually.
    }

    // 4. Detect String Ranges (to avoid false positives in heuristics)
    let match;
    const stringRanges: [number, number][] = [];
    const stringRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
    while ((match = stringRegex.exec(input)) !== null) {
        stringRanges.push([match.index, stringRegex.lastIndex]);
    }

    const isInsideString = (idx: number) => stringRanges.some(([s, e]) => idx >= s && idx < e);

    // 4. Detect Specific Issues (Regex-based heuristics on the original input)

    // 4a. Comments
    if (!opts.allowComments) {
        // Match strings (double/single quoted) OR comments
        // Group 1: Block Comment
        // Group 2: Line Comment
        const tokenRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm;

        while ((match = tokenRegex.exec(input)) !== null) {
            const blockComment = match[1];
            const lineComment = match[2];

            if (blockComment || lineComment) {
                const commentText = blockComment || lineComment;
                // It's a comment, report it
                issues.push({
                    id: generateId(),
                    type: 'SYNTAX_RECOVERABLE',
                    message: 'Comments are not allowed in standard JSON.',
                    location: getLoc(input, match.index),
                    range: { start: match.index, end: match.index + commentText.length },
                    resolution: {
                        mode: 'auto',
                        autoApplied: status !== 'invalid', // Only auto-applied if global fix succeeded
                        suggestedFixes: [{
                            label: 'Remove Comment',
                            description: 'Removes non-standard comments.',
                            risk: 'safe',
                            preview: { before: commentText, after: '' },
                            replacement: ''
                        }]
                    }
                });
            }
            // If it matches a string (no capture groups), we simply continue to the next match, effectively skipping it.
        }
    }

    // 4b. Trailing Commas
    if (!opts.allowTrailingCommas) {
        // Look for comma followed by closing brace/bracket, ignoring whitespace
        const trailingCommaRegex = /,\s*([}\]])/g;
        while ((match = trailingCommaRegex.exec(input)) !== null) {
            if (isInsideString(match.index)) continue;
            const range = { start: match.index, end: match.index + 1 }; // Only the comma
            issues.push({
                id: generateId(),
                type: 'SYNTAX_RECOVERABLE',
                message: 'Trailing commas are not allowed in standard JSON.',
                location: getLoc(input, match.index),
                range,
                resolution: {
                    mode: 'auto',
                    autoApplied: status !== 'invalid',
                    suggestedFixes: [{
                        label: 'Remove Trailing Comma',
                        description: 'Removes the extra comma.',
                        risk: 'safe',
                        preview: { before: ',', after: '' },
                        replacement: ''
                    }]
                }
            });
        }
    }

    // 4c. Single Quotes
    if (!opts.allowSingleQuotes) {
        const singleQuoteRegex = /'([^'\\]*(\\.[^'\\]*)*)'/g;
        while ((match = singleQuoteRegex.exec(input)) !== null) {
            const range = { start: match.index, end: match.index + match[0].length };
            issues.push({
                id: generateId(),
                type: 'FORMAT_ONLY',
                message: 'Single quotes are not standard JSON.',
                location: getLoc(input, match.index),
                range,
                resolution: {
                    mode: 'suggestion',
                    autoApplied: false,
                    suggestedFixes: [{
                        label: 'Convert to Double Quotes',
                        description: 'Replaces single quotes with double quotes.',
                        risk: 'needs-review',
                        preview: { before: match[0], after: `"${match[1]}"` },
                        replacement: `"${match[1]}"`
                    }]
                }
            });
        }
    }

    // 4d. Unquoted Keys
    if (!opts.allowUnquotedKeys) {
        const unquotedKeyRegex = /([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
        while ((match = unquotedKeyRegex.exec(input)) !== null) {
            if (isInsideString(match.index)) continue;
            // match[2] is the key. 
            // We want to replace just the key.
            // Start index of key = match.index + match[0].indexOf(match[2])
            const keyStart = match.index + match[0].indexOf(match[2]);
            const keyEnd = keyStart + match[2].length;
            const range = { start: keyStart, end: keyEnd };

            issues.push({
                id: generateId(),
                type: 'FORMAT_ONLY',
                message: 'Object keys must be quoted.',
                location: getLoc(input, keyStart),
                range,
                resolution: {
                    mode: 'suggestion',
                    autoApplied: false,
                    suggestedFixes: [{
                        label: 'Quote Key',
                        description: 'Wraps the key in double quotes.',
                        risk: 'needs-review',
                        preview: { before: match[2], after: `"${match[2]}"` },
                        replacement: `"${match[2]}"`
                    }]
                }
            });
        }
    }

    // 4e. Unquoted Values (New)
    // Heuristic: : followed by value that is NOT quoted, NOT digit, NOT true/false/null/brace/bracket
    // We look for : followed by whitespace, then a word char.
    // We check if that word is true/false/null. If not, it's likely an unquoted string value.
    const unquotedValueRegex = /:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = unquotedValueRegex.exec(input)) !== null) {
        if (isInsideString(match.index)) continue;
        const value = match[1];
        if (['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'].includes(value)) {
            // Standard or JSON5 allowed values (some non-standard JSON but parsed by JSON5)
            // If it's undefined/NaN/Infinity, JSON5 parses them but JSON doesn't.
            // We should flag them if we want strict JSON.
            // But let's focus on "Unquoted Strings" like 'number'.
            if (['undefined', 'NaN', 'Infinity'].includes(value)) {
                // Warn about non-standard JSON values
                const valStart = match.index + match[0].indexOf(value);
                const valEnd = valStart + value.length;
                const range = { start: valStart, end: valEnd };
                issues.push({
                    id: generateId(),
                    type: 'SYNTAX_RECOVERABLE',
                    message: `Non-standard JSON value: ${value}`,
                    location: getLoc(input, valStart),
                    range,
                    resolution: {
                        mode: 'suggestion',
                        autoApplied: false,
                        suggestedFixes: [{
                            label: 'Convert to String',
                            description: 'Wraps the value in quotes.',
                            risk: 'needs-review',
                            preview: { before: value, after: `"${value}"` },
                            replacement: `"${value}"`
                        }]
                    }
                });
            }
            continue;
        }

        // It is an unquoted string value (e.g. number, string)
        const valStart = match.index + match[0].indexOf(value);
        const valEnd = valStart + value.length;
        const range = { start: valStart, end: valEnd };

        issues.push({
            id: generateId(),
            type: 'SYNTAX_FATAL', // Fatal because it breaks JSON parsing
            message: 'Unquoted string value detected.',
            location: getLoc(input, valStart),
            range,
            resolution: {
                mode: 'suggestion', // Can be fixed manually or via suggestion
                autoApplied: false,
                suggestedFixes: [{
                    label: 'Quote Value',
                    description: 'Wraps the value in double quotes.',
                    risk: 'needs-review',
                    preview: { before: value, after: `"${value}"` },
                    replacement: `"${value}"`
                }]
            }
        });
    }

    // 5. Determine Confidence and Notes
    const hasSuggestions = issues.some(i => i.resolution.mode === 'suggestion');
    // If parsing failed, confidence is 0 unless we have specific recoverable issues?
    // Rules say 0.0 -> fatal syntax error.
    // If we have fatal issues (like unquoted value), confidence stays 0.

    if (status === 'fixed' && issues.length === 0) {
        // If we have no issues detected but JSON5 parsed it and JSON.parse didn't...
        issues.push({
            id: generateId(),
            type: 'SYNTAX_RECOVERABLE',
            message: 'Non-standard JSON detected (e.g. formatting, escape codes).',
            location: { line: 1, column: 1 },
            range: { start: 0, end: 0 },
            resolution: {
                mode: 'auto',
                autoApplied: true,
                suggestedFixes: [{
                    label: 'Normalize JSON',
                    description: 'Converts to standard JSON.',
                    risk: 'safe',
                    preview: { before: '...', after: '...' },
                    replacement: fixedJson || '' // Global replacement
                }]
            }
        });
    }

    // 6. If Status is invalid but we have patches, try to construct a fixedJson
    if (status === 'invalid' && issues.length > 0) {
        // Sort issues by start index descending to avoid offset shifting
        const patches = issues
            .filter(i => i.range && i.resolution.suggestedFixes[0]?.replacement !== undefined)
            .sort((a, b) => (b.range?.start || 0) - (a.range?.start || 0));

        if (patches.length > 0) {
            let patched = input;
            try {
                for (const issue of patches) {
                    const start = issue.range!.start;
                    const end = issue.range!.end;
                    const replacement = issue.resolution.suggestedFixes[0].replacement!;
                    patched = patched.substring(0, start) + replacement + patched.substring(end);
                }

                // Check if patched version is valid JSON5 or JSON
                try {
                    const obj = JSON5.parse(patched);
                    fixedJson = JSON.stringify(obj, null, 2);
                    status = 'fixed';
                    confidence = 0.6; // Recovered from fatal
                    notes = 'Recovered using heuristic patches.';
                } catch (e) {
                    // Even patched version failed
                    // We can still provide the patched version as a "Best Attempt"
                    fixedJson = patched;
                    // Status remains invalid, but we have a fixedJson candidate
                }
            } catch (e) {
                // Patching failed
            }
        }
    }

    notes = hasSuggestions
        ? 'Some issues require your review before fixing.'
        : (status === 'fixed' ? 'Auto-fixes applied successfully.' : 'Fatal errors detected.');

    return {
        status,
        confidence,
        fixedJson,
        issues,
        notes
    };
}
