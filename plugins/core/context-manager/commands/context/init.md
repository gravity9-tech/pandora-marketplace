---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), AskUserQuestion
argument-hint: [target-project-path]
description: Initialize team context in a project by copying selected context domains to .claude/context/
---

## Purpose

Initialize team context in a target project by interactively selecting which context domains to include. This command copies context templates from the marketplace to the project's `.claude/context/` directory and generates an INDEX.md for on-demand loading.

## Parameters

- `$1` (target-project-path): Path to the target project where context will be initialized. Defaults to current directory if not specified.

## Execution Flow

### Step 1: Validate Target Project

1. Verify the target path exists and is a directory
2. Check if `.claude/` directory exists (create if not)
3. Check if `.claude/context/` already exists
   - If exists: Ask user whether to merge or overwrite

### Step 2: Present Available Context Domains

Display the available context domains from the marketplace's `team_context/` directory:

```
Available Context Domains
=========================

Select the domains you want to include in your project:

[ ] architecture       - System design, patterns, component relationships
[ ] business_domain    - Domain knowledge, glossary, user stories
[ ] coding_guidelines  - Best practices, style guides, code review standards
[ ] development-env    - Setup guides, troubleshooting, prerequisites
[ ] integration        - API standards, integration patterns, third-party services
[ ] monitoring-observability - Logging, alerting, monitoring setup
[ ] qa-standards       - Testing guidelines and quality standards
[ ] references         - Quick references and useful links
[ ] repositories       - Repository standards and inventory
[ ] security-compliance - Security guidelines, secrets management
[ ] tech_stack         - Framework, library, and tooling documentation
[ ] workflows          - Development, deployment, QA, and PR processes

Options:
  [A] Select all domains
  [E] Select essential only (architecture, coding_guidelines, workflows)
  [C] Custom selection
```

Use AskUserQuestion to let the user choose:
- Which domains to include
- Whether to include all, essential, or custom selection

### Step 3: Copy Selected Domains

For each selected domain:

1. Create the domain directory in `.claude/context/{domain}/`
2. Copy all `.md` files from `team_context/{domain}/` to `.claude/context/{domain}/`
3. Report progress for each domain

### Step 4: Generate INDEX.md

Create `.claude/context/INDEX.md` with:

1. A header explaining the purpose
2. A table of included domains with:
   - Domain name
   - Description
   - When to read
   - File paths
3. Usage instructions for Claude

Use the template from `plugins/core/context-manager/templates/INDEX.md` as the base.

### Step 5: Update CLAUDE.md (Optional)

Ask user if they want to update their CLAUDE.md to reference the context:

```
Would you like to update CLAUDE.md to reference the context index?

This will add the following to your CLAUDE.md:

## Team Context

For team-specific knowledge, consult the context index at .claude/context/INDEX.md
and read relevant files as needed using the Read tool.
```

If yes and CLAUDE.md exists: Append the context reference
If yes and CLAUDE.md doesn't exist: Create it with the context reference

## Output Structure

```
{target-project}/
├── .claude/
│   └── context/
│       ├── INDEX.md                    # Generated index
│       ├── architecture/               # Selected domains...
│       │   ├── design-patterns.md
│       │   └── system-architecture.md
│       ├── coding_guidelines/
│       │   ├── best_practices.md
│       │   └── ...
│       └── workflows/
│           ├── development_workflow.md
│           └── ...
└── CLAUDE.md                           # Updated (if opted in)
```

## Progress Reporting

```
Context Initialization
======================

Target Project: {target-project-path}
Context Location: .claude/context/

Selected Domains: 5
  - architecture
  - coding_guidelines
  - workflows
  - security-compliance
  - tech_stack

[1/5] Copying architecture...
      - design-patterns.md
      - system-architecture.md
      ✓ Complete

[2/5] Copying coding_guidelines...
      - best_practices.md
      - code-review-checklist.md
      - code_review_guidelines.md
      - detected-technologies.md
      - style_guide.md
      ✓ Complete

...

[5/5] Copying tech_stack...
      ✓ Complete

Generating INDEX.md...
✓ INDEX.md created

Updating CLAUDE.md...
✓ CLAUDE.md updated

======================
Context Initialization Complete

Files created: 15
Location: .claude/context/

Next steps:
1. Customize the context files with your team's specific information
2. Remove any domains you don't need
3. Run /context-eng:all to auto-generate context from your codebase
```

## Usage

```bash
# Initialize in current directory
/context:init

# Initialize in specific project
/context:init /path/to/my-project

# Initialize with all domains
/context:init . --all
```

## Notes

- Context files are templates that should be customized for your team
- Use `/context-eng:all` after initialization to auto-generate context from your codebase
- The INDEX.md enables on-demand loading to reduce token usage
- Only domains you select will be copied; you can add more later with `/context:pull`
