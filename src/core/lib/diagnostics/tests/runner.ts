
import { diagnoseJson } from "../engine";
import { TestCase } from "./cases";

export interface TestResult {
    caseId: string;
    passed: boolean;
    actualStatus: string;
    actualFixedJson: string | null;
    issuesFound: number;
    message: string;
}

export function runDiagnosticsTests(cases: TestCase[]): TestResult[] {
    return cases.map(testCase => {
        const report = diagnoseJson(testCase.input);
        
        // Determine pass/fail based on expected status
        // Note: Our engine might return 'invalid' with a 'fixedJson' candidate for fatal errors we patched.
        // If we expect 'fixed', we check if fixedJson is present and valid.
        
        let passed = false;
        let message = '';

        if (testCase.expectedStatus === 'valid') {
            passed = report.status === 'valid';
            message = passed ? 'Valid as expected.' : `Expected valid, got ${report.status}`;
        } else if (testCase.expectedStatus === 'fixed') {
            // We consider it passed if we got a fixedJson that is valid
            // Even if status is 'invalid' (due to fatal origin), if we have a valid fixedJson, it's a success for "fixing"
            const effectiveStatus = (report.status === 'fixed' || (report.status === 'invalid' && report.fixedJson)) ? 'fixed' : report.status;
            
            passed = !!report.fixedJson;
            message = passed ? 'Fix generated.' : 'Failed to generate fix.';
            
            // Optional: Verify fixed JSON is actually valid JSON
            if (report.fixedJson) {
                try {
                    JSON.parse(report.fixedJson);
                } catch (e) {
                    passed = false;
                    message = 'Fixed JSON was produced but is invalid.';
                }
            }
        } else {
            // Expected invalid
            passed = report.status === 'invalid' && !report.fixedJson;
            message = passed ? 'Invalid as expected.' : `Expected invalid, got ${report.status} or fixed output.`;
        }

        return {
            caseId: testCase.id,
            passed,
            actualStatus: report.status,
            actualFixedJson: report.fixedJson,
            issuesFound: report.issues.length,
            message
        };
    });
}
