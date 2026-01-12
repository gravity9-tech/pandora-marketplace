---
allowed-tools: Glob(**/*), Read(**/*), Bash(rm:.claude/context/*), Write(**/*), AskUserQuestion
argument-hint: <domain> [target-project-path]
description: Remove a context domain from the project's local .claude/context/ directory
---

## Purpose

Remove a context domain from the project's `.claude/context/` directory. This only affects the local project - it does NOT touch the marketplace templates.

## Parameters

- `$1` (domain): The context domain to remove (e.g., `architecture`, `workflows`)
- `$2` (target-project-path): Path to the target project. Defaults to current directory if not specified.

## Execution Flow

### Step 1: Validate Domain or Prompt for Selection

If `$1` (domain) is provided:
1. Check if the domain exists in `.claude/context/`
2. If not found, display installed domains and exit

If `$1` (domain) is NOT provided:
1. List all installed domains in `.claude/context/`
2. Use `AskUserQuestion` with `multiSelect: true` to let user select domains to remove:

```json
{
  "questions": [
    {
      "question": "Select context domains to DELETE (this cannot be undone):",
      "header": "Delete",
      "multiSelect": true,
      "options": [
        {"label": "{domain1}", "description": "{n} files"},
        {"label": "{domain2}", "description": "{n} files"}
      ]
    }
  ]
}
```

Note: Options should be dynamically built from installed domains.

### Step 2: Confirm Deletion

**IMPORTANT**: Always confirm before deleting:

```json
{
  "questions": [
    {
      "question": "Are you sure you want to delete these domains? This cannot be undone.",
      "header": "Confirm",
      "multiSelect": false,
      "options": [
        {"label": "Yes, delete", "description": "Permanently remove selected domains"},
        {"label": "No, cancel", "description": "Keep all domains"}
      ]
    }
  ]
}
```

If user selects "No, cancel", abort and report cancellation.

### Step 3: Delete Domain(s)

For each selected domain:
1. Remove the directory `.claude/context/{domain}/` and all its contents
2. Report each domain deleted

### Step 4: Update INDEX.md

1. Read `.claude/context/INDEX.md`
2. Remove entries for deleted domains from:
   - The "Available Domains" table
   - The "Domain Details" section
3. Write updated INDEX.md

## Output

```
Deleting Context Domains
========================

Selected for deletion:
  - architecture (2 files)
  - workflows (7 files)

⚠️  This action cannot be undone.

Confirm deletion? Yes

Deleting domains:
  ✓ architecture removed
  ✓ workflows removed

Updating INDEX.md...
  ✓ INDEX.md updated

========================
2 domains deleted successfully
```

## Usage

```bash
# Delete a specific domain
/context-manager:delete architecture

# Delete from specific project
/context-manager:delete workflows /path/to/my-project

# Interactive selection (no domain specified)
/context-manager:delete
```

## Safety

- This command only affects LOCAL project files in `.claude/context/`
- Marketplace templates in `team_context/` are NEVER modified
- Always requires confirmation before deletion
- Deleted domains can be restored using `/context-manager:pull`

## Notes

- Use `/context-manager:list` to see available domains in the marketplace
- Use `/context-manager:pull` to restore deleted domains
- If you delete all domains, INDEX.md will be updated to show no domains available
