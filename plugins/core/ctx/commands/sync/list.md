---
allowed-tools: Glob(**/*), Read(**/*), AskUserQuestion
description: List available teams, domains, and installed skills
---

## Purpose

Display available teams and context domains from the marketplace, and show which skills are installed (using the manifest).

## Execution Flow

### Step 0: Resolve Paths

**Installed skills location**:
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

If no marketplace path is found, ask the user to provide it.

### Step 1: Read Manifest

Read `{home}/.claude/skills/.skills-manifest.json` to get list of installed skills.

If manifest doesn't exist, treat as empty (no skills installed from this marketplace).

**Important**: Only show skills from the current marketplace's manifest. Other skills in `~/.claude/skills/` from different sources should be ignored.

### Step 2: Validate Manifest

For each skill in the manifest, verify the directory still exists:
```
{home}/.claude/skills/{skill.path}/
```

If a directory is missing, mark it as "orphaned" in the output (skill was manually deleted).

### Step 3: Scan Marketplace for Teams

Find all teams by scanning:
```
{marketplace}/plugins/pandora/online/*/team_context/
```

Extract team names from the path.

### Step 4: Scan Domains for Each Team

For each team, list domains by scanning:
```
{marketplace}/plugins/pandora/online/{team}/team_context/*/
```

For each domain, check:
- Has `SKILL.md` (skill-enabled)
- Has `references/` subdirectory
- Number of reference files

### Step 5: Match Installed Skills

For each domain, check if it's in the manifest (matching by `source`, `team`, and `domain`).

### Step 6: Display Results

## Output Format

```
Available Context Skills
========================

Marketplace: pandora-marketplace
Location: /path/to/pandora-marketplace
Skills: {home}/.claude/skills/

Teams Found: 3
─────────────────────────────────────────────────────────────────

INSPIRE-TEAM (12 domains)
─────────────────────────────────────────────────────────────────
  Domain                     Refs  Skill     Installed
  architecture               2     ✓         ✓ inspire-architecture
  business_domain            3     ✓         ✗
  coding_guidelines          5     ✓         ✗
  development-env            3     ✓         ✗
  integration                3     ✓         ✗
  monitoring-observability   3     ✓         ✗
  qa-standards               1     ✓         ✗
  references                 2     ✓         ✗
  repositories               2     ✓         ✗
  security-compliance        2     ✓         ✗
  tech_stack                 3     ✓         ✗
  workflows                  7     ✓         ✗

DECIDE-TEAM (0 domains)
─────────────────────────────────────────────────────────────────
  No domains configured yet.

FIND-TEAM (0 domains)
─────────────────────────────────────────────────────────────────
  No domains configured yet.

─────────────────────────────────────────────────────────────────
Summary
─────────────────────────────────────────────────────────────────
Available: 12 domains across 3 teams
Installed: 1 skill (from this marketplace)

Commands:
  /sync:init     Install skills from a team
  /sync:update   Update installed skills to latest
  /sync:delete   Remove installed skills
```

### Orphaned Skills Warning

If any skills in the manifest no longer exist on disk, show a warning:

```
⚠ Orphaned entries in manifest (directories missing):
  - inspire-old-skill (installed 2024-01-15)

Run /sync:delete to clean up the manifest.
```

## Legend

| Column | Description |
|--------|-------------|
| Domain | Context domain name |
| Refs | Number of reference files in `references/` |
| Skill | ✓ if SKILL.md exists (auto-discoverable) |
| Installed | ✓ with skill name if in manifest, ✗ if not |

## Usage

```bash
/sync:list
```

## Notes

- Only shows skills from this marketplace (identified by `source` in manifest)
- Skills installed from other marketplaces or manually created are not shown
- Use `/sync:init` to install new skills
- Use `/sync:delete` to remove installed skills and clean up manifest
