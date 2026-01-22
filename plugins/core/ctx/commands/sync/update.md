---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), Bash(rm:*), AskUserQuestion
description: Update installed skills with latest versions from the marketplace
---

## Purpose

Update installed skills by pulling fresh copies from the marketplace. This refreshes skill files with the latest content while preserving installation tracking via the manifest.

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

**Marketplace path** - check:
```
{home}/.claude/plugins/known_marketplaces.json
```

Where `{home}` is:
- **macOS/Linux**: `~` or `$HOME`
- **Windows**: `%USERPROFILE%`

**Derive marketplace name** from the marketplace path:
1. Read `{marketplace}/.claude-plugin/marketplace.json` if exists → use `name` field
2. Otherwise, use the folder name from the path

### Step 1: Read Manifest

Read `{home}/.claude/skills/.skills-manifest.json` to get list of installed skills.

If manifest doesn't exist or is empty:
```
No skills installed from this marketplace.
Use /sync:init to install skills.
```

Filter to only skills matching the current marketplace (by `source` field).

### Step 2: Validate Skills

For each skill in the manifest, check:

1. **Directory exists**: `{home}/.claude/skills/{skill.path}/`
2. **Source exists**: `{marketplace}/plugins/pandora/online/{skill.team}/team_context/{skill.domain}/`

Categorize skills as:
- **Updatable**: Both directory and source exist
- **Orphaned**: Directory missing (was manually deleted)
- **Source missing**: Source no longer in marketplace (domain was removed)

### Step 3: Select Skills to Update

Use `AskUserQuestion` with `multiSelect: true`:

```json
{
  "questions": [
    {
      "question": "Select skills to UPDATE from marketplace:",
      "header": "Update",
      "multiSelect": true,
      "options": [
        {"label": "inspire-architecture", "description": "Team: inspire-team, installed: 2024-01-15"},
        {"label": "inspire-workflows", "description": "Team: inspire-team, installed: 2024-01-15"},
        {"label": "inspire-old-domain ⚠", "description": "SOURCE MISSING - cannot update"}
      ]
    }
  ]
}
```

Note:
- Options are built dynamically from the manifest
- Skills with missing sources are marked with ⚠ and disabled/skipped

### Step 4: Confirm Update

**IMPORTANT**: Warn user that local changes will be lost:

```json
{
  "questions": [
    {
      "question": "Updating will OVERWRITE local changes. Continue?",
      "header": "Confirm",
      "multiSelect": false,
      "options": [
        {"label": "Yes, update", "description": "Replace local files with latest from marketplace"},
        {"label": "No, cancel", "description": "Keep local files unchanged"}
      ]
    }
  ]
}
```

If user selects "No, cancel", abort and report cancellation.

### Step 5: Update Each Skill

For each selected skill:

1. **Remove existing directory**:
   ```bash
   rm -rf {home}/.claude/skills/{skill.path}
   ```

2. **Create fresh directory**:
   ```bash
   mkdir -p {home}/.claude/skills/{skill.path}
   ```

3. **Copy SKILL.md with injected metadata**:
   - Read source SKILL.md from marketplace
   - Inject/update metadata fields:
     - `source`: Marketplace name
     - `team`: Team folder name
     - `domain`: Domain folder name
     - `installed_at`: Original install timestamp (preserve from manifest)
     - `updated_at`: Current ISO timestamp
   - Write to target

4. **Copy references directory**:
   ```bash
   cp -r {source}/references/* {target}/references/
   ```

### Step 6: Update Manifest

For each updated skill, update the manifest entry:

```json
{
  "name": "inspire-architecture",
  "source": "pandora-marketplace",
  "team": "inspire-team",
  "domain": "architecture",
  "path": "inspire-architecture",
  "installed_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-21T16:30:00Z"
}
```

Write updated manifest to disk.

## Output

```
Update Installed Skills
=======================

Marketplace: pandora-marketplace
Reading manifest...

Found 4 skills from this marketplace:
  ✓ inspire-architecture (updatable)
  ✓ inspire-coding_guidelines (updatable)
  ✓ inspire-workflows (updatable)
  ⚠ inspire-old-domain (source missing - skipped)

Select skills to update: inspire-architecture, inspire-workflows

─────────────────────────────────────────────────────────────────
Selected for update: 2 skills

⚠  Local changes will be overwritten.
─────────────────────────────────────────────────────────────────

Confirm update? Yes

[1/2] Updating inspire-architecture...
      - SKILL.md refreshed (metadata updated)
      - references/system-architecture.md
      - references/design-patterns.md
      ✓ Complete

[2/2] Updating inspire-workflows...
      - SKILL.md refreshed (metadata updated)
      - references/development_workflow.md
      - references/pr-process.md
      - references/deployment_pipelines.md
      - references/qa_workflow.md
      - references/fronend_workflow.md
      - references/amplience-workflow.md
      - references/testing-generation-workflow.md
      ✓ Complete

Updating manifest...
  ✓ Manifest updated (2 skills refreshed)

=======================
Update Complete

Updated: 2 skills
Skipped: 1 (source missing)
Unchanged: 1

All selected skills are now at the latest version.
```

## Usage

```bash
/sync:update
```

## Safety

- Only updates skills from this marketplace (identified by manifest)
- Skills from other marketplaces are NOT affected
- Always warns before overwriting
- Preserves original `installed_at` timestamp
- Skills with missing sources are automatically skipped

## Notes

- To add NEW skills, use `/sync:init` instead
- To see what's available vs installed, use `/sync:list`
- To remove skills, use `/sync:delete`
- Local customizations will be lost - the update pulls fresh copies from marketplace
- The `updated_at` timestamp in manifest and SKILL.md tracks when last refreshed
