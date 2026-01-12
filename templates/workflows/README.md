# Workflows

This folder contains templates and examples for creating automated workflows in Claude Code that orchestrate multiple components to automate software development lifecycle (SDLC) processes.

## What is a Workflow?

A **workflow** is an automated slash command that orchestrates multiple Claude Code components (subagents, other slash commands, MCP servers, and tools) to accomplish complex development tasks. Instead of executing tasks manually or one at a time, workflows coordinate these components in a predefined sequence to ensure consistency, quality, and efficiency.

### Workflow vs Single Command

**Without workflow** (manual process):
```
User runs /test
User runs /review
User runs /qa
User runs /performance-check
(repeat each time)
```

**With workflow** (automated):
```
User runs /frontend-workflow
└─ Internally executes: test → review → qa → performance-check
```

## Why Use Workflows?

- **Automation**: Reduce manual, repetitive tasks
- **Consistency**: Execute the same process every time
- **Efficiency**: Run multiple components in optimized sequence
- **Quality**: Enforce standards through automated checks
- **Speed**: Parallel execution where possible
- **Integration**: Combine specialized tools into unified pipelines

## Folder Structure

```
workflows/
├── README.md                    # This file
├── workflow_template.md         # Template for creating workflows
└── examples/
    ├── deepwiki.md             # Documentation generation workflow
    └── [other examples]
```

## Understanding Workflow Components

Each workflow is composed of one or more of these Claude Code components:

### 1. Subagents

Specialized AI agents that handle focused tasks autonomously.

```
Use the [subagent-name] subagent to [specific task]:
1. Perform first step
2. Perform second step
3. Return results in [format]
```

**Common subagents in workflows**:
- `frontend-analyzer`: Analyzes frontend code, components, UI/UX
- `backend-analyzer`: Analyzes backend code, APIs, services
- `qa-tester`: Runs test suites, generates coverage reports
- `reviewer`: Reviews code for standards, best practices
- `performance-profiler`: Analyzes performance, identifies bottlenecks

### 2. Slash Commands

Pre-defined commands that perform specific operations.

```
Execute the /[command-name] slash command:
/[command-name] [target] --option value
```

**Common slash commands in workflows**:
- `/test`: Run test suites
- `/review`: Perform code review
- `/lint`: Check code style
- `/build`: Compile/build application
- `/deploy`: Deploy to environment
- `/performance-test`: Run performance benchmarks

### 3. MCP Servers

External service integrations that provide real-time data and operations.

```
Use the [server-name] MCP server to [operation]:
Query: [what to retrieve]
Response: [format of data]
```

**Common MCP servers in workflows**:
- **Figma MCP**: Retrieve design files and specifications
- **GitHub MCP**: Fetch code, PRs, and repository metadata
- **Slack MCP**: Send notifications and updates
- **Azure DevOps MCP**: Access pipelines, work items

### 4. Built-in Tools

Direct file and system operations.

- **Glob**: Find files matching patterns
- **Grep**: Search file contents
- **Read**: Extract file contents
- **Write**: Create/modify files
- **Bash**: Execute system commands

## Workflow Types in SDLC

Different types of workflows for different development scenarios:

### Frontend Workflow

**Purpose**: Validate frontend features from design to deployment

**Components**:
1. **Read Figma file** (Figma MCP server) - Retrieve design specifications
2. **frontend** (subagent) - Implement frontend code, components, styling
3. **review** (subagent) - Code review for frontend standards
4. **qa** (subagent) - Run frontend tests, visual regression tests
5. **performance** (subagent) - Performance testing, load testing

**Example invocation**:
```bash
/frontend-workflow feature/user-dashboard
```

**Execution sequence**:
```
Phase 1: Design Review
├─ Use Figma MCP to fetch design specs
└─ Extract requirements and components

Phase 2: Frontend Analysis
├─ Use frontend-subagent to implement code
└─ Check component structure, styling, responsiveness

Phase 3: Code Review
├─ Use reviewer-subagent for code standards
└─ Validate against frontend best practices

Phase 4: Quality Assurance
├─ Use qa-subagent to run tests
└─ Generate test coverage and reports

Phase 5: Performance Testing
├─ Use performance-subagent for benchmarks
└─ Check load times, memory usage
```

### Backend Workflow

**Purpose**: Validate backend services and APIs

**Components**:
1. **backend** (subagent) - Develop backend code, APIs, database
2. **review** (subagent) - Code review for backend standards
3. **qa** (subagent) - Run API tests, integration tests

**Example invocation**:
```bash
/backend-workflow feature/payment-service
```

### Amplience Workflow

**Purpose**: Full-stack validation for commerce/content platforms

**Components**:
1. **amplience** (subagent) - Content management and commerce analysis
2. **frontend** (subagent) - Frontend implementation 
3. **review** (subagent) - Code review
4. **qa** (subagent) - End-to-end testing

**Example invocation**:
```bash
/amplience-workflow feature/product-catalog
```

### QA Workflow

**Purpose**: Focused quality assurance and testing

**Components**:
1. **qa** (subagent) - Comprehensive testing
2. **review** (subagent) - Test code review

**Example invocation**:
```bash
/qa-workflow release/v2.0.0
```

### Code Review Workflow

**Purpose**: Focused code review and quality checks

**Components**:
1. **review** (subagent) - Detailed code review

**Example invocation**:
```bash
/code-review-workflow feature/auth-module
```

### Performance Workflow

**Purpose**: Performance analysis and optimization

**Components**:
1. **performance** (subagent) - Performance profiling
2. **frontend** (subagent) - Frontend developer
3. **review** (subagent) - Performance best practices review

**Example invocation**:
```bash
/performance-workflow main --detailed
```

## Creating Your Own Workflow

### Step 1: Define Your Process

Identify the steps in your development process:

```
Example Frontend Workflow:
1. Get design file from Figma
2. Analyze frontend code
3. Review code quality
4. Run tests
5. Check performance
```

### Step 2: Verify & Implement Components

Before mapping components, ensure all required components exist and are tested:

**For each component you plan to use**:

1. **Check if component exists**:
   - Does the subagent already exist?
   - Does the slash command already exist?
   - Is the MCP server configured in your setup?
   - Are any other components/tools needed?

2. **If component exists**:
   - Review its documentation
   - Understand its inputs and outputs
   - Check its compatibility with your workflow

3. **If component does NOT exist**:
   - Create it using appropriate template:
     - Subagent: Use `templates/agents/agent_template.md`
     - Slash Command: Use `templates/slash_commands/slash-command-template.md`
     - MCP Server: Configure in `templates/mcp_servers/`

4. **Test each component independently**:
   - Run the component in isolation
   - Verify it produces expected output format
   - Test with sample inputs
   - Document any special requirements or configurations

5. **Document component interface**:
   ```
   Component: frontend-analyzer-subagent
   Input: [Target branch path]
   Output: [Frontend analysis report in JSON]
   Dependencies: [Any other tools needed]
   Timeout: [Expected execution time]
   ```

**Example**:
```
✓ Figma MCP server - Already configured
✓ /test slash command - Already exists
✗ frontend-analyzer subagent - MISSING
  └─ Create using agent_template.md
  └─ Test with sample frontend code
  └─ Document output format
✓ reviewer subagent - Already exists
✓ performance-profiler subagent - Already exists
```

Once all components are verified and tested, proceed to Step 3.

### Step 3: Map Components to Steps

Assign Claude Code components to each step:

```
Step 1: Get design file → Figma MCP server
Step 2: Analyze frontend → frontend-analyzer subagent
Step 3: Review code → reviewer subagent
Step 4: Run tests → /test slash command
Step 5: Check performance → performance-profiler subagent
```

### Step 4: Use the Template

Copy `workflow_template.md` and adapt it:

```bash
cp workflow_template.md my-workflow.md
```

Update the YAML frontmatter:

```yaml
---
name: my-workflow
description: Description of your workflow
type: workflow
phases: 3
components:
  - subagents
  - slash-commands
  - mcp-servers
argument-hint: [target] [--option]
---
```

### Step 5: Write Phase Instructions

For each phase, provide direct instructions to orchestrate components:

```markdown
## Phase 1: Design Analysis

Use the **figma-reader** subagent to analyze design specifications:

1. Use Figma MCP server to fetch design file
2. Read design specifications and requirements
3. Extract component definitions
4. Compile design report

Expected output: Design specifications and requirements list
```

### Step 6: Chain Components

Show how components work together:

```markdown
## Phase 2: Frontend Implementation

Use the **frontend-analyzer** subagent with design input from Phase 1:

1. Receive design specifications from Phase 1
2. Analyze actual frontend code implementation
3. Execute the /test slash command:
   /test [target] --coverage
4. Compare implementation against design
5. Generate implementation report

Expected output: Implementation analysis with test results
```

### Step 7: Register in Configuration

Add to your `plugin.json`:

```json
{
  "components": {
    "commands": ["commands/my-workflow.md"]
  },
  "workflows": {
    "my-workflow": {
      "enabled": true,
      "components": ["subagents", "slash-commands"]
    }
  }
}
```

## Complete Workflow Example: Frontend

Here's a complete frontend workflow implementation:

```markdown
---
name: frontend-workflow
description: Validates frontend features from design to performance
type: workflow
phases: 5
components:
  - subagents
  - slash-commands
  - mcp-servers
argument-hint: [feature-branch] [--option]
---

## Workflow Overview

Orchestrates frontend development validation through design review, code analysis, testing, and performance assessment.

---

## Phase 1: Design Review

Use the **design-reviewer** subagent to extract design requirements:

1. Use Figma MCP server to fetch design file for [feature-branch]
   ```
   Query: Figma file for [feature-branch]
   Extract: Components, layouts, design specifications
   ```
2. Use Read tool to examine design documentation
3. Compile design specifications report

Expected output: Design specifications and requirements

---

## Phase 2: Frontend Analysis

Use the **frontend-analyzer** subagent with design specs from Phase 1:

1. Receive design specifications from Phase 1
2. Use Glob to find all frontend components: `src/**/*.{jsx,tsx}`
3. Use Grep to analyze CSS, styling patterns
4. Check component structure against design
5. Generate frontend analysis report

Expected output: Frontend code analysis with design compliance

---

## Phase 3: Code Review

Use the **reviewer** subagent with analysis from Phase 2:

1. Receive frontend analysis from Phase 2
2. Execute the /review slash command:
   ```
   /review [feature-branch] --frontend --strict
   ```
3. Review code against frontend standards
4. Check accessibility, responsiveness
5. Generate code review report

Expected output: Code review with findings and recommendations

---

## Phase 4: Quality Assurance

Use the **qa-tester** subagent:

1. Execute the /test slash command:
   ```
   /test [feature-branch] --coverage --verbose
   ```
2. Run unit tests on components
3. Run integration tests
4. Generate test coverage report
5. Use qa-subagent to analyze results

Expected output: Test results and coverage metrics

---

## Phase 5: Performance Testing

Use the **performance-analyzer** subagent:

1. Execute the /performance-test slash command:
   ```
   /performance-test [feature-branch] --detailed
   ```
2. Measure component load times
3. Analyze bundle size impact
4. Check memory usage
5. Generate performance report

Expected output: Performance metrics and optimization suggestions

---

## Workflow Complete

Compile all phase outputs into final report with:
- Design compliance: ✓/✗
- Code quality: ✓/✗
- Test coverage: [percentage]
- Performance: ✓/✗

Send summary via Slack MCP server to notify team.
```

## Component Composition Reference

Here are predefined workflow compositions for common SDLC scenarios:

```json
{
  "workflows": {
    "frontend": {
      "components": ["figma", "frontend", "review", "qa", "performance"],
      "description": "Full frontend validation workflow"
    },
    "backend": {
      "components": ["backend", "review", "qa"],
      "description": "Backend service validation workflow"
    },
    "amplience": {
      "components": ["amplience", "frontend", "review", "qa"],
      "description": "Full-stack commerce platform workflow"
    },
    "qa": {
      "components": ["qa", "review"],
      "description": "QA and testing focused workflow"
    },
    "code_review": {
      "components": ["review"],
      "description": "Code review only workflow"
    },
    "performance": {
      "components": ["performance", "frontend", "review"],
      "description": "Performance analysis and optimization workflow"
    }
  }
}
```

## Best Practices for Workflow Design

### 1. Clear Phase Boundaries

Each phase has distinct responsibilities:
```
Phase 1: Information gathering
Phase 2: Analysis and processing
Phase 3: Validation and reporting
```

### 2. Sequential Phase Execution

Ensure output from one phase feeds into the next:
```
Phase 1 output → Phase 2 input
Phase 2 output → Phase 3 input
```

### 3. Explicit Component Instructions

Be specific about what each component should do:
```
✓ Use the frontend-analyzer subagent to examine React components
✗ Use the subagent to analyze the code
```

### 4. Error Handling

Define fallback behavior:
```
If [component] fails:
- Capture error
- Continue with available data
- Flag issue in final report
```

### 5. Progress Reporting

Keep user informed at each phase:
```
🚀 Phase 1: Design Review...
✓ Phase 1 Complete: Design specs retrieved
🔄 Phase 2: Frontend Analysis...
```

### 6. Reusable Components

Design components that work across multiple workflows:
```
- reviewer: used in frontend, backend, amplience workflows
- qa: used in frontend, backend, qa workflows
- performance: used in frontend, performance workflows
```

## Common Workflow Patterns

### Sequential Pattern
Phases run one after another, output → input flow:
```
Design → Frontend → Review → QA → Performance
```

### Parallel Pattern
Independent components run simultaneously:
```
Frontend analysis ─┐
Backend analysis  ├─ Merge results → Review
API testing       ┘
```

### Conditional Pattern
Execution depends on previous results:
```
Analysis
  ↓
If passed → QA
If failed → Error report
```

## Running Workflows

### Trigger a workflow:
```bash
/frontend-workflow feature/user-dashboard
```

### With options:
```bash
/frontend-workflow feature/user-dashboard --verbose --notify
```

### Different workflow types:
```bash
/backend-workflow feature/payment-api
/qa-workflow release/v2.0.0
/performance-workflow main --detailed
```

## Examples

The `examples/` folder contains reference implementations:

- **deepwiki.md**: Documentation generation workflow that orchestrates analysis, planning, content generation, and integration phases
- [Additional examples based on SDLC needs]

## Troubleshooting

### Workflow takes too long
- Check if components can run in parallel
- Reduce scope or target smaller portions
- Check for bottleneck components

### Phase output doesn't match expected format
- Verify component is returning correct format
- Check component documentation
- Add explicit format instructions

### Component not executing
- Verify component name and availability
- Check component configuration
- Review error logs

### Integration issues between phases
- Validate data format between phases
- Use explicit type/format specifications
- Transform data if needed between phases

## Learning Path

1. **Start with**: `workflow_template.md` - Understand basic structure
2. **Study**: `examples/deepwiki.md` - See real implementation
3. **Adapt**: Copy template and modify for your use case
4. **Test**: Run workflow in test environment
5. **Deploy**: Add to plugin configuration and share with team

## Creating Advanced Workflows

### Multi-Repository Workflows

Coordinate changes across multiple repositories:
```
Repo A analysis
Repo B analysis
Repo C analysis
└─ Integration testing
└─ Cross-repo validation
```

### Conditional Workflows

Different paths based on analysis results:
```
Code analysis
  ├─ If security issues found → security-review subagent
  ├─ If performance issues found → performance-optimization
  └─ If all passed → deployment
```

### Scheduled Workflows

Workflows triggered on schedule:
```
Daily: code-quality-check-workflow
Weekly: performance-analysis-workflow
Before release: full-validation-workflow
```

## Versioning & Maintenance

- Keep workflows focused on single responsibility
- Version workflows as they evolve
- Document dependencies between components
- Update component references when they change

## Contributing

To contribute workflows to the Pandora Marketplace:

1. Create workflow following template
2. Document all phases clearly
3. Include examples and use cases
4. Add to `examples/` folder
5. Update README with new workflow type
6. Submit for community review

## Learn More

- [Claude Code Slash Commands Documentation](https://code.claude.com/docs/en/slash-commands)
- [Claude Code Plugins Guide](https://code.claude.com/docs/en/plugins)
- [Model Context Protocol Overview](https://www.anthropic.com/news/model-context-protocol)

## Version

- **Version**: 1.0.0
- **Created**: 2025-12-15
- **Minimum Claude Code**: 1.5+
- **Supported Components**: Subagents, Slash Commands, MCP Servers, Built-in Tools
