export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  duration: number;
}

export interface TestReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  suites: TestSuite[];
  coverage?: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
  };
  issues: TestIssue[];
}

export interface TestIssue {
  testName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}

export function createTestReport(
  suites: TestSuite[],
  totalTests: number,
  passed: number,
  failed: number,
  skipped: number,
  duration: number,
  coverage?: TestReport['coverage']
): TestReport {
  const issues: TestIssue[] = [];

  suites.forEach(suite => {
    suite.tests.forEach(test => {
      if (test.status === 'failed' && test.error) {
        issues.push({
          testName: test.name,
          severity: test.error.includes('timeout') ? 'high' : 'medium',
          description: test.error,
          suggestion: 'Review test case and fix implementation'
        });
      }
    });
  });

  return {
    timestamp: new Date().toISOString(),
    totalTests,
    passed,
    failed,
    skipped,
    duration,
    suites,
    coverage,
    issues
  };
}

export function generateMarkdownReport(report: TestReport): string {
  let md = `# JSON PowerHouse Test Report\n\n`;
  md += `**Generated:** ${report.timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Tests | ${report.totalTests} |\n`;
  md += `| Passed | ${report.passed} |\n`;
  md += `| Failed | ${report.failed} |\n`;
  md += `| Skipped | ${report.skipped} |\n`;
  md += `| Duration | ${report.duration}ms |\n\n`;

  if (report.coverage) {
    md += `## Coverage\n\n`;
    md += `| Type | Percentage |\n`;
    md += `|------|------------|\n`;
    md += `| Branches | ${report.coverage.branches}% |\n`;
    md += `| Functions | ${report.coverage.functions}% |\n`;
    md += `| Lines | ${report.coverage.lines}% |\n`;
    md += `| Statements | ${report.coverage.statements}% |\n\n`;
  }

  md += `## Test Suites\n\n`;
  report.suites.forEach(suite => {
    md += `### ${suite.name}\n\n`;
    md += `| Test | Status | Duration |\n`;
    md += `|------|--------|----------|\n`;
    suite.tests.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
      md += `| ${test.name} | ${icon} ${test.status} | ${test.duration || 0}ms |\n`;
    });
    md += '\n';
  });

  if (report.issues.length > 0) {
    md += `## Issues Found\n\n`;
    report.issues.forEach(issue => {
      md += `### ${issue.testName}\n`;
      md += `- **Severity:** ${issue.severity}\n`;
      md += `- **Description:** ${issue.description}\n`;
      md += `- **Suggestion:** ${issue.suggestion}\n\n`;
    });
  }

  md += `## Recommendations\n\n`;
  if (report.failed > 0) {
    md += `1. Fix failing tests immediately - these represent broken functionality\n`;
  }
  if (report.coverage && report.coverage.lines < 50) {
    md += `2. Increase test coverage to at least 50%\n`;
  }
  md += `3. Add more edge case tests for robust functionality\n`;
  md += `4. Run performance tests to ensure scalability\n`;

  return md;
}