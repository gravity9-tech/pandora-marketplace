---
name: automated-workflow
description: Orchestrates multiple subagents and slash commands to automate a complex development task
type: workflow
phases: 3
components:
  - subagents
  - slash-commands
  - mcp-servers
argument-hint: [primary-target] [--option value]
---

# Automated Workflow Template

This workflow automates a complex development process by orchestrating multiple subagents, slash commands, and external integrations into a coordinated pipeline.

## Workflow Overview

Execute these 3 phases sequentially:

### Phase 1: Analysis & Data Collection
### Phase 2: Processing & Validation
### Phase 3: Reporting & Integration

---

## Phase 1: Analysis & Data Collection

**Primary Component**: `analysis-subagent`

Use the **`analysis-subagent`** to gather and analyze information about the target:

1. Use Glob to discover relevant files matching pattern: `src/**/*.{js,ts}`
2. Use Grep to search for specific patterns and metrics
3. Use Read to examine key configuration files:
   - package.json
   - configuration files relevant to target
   - documentation files
4. Compile findings into a comprehensive analysis report

**Expected Output**: Structured analysis report containing:
- File inventory and count
- Technology stack identified
- Dependencies and integration points
- Key metrics and statistics
- Potential issues or patterns

**Next Step**: Pass analysis report to Phase 2

---

## Phase 2: Processing & Validation

**Primary Component**: `validator-subagent`

After Phase 1 completes, use the **`validator-subagent`** to process findings and validate quality:

1. Receive analysis report from Phase 1
2. Execute the **/test** slash command:
   ```
   /test [primary-target] --coverage --verbose
   ```
   Wait for test execution to complete

3. Use the **GitHub MCP server** to fetch additional context:
   - Query recent commits
   - Check pull request status
   - Retrieve team standards/policies

4. Execute the **/validate** slash command:
   ```
   /validate [primary-target] --against-baseline --strict-mode
   ```
   This checks quality gates and thresholds

5. Cross-reference test results with analysis data
6. Generate validation report with pass/fail status

**Expected Output**: Validation report containing:
- Test results summary
- Quality gate status (pass/fail)
- Coverage metrics
- Comparison against baseline
- List of issues found (if any)
- Recommendations for improvement

**Next Step**: Pass validation results to Phase 3

---

## Phase 3: Reporting & Integration

**Primary Component**: `report-generator-subagent`

Once Phase 2 completes, use the **`report-generator-subagent`** to finalize and distribute results:

1. Receive validation report from Phase 2
2. Write comprehensive summary report using Write tool
3. Execute the **/publish** slash command:
   ```
   /publish [primary-target] --format markdown --destination reports/
   ```
   This generates formatted output files

4. Use the **Slack MCP server** to send notifications:
   - Post workflow completion status
   - Share key metrics
   - Alert relevant team members

5. Use Bash to archive results:
   ```bash
   tar -czf workflow-results-[timestamp].tar.gz results/
   ```

6. Execute the **/notify** slash command:
   ```
   /notify team --channel #development --message "Workflow completed"
   ```

**Expected Output**: Completed deliverables:
- Generated report files
- Slack notifications sent
- Results archived
- Team notified of completion

**Workflow Complete**: All phases finished successfully

---

## Workflow Execution Instructions

### Starting the Workflow

When a user invokes this workflow with:
```bash
/automated-workflow feature/new-module --notify
```

Follow these steps in order:

**Step 1**: Parse arguments
- Primary Target: `feature/new-module`
- Options: `--notify` flag enabled

**Step 2**: Announce workflow start
```
🚀 Workflow Started: feature/new-module
Executing Phase 1: Analysis & Data Collection...
```

**Step 3**: Execute Phase 1
- Invoke analysis-subagent with target
- Let it complete fully before proceeding
- Capture output report

**Step 4**: Execute Phase 2
- Announce: "Phase 2: Processing & Validation..."
- Invoke validator-subagent with Phase 1 results
- Execute /test and /validate commands as instructed
- Let all commands complete

**Step 5**: Execute Phase 3
- Announce: "Phase 3: Reporting & Integration..."
- Invoke report-generator-subagent with Phase 2 results
- Execute /publish and /notify commands
- Archive results

**Step 6**: Completion
```
✅ Workflow Complete: SUCCESS
Summary: [brief summary of results]
Reports: [link to generated files]
```

---

## Component Interaction

```
User Input: /automated-workflow [target]
        ↓
   Phase 1: analysis-subagent
   ├─ Runs: Glob, Grep, Read tools
   ├─ Output: Analysis report
   └─ ↓
   Phase 2: validator-subagent
   ├─ Runs: /test command
   ├─ Runs: /validate command
   ├─ Queries: GitHub MCP server
   ├─ Output: Validation report
   └─ ↓
   Phase 3: report-generator-subagent
   ├─ Runs: /publish command
   ├─ Runs: /notify command
   ├─ Queries: Slack MCP server
   ├─ Output: Reports, Notifications, Archives
   └─ ↓
Workflow Complete
```

---

## Error Handling

### If analysis-subagent fails:
- Capture error message
- Report to user with details
- Offer option to retry or skip to manual analysis
- Do NOT proceed to Phase 2

### If /test command fails:
- Log the failure
- Continue with Phase 2 using previous test results if available
- Mark tests as "incomplete" in validation report
- Still proceed to reporting but flag the issue

### If GitHub MCP server is unavailable:
- Use cached data from last successful query
- Mark data as "stale" in report
- Continue Phase 2 with available data
- Alert user that some data is outdated

### If /publish command fails:
- Try alternative format or destination
- Manually write summary to default location
- Continue to Phase 3 notifications
- Report error to user with fallback taken

---

## Parameters & Options

### Required Parameters

- **primary-target**: The branch, service, or module to process
  - Type: string
  - Example: `feature/payment-system`, `production`, `critical-fix`

### Optional Parameters

- **--option**: Configuration option
  - `--verbose`: Show detailed output from each phase
  - `--skip-tests`: Skip test execution in Phase 2
  - `--dry-run`: Show what would execute without making changes
  - `--notify`: Send notifications on completion (enabled by default with flag)

---

## Usage Examples

### Basic Workflow

```bash
/automated-workflow feature/new-api
```

Result: Complete 3-phase execution with default settings

### Verbose Workflow with Notifications

```bash
/automated-workflow feature/new-api --verbose --notify
```

Result: Detailed output at each phase, Slack notifications sent at completion

### Skip Testing

```bash
/automated-workflow hotfix/critical-bug --skip-tests
```

Result: Execute phases but skip /test command, move to validation

---

## Customization

To adapt this template for different workflows:

1. **Change subagent names**: Replace `analysis-subagent` with domain-specific names
   - Example: `security-analyzer`, `performance-profiler`, `documentation-generator`

2. **Modify slash commands**: Replace `/test` and `/validate` with relevant commands
   - Example: `/lint`, `/security-scan`, `/build`, `/deploy`

3. **Adjust phases**: Add or remove phases based on process
   - Example: Add Phase 0 for preparation, Phase 4 for cleanup

4. **Different MCP servers**: Replace GitHub/Slack with other integrations
   - Example: Azure DevOps, Jira, PagerDuty

---

## Key Principles

- **Sequential Execution**: Each phase waits for previous phase completion
- **Clear Handoff**: Output from one phase becomes input to next
- **Error Handling**: Failures are captured and reported
- **Progress Reporting**: User informed of status at each phase
- **Component Reusability**: Same subagents/commands used across multiple workflows

---

## Version

- **Version**: 1.0.0
- **Created**: 2025-12-15
- **Supports**: Subagents, Slash Commands, MCP Servers
- **Minimum Claude Code**: 1.5+
