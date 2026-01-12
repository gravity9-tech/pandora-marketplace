---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*)
argument-hint: <domain> [target-project-path]
description: Pull a specific context domain from the marketplace into a project
---

## Purpose

Pull a specific context domain from the marketplace's `team_context/` directory into a project's `.claude/context/` directory. This command is useful for adding domains after initial setup or updating existing domains.

## Parameters

- `$1` (domain): The context domain to pull (e.g., `architecture`, `workflows`, `security-compliance`)
- `$2` (target-project-path): Path to the target project. Defaults to current directory if not specified.

## Execution Flow

### Step 1: Validate Domain

1. Check if the requested domain exists in `team_context/`
2. If not found, display available domains and exit

### Step 2: Validate Target

1. Verify the target path exists
2. Check if `.claude/context/` exists
   - If not: Ask user if they want to run `/context:init` first, or create just this domain
3. Check if `.claude/context/{domain}/` already exists
   - If exists: Ask user whether to merge or overwrite

### Step 3: Copy Domain

1. Create `.claude/context/{domain}/` if it doesn't exist
2. Copy all `.md` files from `team_context/{domain}/`
3. Report each file copied

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
