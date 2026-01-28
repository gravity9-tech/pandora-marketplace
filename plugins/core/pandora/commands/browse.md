---
description: Browse available components from a team in the pandora hub
argument-hint: <team-name>
allowed-tools: Read, Glob, Bash
---

# Pandora Browse Command

Browse all available components from a specific team in the pandora hub.

## Arguments

- `team-name` (required): The name of the team to browse (e.g., `decide-team`, `find-team`)

## Step 0: Determine Home Directory

First, get the user's home directory path:
```bash
echo $HOME
```

Use this value to replace `{home}` in all subsequent paths.

## Source Location

Teams are located at:
```
{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team-name}/
```

## Process

1. **Validate argument**

   If no team name provided:
   ```
   Usage: /pandora:browse <team-name>

   Example: /pandora:browse decide-team

   Use /pandora:teams to see available teams.
   ```

2. **Find and read team manifest**

   Read the manifest file:
   ```
   {home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team-name}/manifest.json
   ```

   If not found:
   ```
   Team '{team-name}' not found.

   Use /pandora:teams to see available teams.
   ```

3. **Display team info and components**

   ```
   Team: {team}
   Description: {description}
   Version: {version}
   Source: {home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/

   ─────────────────────────────────────────────────────────────

   Agents ({count})
   | Name | Description |
   |------|-------------|
   | {name} | {description} |

   Install: /pandora:install {team} agents {name}

   ─────────────────────────────────────────────────────────────

   Hooks ({count})
   (none available)

   ─────────────────────────────────────────────────────────────

   Skills ({count})
   (none available)

   ─────────────────────────────────────────────────────────────

   Slash Commands ({count})
   (none available)

   ─────────────────────────────────────────────────────────────

   MCP Servers ({count})
   (none available)

   ─────────────────────────────────────────────────────────────

   Workflows ({count})
   (none available)

   ─────────────────────────────────────────────────────────────

   Install all: /pandora:install {team} *
   ```

4. **For empty teams**

   If team has no components (all arrays empty):
   ```
   Team: {team}
   Description: {description}
   Version: {version}

   This team has no components available yet.
   ```

## Component Types

| Type | In manifest.json | Source Path |
|------|------------------|-------------|
| agents | `components.agents` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/agents/{name}.md` |
| hooks | `components.hooks` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/hooks/{name}/` |
| mcp_servers | `components.mcp_servers` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/mcp_servers/{name}/` |
| skills | `components.skills` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/skills/{name}/` |
| slash_commands | `components.slash_commands` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/slash_commands/{name}.md` |
| workflows | `components.workflows` | `{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/workflows/{name}/` |
