export type IssueType = 'SYNTAX_FATAL' | 'SYNTAX_RECOVERABLE' | 'FORMAT_ONLY' | 'SUSPICIOUS';

export type FixRisk = 'safe' | 'needs-review' | 'risky';

export type FixMode = 'auto' | 'suggestion' | 'manual';

export interface Location {
    line: number;
    column: number;
}

export interface SuggestedFix {
    label: string;
    description: string;
    risk: FixRisk;
    preview: {
        before: string;
        after: string;
    };
    replacement?: string;
}

export interface IssueResolution {
    mode: FixMode;
    autoApplied: boolean;
    suggestedFixes: SuggestedFix[];
}

export interface JsonIssue {
    id: string;
    type: IssueType;
    message: string;
    location: Location;
    range?: { start: number; end: number };
    resolution: IssueResolution;
    isFixed?: boolean;
}

export interface DiagnosticsReport {
    status: 'valid' | 'fixed' | 'invalid';
    confidence: 1 | 0.6 | 0;
    fixedJson: string | null;
    issues: JsonIssue[];
    notes: string;
}
