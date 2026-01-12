---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), AskUserQuestion
argument-hint: <domain> [target-project-path]
description: Pull a specific context domain from the marketplace into a project
---

## Purpose

Pull a specific context domain from the marketplace's `team_context/` directory into a project's `.claude/context/` directory. This command is useful for adding domains after initial setup or updating existing domains.

## Parameters

- `$1` (domain): The context domain to pull (e.g., `architecture`, `workflows`, `security-compliance`)
- `$2` (target-project-path): Path to the target project. Defaults to current directory if not specified.

## Execution Flow

### Step 1: Validate Domain or Prompt for Selection

If `$1` (domain) is provided:
1. Check if the requested domain exists in `team_context/`
2. If not found, display available domains and exit

If `$1` (domain) is NOT provided:
Use `AskUserQuestion` with `multiSelect: true` to let the user select domains. Ask all 3 questions in a SINGLE call so users can see and select from all categories at once:

```json
{
  "questions": [
    {
      "question": "Select CORE context domains to pull:",
      "header": "Core",
      "multiSelect": true,
      "options": [
        {"label": "architecture", "description": "System design, patterns, components (2 files)"},
        {"label": "coding_guidelines", "description": "Best practices, style guides, reviews (5 files)"},
        {"label": "tech_stack", "description": "Frameworks, libraries, tooling (3 files)"},
        {"label": "workflows", "description": "Dev, deploy, QA, PR processes (7 files)"}
      ]
    },
    {
      "question": "Select PROCESS context domains to pull:",
      "header": "Process",
      "multiSelect": true,
      "options": [
        {"label": "development-env", "description": "Setup guides, troubleshooting (3 files)"},
        {"label": "qa-standards", "description": "Testing guidelines (1 file)"},
        {"label": "security-compliance", "description": "Security guidelines, secrets (2 files)"},
        {"label": "monitoring-observability", "description": "Logging, alerting, monitoring (3 files)"}
      ]
    },
    {
      "question": "Select REFERENCE context domains to pull:",
      "header": "Reference",
      "multiSelect": true,
      "options": [
        {"label": "business_domain", "description": "Domain knowledge, glossary, user stories (3 files)"},
        {"label": "integration", "description": "API standards, third-party services (3 files)"},
        {"label": "references", "description": "Quick references, useful links (2 files)"},
        {"label": "repositories", "description": "Repository standards, inventory (2 files)"}
      ]
    }
  ]
}
```

Collect all selected domains from all three questions, then proceed to pull each one

### Step 2: Validate Target

1. Verify the target path exists
2. Check if `.claude/context/` exists
   - If not: Ask user if they want to run `/context-manager:init` first, or create just this domain

### Step 3: Copy Domain

For each selected domain, follow the shared copy logic in `templates/copy-domain.md`.

### Step 4: Update INDEX.md

1. Check if `.claude/context/INDEX.md` exists
2. If exists: Add the new domain entry to the index table
3. If not exists: Generate a minimal index with just this domain

## Output

```
Pulling Context Domain
======================

Domain: workflows
Source: team_context/workflows/
Target: .claude/context/workflows/

Copying files:
  - amplience-workflow.md
  - deployment_pipelines.md
  - development_workflow.md
  - fronend_workflow.md
  - pr-process.md
  - qa_workflow.md
  - testing-generation-workflow.md

✓ 7 files copied

Updating INDEX.md...
✓ INDEX.md updated

======================
Domain 'workflows' pulled successfully
```

## Usage

```bash
# Pull a domain to current project
/context:pull architecture

# Pull a domain to specific project
/context:pull security-compliance /path/to/my-project

# Pull multiple domains (run multiple times)
/context:pull architecture
/context:pull workflows
/context:pull coding_guidelines
```

## Available Domains

Run `/context:list` to see all available domains.

## Notes

- This command pulls from the marketplace's `team_context/` templates
- Pulled files are templates that should be customized for your team
- Use `/context-eng:*` commands to auto-generate context from your codebase
- Pulling a domain that already exists will prompt for merge/overwrite
