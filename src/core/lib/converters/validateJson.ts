export interface JSONError {
    line: number;
    column: number;
    message: string;
    type: 'error' | 'warning';
    code?: string;
    suggestion?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: JSONError[];
    warnings: JSONError[];
}

/**
 * Validates JSON and extracts detailed error information including line numbers
 */
export function validateJson(jsonString: string): ValidationResult {
    const errors: JSONError[] = [];
    const warnings: JSONError[] = [];

    if (!jsonString || !jsonString.trim()) {
        return {
            isValid: false,
            errors: [{
                line: 1,
                column: 1,
                message: 'Empty JSON input',
                type: 'error',
                code: 'EMPTY_INPUT'
            }],
            warnings: []
        };
    }

    try {
        // Try to parse as standard JSON first
        JSON.parse(jsonString);
        
        // If successful, check for common warnings
        const lines = jsonString.split('\n');
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const trimmed = line.trim();
            
            // Check for unquoted keys (common JSON5 pattern)
            if (trimmed && /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:/.test(trimmed) && !trimmed.includes('"') && !trimmed.includes("'")) {
                warnings.push({
                    line: lineNum,
                    column: 1,
                    message: 'Unquoted property key detected',
                    type: 'warning',
                    code: 'UNQUOTED_KEY',
                    suggestion: 'Property keys should be double-quoted in JSON'
                });
            }
            
            // Check for trailing commas
            if (trimmed.endsWith(',') && (trimmed.includes('}') || trimmed.includes(']'))) {
                warnings.push({
                    line: lineNum,
                    column: trimmed.length,
                    message: 'Trailing comma detected',
                    type: 'warning',
                    code: 'TRAILING_COMMA',
                    suggestion: 'Trailing commas are not allowed in standard JSON'
                });
            }
            
            // Check for comments
            if (trimmed.includes('//') || trimmed.includes('/*')) {
                warnings.push({
                    line: lineNum,
                    column: trimmed.indexOf('//') > -1 ? trimmed.indexOf('//') + 1 : trimmed.indexOf('/*') + 1,
                    message: 'Comment detected',
                    type: 'warning',
                    code: 'COMMENT_DETECTED',
                    suggestion: 'Comments are not allowed in standard JSON. Use JSON5 format instead.'
                });
            }
        });
    } catch (e: any) {
        // Parse error message to extract line and column
        const errorMessage = e.message || 'Invalid JSON';
        let line = 1;
        let column = 1;
        let message = errorMessage;
        let code = 'PARSE_ERROR';

        // Try to extract line number from error message
        const lineMatch = errorMessage.match(/position\s+(\d+)/i) || errorMessage.match(/line\s+(\d+)/i) || errorMessage.match(/at\s+line\s+(\d+)/i);
        if (lineMatch) {
            const position = parseInt(lineMatch[1]);
            // Calculate line from position
            const beforeError = jsonString.substring(0, position);
            line = beforeError.split('\n').length;
            column = beforeError.split('\n').pop()?.length || 1;
        }

        // Try to extract from "at line X column Y" format
        const lineColMatch = errorMessage.match(/line\s+(\d+).*column\s+(\d+)/i);
        if (lineColMatch) {
            line = parseInt(lineColMatch[1]);
            column = parseInt(lineColMatch[2]);
        }

        // Analyze the error to provide better suggestions
        const lines = jsonString.split('\n');
        const errorLine = lines[line - 1] || '';
        let suggestion = 'Suggestion';
        
        // Check for common errors
        if (errorMessage.includes('Unexpected token') || errorMessage.includes('Expected')) {
            // Check for missing quotes on keys
            if (errorLine.match(/^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:/) && !errorLine.includes('"') && !errorLine.includes("'")) {
                message = 'Property keys must be double-quoted';
                code = 'UNQUOTED_KEY';
                suggestion = `Change "${errorLine.trim()}" to have quoted keys`;
            }
            // Check for missing comma
            else if (errorLine.trim() && !errorLine.trim().endsWith(',') && !errorLine.trim().endsWith('{') && !errorLine.trim().endsWith('[') && line < lines.length) {
                const nextLine = lines[line]?.trim();
                if (nextLine && (nextLine.startsWith('"') || nextLine.match(/^\s*[a-zA-Z_$]/))) {
                    message = 'Expected comma after property value';
                    code = 'MISSING_COMMA';
                    suggestion = 'Add a comma after the property value';
                }
            }
        }

        errors.push({
            line,
            column,
            message,
            type: 'error',
            code,
            suggestion
        });

        // Additional analysis: check for common issues around the error line
        if (line > 0 && line <= lines.length) {
            const errorLineContent = lines[line - 1];
            
            // Check for unclosed brackets
            const openBraces = (errorLineContent.match(/\{/g) || []).length;
            const closeBraces = (errorLineContent.match(/\}/g) || []).length;
            const openBrackets = (errorLineContent.match(/\[/g) || []).length;
            const closeBrackets = (errorLineContent.match(/\]/g) || []).length;
            
            // Count all brackets up to error line
            let totalOpenBraces = 0;
            let totalCloseBraces = 0;
            let totalOpenBrackets = 0;
            let totalCloseBrackets = 0;
            
            for (let i = 0; i < line; i++) {
                totalOpenBraces += (lines[i].match(/\{/g) || []).length;
                totalCloseBraces += (lines[i].match(/\}/g) || []).length;
                totalOpenBrackets += (lines[i].match(/\[/g) || []).length;
                totalCloseBrackets += (lines[i].match(/\]/g) || []).length;
            }
            
            if (totalOpenBraces > totalCloseBraces) {
                warnings.push({
                    line: line,
                    column: errorLineContent.length,
                    message: 'Unclosed object brace',
                    type: 'warning',
                    code: 'UNCLOSED_BRACE',
                    suggestion: 'Add closing brace }'
                });
            }
            
            if (totalOpenBrackets > totalCloseBrackets) {
                warnings.push({
                    line: line,
                    column: errorLineContent.length,
                    message: 'Unclosed array bracket',
                    type: 'warning',
                    code: 'UNCLOSED_BRACKET',
                    suggestion: 'Add closing bracket ]'
                });
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

