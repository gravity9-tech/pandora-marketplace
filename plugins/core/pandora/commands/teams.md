---
description: List all available teams in the pandora hub
argument-hint:
allowed-tools: Read, Glob, Bash
---

# Pandora Teams Command

List all available teams in the pandora hub.

## Step 0: Determine Home Directory

First, get the user's home directory path:
```bash
echo $HOME
```

Use this value to replace `{home}` in all subsequent paths.

## Source Location

Teams are located at:
```
{home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/
```

## Process

1. **Find team manifest files**

   Use Glob to find all manifest.json files (use the actual home path from Step 0):
   ```
   pattern: **/manifest.json
   path: {home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online
   ```

   Or with Bash:
   ```bash
   ls $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/*/manifest.json 2>/dev/null
   ```

2. **Read each manifest.json**

   For each manifest found, read it to get team metadata (team name, description, version, components).

3. **Display formatted output**

   ```
   Pandora Teams

   Source: {home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/

   | Team | Description | Version | Components |
   |------|-------------|---------|------------|
   | decide-team | Decision-making tools and workflows | 1.0.0 | (empty) |
   | find-team | Search and discovery tools | 1.0.0 | (empty) |
   | inspire-team | Creative and inspiration tools | 1.0.0 | (empty) |

   Total: 3 teams

   Commands:
     /pandora:browse <team>              - View team's available components
     /pandora:install <team>:<path>      - Install components from a team
   ```

## Component Count Display

For each team, count components from manifest.json `components` object:
- agents, hooks, mcp_servers, skills, slash_commands, workflows

If a team has components, show: `2 agents, 1 skill`
If all counts are zero, show: `(empty)`

## If No Teams Found

If no manifests found:
```
No teams found in pandora hub.

Expected location: {home}/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/

Make sure pandora-marketplace is installed at {home}/.claude/plugins/marketplaces/pandora-marketplace/
```

## If Marketplace Not Installed

If the marketplace directory doesn't exist, display:
```
Pandora marketplace not found.

Install it with:
  git clone <repo-url> ~/.claude/plugins/marketplaces/pandora-marketplace

Or add it as a Claude Code plugin marketplace.
```
