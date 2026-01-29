---
name: pr-review
description: Complete pull request review workflow with automated checks and feedback
type: workflow
phases: 4
---

# PR Review Workflow

An automated end-to-end pull request review workflow that orchestrates multiple agents and tools to provide comprehensive code review feedback.

## Usage

```
/pr-review <pr-number-or-url>
```

## Workflow Phases

### Phase 1: Context Gathering

Collect all information about the pull request:

```
Use the GitHub MCP server to fetch PR details:
- Changed files and diff
- PR description and linked issues
- Author and reviewer information
- CI/CD status
```

### Phase 2: Code Analysis

Use the **code-review** agent to analyze changes:

```
Analyze the PR for:
1. Code quality and best practices
2. Security vulnerabilities (OWASP top 10)
3. Performance implications
4. Test coverage gaps
5. Documentation needs
```

### Phase 3: Automated Checks

Run automated verification:

```
Execute the following checks:
1. /test - Run test suite on changed files
2. /lint - Check code style compliance
3. /typecheck - Verify type safety
4. /security-scan - Run security analysis
```

### Phase 4: Summary Generation

Generate comprehensive review report:

```
Create a review summary including:
- Overall assessment (approve/request changes/comment)
- Critical issues requiring attention
- Suggestions for improvement
- Test coverage report
- Security findings
```

## Output Format

The workflow produces a structured review with:
- **Status**: Approved / Changes Requested / Needs Discussion
- **Critical Issues**: Blocking problems that must be fixed
- **Suggestions**: Non-blocking improvements
- **Test Results**: Pass/fail status and coverage
- **Security**: Any vulnerabilities detected

## Integration

Works with:
- GitHub MCP Server (required)
- code-review agent
- unit-test agent
