---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(rm:*), AskUserQuestion
description: Remove installed skills and update the manifest
---

## Purpose

Remove installed skills from `{home}/.claude/skills/` and update the manifest. Only shows skills installed from this marketplace (tracked in the manifest).

## Execution Flow

### Step 0: Resolve Paths

**Skills location**:
```
{home}/.claude/skills/
```

**Manifest file**:
```
{home}/.claude/skills/.skills-manifest.json
```

Where `{home}` is:
- **macOS/Linux**: `~` or `$HOME`
- **Windows**: `%USERPROFILE%`

### Step 1: Read Manifest

Read `{home}/.claude/skills/.skills-manifest.json` to get list of installed skills.

If manifest doesn't exist or is empty:
```
No skills installed from this marketplace.
Use /sync:init to install skills.
```

### Step 2: Validate Installed Skills

For each skill in the manifest, check if the directory exists:
```
{home}/.claude/skills/{skill.path}/
```

Categorize skills as:
- **Installed**: Directory exists
- **Orphaned**: In manifest but directory missing (was manually deleted)

### Step 3: Select Skills to Delete

Use `AskUserQuestion` with `multiSelect: true` to let user select skills to remove:

```json
{
  "questions": [
    {
      "question": "Select skills to DELETE (this cannot be undone):",
      "header": "Delete",
      "multiSelect": true,
      "options": [
        {"label": "inspire-architecture", "description": "Team: inspire-team, Domain: architecture"},
        {"label": "inspire-workflows", "description": "Team: inspire-team, Domain: workflows"},
        {"label": "inspire-old-skill ⚠", "description": "ORPHANED - directory missing, will clean manifest"}
      ]
    }
  ]
}
```

Note:
- Options are built dynamically from the manifest
- Orphaned entries are marked with ⚠ and can be selected to clean up manifest

### Step 4: Confirm Deletion

**IMPORTANT**: Always confirm before deleting:

```json
{
  "questions": [
    {
      "question": "Are you sure you want to delete these skills? This cannot be undone.",
      "header": "Confirm",
      "multiSelect": false,
      "options": [
        {"label": "Yes, delete", "description": "Permanently remove selected skills"},
        {"label": "No, cancel", "description": "Keep all skills"}
      ]
    }
  ]
}
```

If user selects "No, cancel", abort and report cancellation.

### Step 5: Delete Skills

For each selected skill:

1. **If directory exists**: Remove the entire skill directory
   ```bash
   rm -rf {home}/.claude/skills/{skill.path}
   ```

2. **Remove from manifest**: Delete the entry from the skills array

### Step 6: Update Manifest

Write the updated manifest back to disk:

```json
{
  "version": "1.0",
  "skills": [
    // remaining skills after deletion
  ]
}
```

If all skills are deleted, the manifest will have an empty `skills` array.

## Output

```
Delete Installed Skills
=======================

Reading manifest...
Found 5 skills from pandora-marketplace

Installed Skills:
  ✓ inspire-architecture (inspire-team/architecture)
  ✓ inspire-coding_guidelines (inspire-team/coding_guidelines)
  ✓ inspire-workflows (inspire-team/workflows)
  ✓ inspire-tech_stack (inspire-team/tech_stack)
  ⚠ inspire-old-skill (ORPHANED - directory missing)

Select skills to delete: inspire-architecture, inspire-old-skill

─────────────────────────────────────────────────────────────────
Selected for deletion:
  - inspire-architecture (2 reference files)
  - inspire-old-skill (orphaned entry)

⚠  This action cannot be undone.
─────────────────────────────────────────────────────────────────

Confirm deletion? Yes

Deleting skills:
  ✓ inspire-architecture - directory removed
  ✓ inspire-old-skill - manifest entry cleaned

Updating manifest...
  ✓ Manifest updated (2 entries removed, 3 remaining)

=======================
Deletion Complete

Skills removed: 1
Orphaned entries cleaned: 1
Remaining skills: 3

To reinstall, use /sync:init
```

## Usage

```bash
/sync:delete
```

## Safety

- Only shows skills from this marketplace (identified by manifest)
- Skills from other marketplaces or manually created are NOT affected
- Always requires confirmation before deletion
- Deleted skills can be reinstalled using `/sync:init`
- Orphaned manifest entries can be cleaned up by selecting them

## Notes

- Use `/sync:list` to see all available and installed skills
- Use `/sync:init` to reinstall deleted skills
- The manifest tracks which marketplace each skill came from
- Skills are namespaced by team (e.g., `inspire-architecture`) to avoid conflicts
