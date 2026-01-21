---
allowed-tools: Glob(**/*), Read(**/*), Write(**/*), Bash(mkdir:*), Bash(rm:*), AskUserQuestion
argument-hint: <team> [domains...] [--all]
description: Pull specific skills directly without the full interactive flow
---

## Purpose

Pull specific skills from a team directly, without going through the full `/sync:init` interactive flow. Useful when you know exactly what you want to add, for scripting, or for adding individual skills after initial setup.

## Parameters

- `$1` (team): The team to pull from (e.g., `inspire-team`)
- `$2+` (domains): Comma-separated or space-separated domain names (e.g., `architecture,workflows` or `architecture workflows`)
- `--all`: Pull all available domains from the team

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

### Step 1: Parse Arguments

**If team is NOT provided:**
List available teams and prompt:

```json
{
  "questions": [
    {
      "question": "Which team do you want to pull from?",
      "header": "Team",
      "multiSelect": false,
      "options": [
        {"label": "inspire-team", "description": "12 domains available"},
        {"label": "decide-team", "description": "0 domains available"},
        {"label": "find-team", "description": "0 domains available"}
      ]
    }
  ]
}
```

**If domains are NOT provided (and no --all flag):**
List available domains for the selected team and prompt:

```json
{
  "questions": [
    {
      "question": "Select domains to pull from {team}:",
      "header": "Domains",
      "multiSelect": true,
      "options": [
        {"label": "architecture", "description": "2 refs, not installed"},
        {"label": "coding_guidelines", "description": "5 refs, not installed"},
        {"label": "workflows", "description": "7 refs, ✓ already installed"}
      ]
    }
  ]
}
```

### Step 2: Validate Domains

For each requested domain:
1. Check if source exists: `{marketplace}/plugins/pandora/online/{team}/team_context/{domain}/`
2. If domain doesn't exist, report error and skip

### Step 3: Check for Existing Skills

For each valid domain, check if already installed:
```
{home}/.claude/skills/{team}-{domain}/
```

If any exist, ask:

```json
{
  "questions": [
    {
      "question": "Some skills already exist. How should we handle them?",
      "header": "Existing",
      "multiSelect": false,
      "options": [
        {"label": "Skip existing", "description": "Only pull skills that don't exist yet"},
        {"label": "Overwrite", "description": "Replace existing skills with fresh copies"},
        {"label": "Cancel", "description": "Abort without changes"}
      ]
    }
  ]
}
```

### Step 4: Pull Each Skill

For each domain to pull:

1. **Create directory**:
   ```bash
   mkdir -p {home}/.claude/skills/{team}-{domain}
   ```

2. **Copy SKILL.md with injected metadata**:
   - Read source SKILL.md
   - Inject metadata:
     - `source`: Marketplace name
     - `team`: Team name
     - `domain`: Domain name
     - `installed_at`: Current ISO timestamp
   - Write to target

3. **Copy references**:
   ```bash
   mkdir -p {home}/.claude/skills/{team}-{domain}/references
   cp -r {source}/references/* {target}/references/
   ```

### Step 5: Update Manifest

Add entries for each pulled skill:

```json
{
  "name": "inspire-architecture",
  "source": "pandora-marketplace",
  "team": "inspire-team",
  "domain": "architecture",
  "path": "inspire-architecture",
  "installed_at": "2024-01-21T16:30:00Z"
}
```

Write updated manifest.

## Output

### Direct command with arguments:

```
/sync:pull inspire-team architecture,workflows

Pulling Skills
==============

Marketplace: pandora-marketplace
Team: inspire-team
Domains: architecture, workflows

[1/2] Pulling architecture → inspire-architecture/
      - SKILL.md (metadata injected)
      - references/system-architecture.md
      - references/design-patterns.md
      ✓ Complete

[2/2] Pulling workflows → inspire-workflows/
      - SKILL.md (metadata injected)
      - references/development_workflow.md
      - references/pr-process.md
      - references/deployment_pipelines.md
      + 4 more files
      ✓ Complete

Manifest updated: 2 skills added

==============
Pull Complete

Pulled: 2 skills
Location: {home}/.claude/skills/
```

### Pull all domains:

```
/sync:pull inspire-team --all

Pulling Skills
==============

Marketplace: pandora-marketplace
Team: inspire-team
Domains: all (12 found)

[1/12] Pulling architecture → inspire-architecture/
       ✓ Complete

[2/12] Pulling business_domain → inspire-business_domain/
       ✓ Complete

...

[12/12] Pulling workflows → inspire-workflows/
        ✓ Complete

Manifest updated: 12 skills added

==============
Pull Complete

Pulled: 12 skills
Location: {home}/.claude/skills/
```

### Interactive (no arguments):

```
/sync:pull

Select team: inspire-team
Select domains: architecture, workflows

Pulling Skills
==============
...
```

## Usage

```bash
# Pull specific domains from a team
/sync:pull inspire-team architecture
/sync:pull inspire-team architecture,workflows,coding_guidelines
/sync:pull inspire-team architecture workflows coding_guidelines

# Pull all domains from a team
/sync:pull inspire-team --all

# Interactive mode (no arguments)
/sync:pull
```

## Difference from /sync:init

| Command | Use Case |
|---------|----------|
| `/sync:init` | First-time setup, guided interactive flow |
| `/sync:pull` | Quick addition of specific skills, scripting |

## Safety

- Checks for existing skills before overwriting
- Only pulls from this marketplace
- Updates manifest to track pulled skills
- Validates domains exist before attempting pull

## Notes

- Use `/sync:list` to see available domains
- Use `/sync:update` to refresh already-installed skills
- Use `/sync:delete` to remove skills
- Domains are namespaced by team (e.g., `inspire-architecture`)
