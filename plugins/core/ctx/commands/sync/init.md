---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), Bash(rm:*), AskUserQuestion
description: Initialize team context skills globally by copying team context to ~/.claude/skills/
---

## Purpose

Initialize team context globally by selecting a team and copying their context as skills to `{home}/.claude/skills/`. Skills are auto-discovered by Claude Code across all projects, enabling on-demand context loading without manual configuration.

## Execution Flow

### Step 0: Resolve Paths

**Skills destination** (where skills will be installed):
```
{home}/.claude/skills/
```

**Manifest file** (tracks installed skills from this marketplace):
```
{home}/.claude/skills/.skills-manifest.json
```

**Marketplace path** (where team contexts are stored) - check:
```
{home}/.claude/plugins/known_marketplaces.json
```

Where `{home}` is:
- **macOS/Linux**: `~` or `$HOME`
- **Windows**: `%USERPROFILE%`

Example `known_marketplaces.json`:
```json
{
  "marketplaces": [
    "/path/to/pandora-marketplace"
  ]
}
```

**Derive marketplace name** from the marketplace path:
1. Read `{marketplace}/.claude-plugin/marketplace.json` if exists → use `name` field
2. Otherwise, use the folder name from the path

Once the marketplace path is resolved, team contexts are available at:
```
{marketplace}/plugins/pandora/online/*/team_context/
```

If no marketplace path is found, ask the user to provide it.

### Step 1: Check Existing Skills (Idempotency)

For each selected domain, check if `{home}/.claude/skills/{team}-{domain}/` already exists.

If any target directories exist, ask the user:

```json
{
  "questions": [
    {
      "question": "Some skills already exist. How should we handle them?",
      "header": "Existing",
      "multiSelect": false,
      "options": [
        {"label": "Skip existing", "description": "Only install skills that don't exist yet (safe, idempotent)"},
        {"label": "Overwrite all", "description": "Replace all selected skills with fresh copies from marketplace"},
        {"label": "Cancel", "description": "Abort without making changes"}
      ]
    }
  ]
}
```

**Behavior:**
- **Skip existing**: Check each `{team}-{domain}/` folder. If it exists, skip it entirely. Only copy new domains.
- **Overwrite all**: Remove existing `{team}-{domain}/` folders and copy fresh from marketplace.
- **Cancel**: Exit without changes.

This ensures the command is safe to run multiple times.

### Step 2: Select Team

Scan the marketplace for available teams using the resolved marketplace path:

```
{marketplace}/plugins/pandora/online/*/team_context/
```

Use Glob to find available teams dynamically. Extract team names from the paths.

Use the `AskUserQuestion` tool to let users select which team's context to use. Build options dynamically from discovered teams.

### Step 3: Select Context Domains

After team selection, scan available domains for that team:

```
{marketplace}/plugins/pandora/online/{selected-team}/team_context/*/
```

Build domain options dynamically from discovered folders. Group by category if a README.md exists with category info, otherwise present as a flat list.

### Step 4: Copy Selected Domains to Skills

For each selected domain, namespace by team name to avoid clashes:

1. Source: `{marketplace}/plugins/pandora/online/{selected-team}/team_context/{domain}/`
2. Target: `{home}/.claude/skills/{team}-{domain}/`

**Important**: When copying SKILL.md, inject metadata into the frontmatter:

1. Read the source SKILL.md
2. Parse the YAML frontmatter
3. Add these fields (derived from context, not hardcoded):
   - `source`: The marketplace name (derived in Step 0)
   - `team`: The team folder name (from path)
   - `domain`: The domain folder name (from path)
   - `installed_at`: Current ISO timestamp
4. Write the modified SKILL.md to the target

Example - if source SKILL.md has:
```yaml
---
name: inspire-architecture
description: Architecture patterns...
user-invocable: false
allowed-tools: Read
---
```

After injection, target SKILL.md becomes:
```yaml
---
name: inspire-architecture
description: Architecture patterns...
user-invocable: false
allowed-tools: Read
source: pandora-marketplace
team: inspire-team
domain: architecture
installed_at: 2024-01-21T16:30:00Z
---
```

Copy the `references/` directory as-is.

### Step 5: Update Manifest

After copying, update the manifest file at `{home}/.claude/skills/.skills-manifest.json`:

1. Read existing manifest (or create empty structure if doesn't exist)
2. Add/update entry for each installed skill
3. Write updated manifest

Manifest structure:
```json
{
  "version": "1.0",
  "skills": [
    {
      "name": "inspire-architecture",
      "source": "pandora-marketplace",
      "team": "inspire-team",
      "domain": "architecture",
      "path": "inspire-architecture",
      "installed_at": "2024-01-21T16:30:00Z"
    },
    {
      "name": "inspire-workflows",
      "source": "pandora-marketplace",
      "team": "inspire-team",
      "domain": "workflows",
      "path": "inspire-workflows",
      "installed_at": "2024-01-21T16:30:00Z"
    }
  ]
}
```

### Step 6: Verify Skills Structure

After copying, verify each domain has a `SKILL.md` file. If a domain is missing `SKILL.md`, warn the user:

```
Warning: {domain} does not have a SKILL.md file.
Claude will not auto-discover this context.
Consider adding a SKILL.md to enable auto-loading.
```

## Output Structure

```
{home}/
└── .claude/
    └── skills/
        ├── .skills-manifest.json     ← Tracks installed skills
        ├── inspire-architecture/
        │   ├── SKILL.md              ← Auto-discovered, includes source metadata
        │   └── references/
        │       ├── system-architecture.md
        │       └── design-patterns.md
        ├── inspire-coding_guidelines/
        │   ├── SKILL.md
        │   └── references/
        │       ├── best_practices.md
        │       └── style_guide.md
        └── inspire-workflows/
            ├── SKILL.md
            └── references/
                ├── development_workflow.md
                └── pr-process.md
```

## Progress Reporting

```
Context Skills Initialization
=============================

Marketplace: pandora-marketplace
Team: inspire-team
Skills Location: {home}/.claude/skills/

Selected Domains: 4
  - architecture
  - coding_guidelines
  - workflows
  - tech_stack

[1/4] Installing architecture → inspire-architecture/
      - SKILL.md (injected: source, team, domain)
      - references/system-architecture.md
      - references/design-patterns.md
      ✓ Complete

[2/4] Installing coding_guidelines → inspire-coding_guidelines/
      ⊘ Skipped (already exists)

[3/4] Installing workflows → inspire-workflows/
      - SKILL.md (injected: source, team, domain)
      - references/development_workflow.md
      - references/pr-process.md
      ✓ Complete

[4/4] Installing tech_stack → inspire-tech_stack/
      ✓ Complete

Updating manifest...
✓ Manifest updated: 3 skills added

=============================
Initialization Complete

Skills installed: 3
Skills skipped: 1 (already existed)

Location: {home}/.claude/skills/
Manifest: {home}/.claude/skills/.skills-manifest.json

How it works:
- Skills are available globally across all projects
- Claude sees skill descriptions at session start
- Full context loads automatically when relevant
- Manifest tracks skills for updates and cleanup
```

## Usage

```bash
/sync:init
```

## How Skills Work

After initialization:

1. **Session Start**: Claude discovers all `SKILL.md` files in `~/.claude/skills/`
2. **Description Loading**: Only skill descriptions are loaded initially (~small token footprint)
3. **Auto-Invocation**: When a task matches a skill's description, Claude loads the full content
4. **Context Files**: The skill instructs Claude to read files in `./references/`

This enables **on-demand context loading** - Claude only loads what's relevant to the current task.

## Benefits of Global Skills

- **No project pollution**: Skills live in your home directory
- **Shared across projects**: Same team context available everywhere
- **Single update point**: Update once, applies to all projects
- **Clean separation**: Team context separate from project code
- **Team namespacing**: `{team}-{domain}` naming prevents clashes between teams
- **Manifest tracking**: Know exactly which skills came from which marketplace
