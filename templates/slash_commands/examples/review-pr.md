---
name: review-pr
description: Review a GitHub pull request and provide code feedback and suggestions
parameters:
  - name: pr-number
    description: The pull request number to review
    type: number
    required: true
    example: "42"
    hint: Use the PR number from GitHub URL (e.g., github.com/owner/repo/pull/42)
  - name: repo
    description: Repository in owner/name format
    type: string
    required: false
    default: Current repository
    example: owner/repository
    hint: Optional if run in a repository context
  - name: focus
    description: Specific area to focus the review on
    type: string
    required: false
    example: security
    hint: Examples: security, performance, testing, code-style
  - name: depth
    description: Review depth level
    type: string
    required: false
    default: standard
    example: deep
    hint: Options: quick, standard, deep
---

## Overview

Analyzes a pull request and provides comprehensive code review feedback including potential issues, improvements, and suggestions for the changes.

## Syntax

```bash
/review-pr <pr-number> [--repo owner/name] [--focus area] [--depth level]
```

## Arguments

### Required Arguments

- **pr-number**: The pull request number
  - **Type**: number
  - **Example**: `42`

### Optional Arguments

- **--repo**: Repository identifier (owner/name format)
  - **Type**: string
  - **Default**: Uses current repository context
  - **Example**: `--repo anthropics/claude-code`

- **--focus**: Specific review focus area
  - **Type**: string
  - **Options**: `security`, `performance`, `testing`, `code-style`, `all`
  - **Default**: `all`
  - **Example**: `--focus security`

- **--depth**: Review depth level
  - **Type**: string
  - **Options**: `quick` (surface-level), `standard` (balanced), `deep` (thorough)
  - **Default**: `standard`
  - **Example**: `--depth deep`

## Usage Examples

### Basic Review

```bash
/review-pr 42
```

**Output**:
```
PR Review #42: "Add authentication module"

Changes Summary:
- 3 files changed, 156 insertions, 12 deletions
- Main changes: auth.js, middleware.js, tests/auth.test.js

Code Review Feedback:

✓ Strengths:
  - Good test coverage (89%)
  - Clear function documentation
  - Follows established patterns

⚠ Issues Found:
  1. Missing input validation on login endpoint
  2. Password hashing uses deprecated algorithm
  3. No rate limiting on authentication attempts

💡 Suggestions:
  - Consider implementing refresh token rotation
  - Add password complexity requirements
  - Document authentication flow in README
```

### Security-Focused Review

```bash
/review-pr 42 --focus security --depth deep
```

**Output**:
```
PR Review #42: Security Analysis (Deep)

🔒 Security Assessment:

Critical Issues:
  1. SQL injection risk in user query (line 34)
     Recommendation: Use parameterized queries

Warnings:
  1. Credentials in environment variables not validated
  2. API endpoints not protected by authentication

Best Practices:
  ✓ HTTPS enforced
  ✓ Input sanitization present
  ✗ CORS configuration missing
```

### Quick Performance Review

```bash
/review-pr 42 --focus performance --depth quick
```

**Output**:
```
PR Review #42: Performance Check

⚡ Performance Analysis:

Concerns:
  - Database query in loop (N+1 problem)
  - Large bundle size increase (+245KB)
  - No caching strategy detected

Recommendations:
  - Batch database queries
  - Implement lazy loading
  - Consider code splitting
```

## Features

- **Comprehensive Analysis**: Examines code changes, tests, and documentation
- **Focus Areas**: Review specific aspects like security, performance, or testing
- **Flexible Depth**: Choose between quick overview or deep analysis
- **Automated Checks**: Detects common issues and anti-patterns
- **Actionable Feedback**: Provides specific recommendations with line numbers
- **Multiple Report Formats**: Structured output with severity levels

## Review Criteria

The command evaluates:
- **Code Quality**: Style, readability, maintainability
- **Security**: Vulnerabilities, input validation, authentication
- **Performance**: Efficiency, caching, database queries
- **Testing**: Test coverage, edge cases, assertions
- **Documentation**: Comments, docstrings, README updates

## Use Cases

### Security Review

```bash
/review-pr 127 --focus security --depth deep
```

When: Reviewing authentication, authorization, or data handling changes

### Performance Optimization

```bash
/review-pr 85 --focus performance
```

When: Reviewing database queries, API calls, or resource-intensive operations

### Style Consistency

```bash
/review-pr 102 --focus code-style
```

When: Ensuring code follows project standards and conventions

### Test Coverage Verification

```bash
/review-pr 99 --focus testing
```

When: Reviewing changes require comprehensive test coverage

## Output Structure

Each review includes:

1. **Summary**: Overview of changes and impact
2. **Strengths**: What's working well
3. **Issues**: Problems found (categorized by severity)
4. **Suggestions**: Improvements and best practices
5. **Checklist**: Quick reference for resolution

## Requirements

- GitHub API access token configured in environment
- Repository context or `--repo` parameter specified
- PR must exist and be accessible

## Related Commands

- `/test` - Run test suite on PR branch
- `/lint` - Check code style and format
- `/diff` - Compare changes between branches
- `/merge` - Merge approved pull requests

## Troubleshooting

### Error: "PR not found"

**Cause**: Invalid PR number or repository access issue

**Solution**: Verify PR number and repository access permissions

### Error: "Invalid focus area"

**Cause**: Specified focus area is not supported

**Solution**: Use supported values: `security`, `performance`, `testing`, `code-style`, `all`

### Error: "Repository not found"

**Cause**: Repository not specified and not in repository context

**Solution**: Provide `--repo owner/name` parameter

## Version

- **Version**: 1.0.0
- **Created**: 2025-12-15
- **Compatible With**: Claude Code 1.0+
