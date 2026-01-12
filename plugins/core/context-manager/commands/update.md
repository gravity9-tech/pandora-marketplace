---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), AskUserQuestion
argument-hint: [domain] [target-project-path]
description: Update installed context domains from the marketplace with latest templates
---

## Purpose

Update installed context domains by pulling fresh copies from the marketplace. This refreshes local context files with the latest templates while preserving any domains not being updated.

## Parameters

- `$1` (domain): Optional. Specific domain to update. If not provided, offers to update all installed domains.
- `$2` (target-project-path): Path to the target project. Defaults to current directory if not specified.

## Execution Flow

### Step 1: Identify Installed Domains

1. List all domains in `.claude/context/` (excluding INDEX.md)
2. If no domains installed, report and exit

### Step 2: Select Domains to Update

If `$1` (domain) is provided:
1. Verify it exists in `.claude/context/`
2. If not found, display installed domains and exit

If `$1` (domain) is NOT provided:
Use `AskUserQuestion` with `multiSelect: true`:

```json
{
  "questions": [
    {
      "question": "Select context domains to UPDATE from marketplace:",
      "header": "Update",
      "multiSelect": true,
      "options": [
        {"label": "{domain1}", "description": "Currently {n} files, marketplace has {m} files"},
        {"label": "{domain2}", "description": "Currently {n} files, marketplace has {m} files"}
      ]
    }
  ]
}
```

Note: Options should be dynamically built from installed domains, comparing with marketplace.

### Step 3: Warn About Overwrite

**IMPORTANT**: Warn user that local changes will be lost:

```json
{
  "questions": [
    {
      "question": "Updating will OVERWRITE local changes. Continue?",
      "header": "Confirm",
      "multiSelect": false,
      "options": [
        {"label": "Yes, update", "description": "Replace local files with marketplace templates"},
        {"label": "No, cancel", "description": "Keep local files unchanged"}
      ]
    }
  ]
}
```

If user selects "No, cancel", abort and report cancellation.

### Step 4: Update Domains

For each selected domain, follow the shared copy logic in `templates/copy-domain.md` with overwrite mode enabled.

### Step 5: Update INDEX.md

1. Regenerate INDEX.md entries for updated domains
2. Preserve entries for domains that weren't updated

## Output

```
Updating Context Domains
========================

Installed domains: 5
Selected for update: 3
  - architecture
  - coding_guidelines
  - workflows

⚠️  Local changes will be overwritten.

Confirm update? Yes

Updating domains:
  [1/3] architecture
        - design-patterns.md
        - system-architecture.md
        ✓ Complete (2 files)

  [2/3] coding_guidelines
        - best_practices.md
        - code-review-checklist.md
        - code_review_guidelines.md
        - detected-technologies.md
        - style_guide.md
        ✓ Complete (5 files)

  [3/3] workflows
        - amplience-workflow.md
        - deployment_pipelines.md
        - development_workflow.md
        - fronend_workflow.md
        - pr-process.md
        - qa_workflow.md
        - testing-generation-workflow.md
        ✓ Complete (7 files)

Updating INDEX.md...
✓ INDEX.md updated

========================
3 domains updated successfully (14 files)
```

## Usage

```bash
# Update all installed domains (interactive)
/context-manager:update

# Update a specific domain
/context-manager:update architecture

# Update in specific project
/context-manager:update workflows /path/to/my-project
```

## Safety

- This command only affects LOCAL project files in `.claude/context/`
- Marketplace templates in `team_context/` are NEVER modified
- Always warns before overwriting local changes
- Only updates domains that are already installed

## Notes

- To add NEW domains, use `/context-manager:pull` instead
- To see what's available vs installed, use `/context-manager:list`
- Local customizations will be lost - consider backing up first if you have important changes
