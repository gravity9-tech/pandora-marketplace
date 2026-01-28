---
description: Install components from a team in the pandora hub
argument-hint: "[team/type/name]"
allowed-tools: Read, Write, Bash, Glob, AskUserQuestion
---

# Pandora Install Command

Install components from a pandora hub team to your local Claude Code configuration.

## Arguments (All Optional)

The command supports progressive narrowing using path-like syntax: `team/type/name`

Any missing parts will be prompted interactively.

| Arguments | Behavior |
|-----------|----------|
| (none) | Ask team → Ask type → Ask component |
| `<team>` | Ask type → Ask component |
| `<team>/<type>` | Ask component |
| `<team>/<type>/<name>` | Install directly |
| `<team>/<type>/*` | Install all of type |
| `<team>/*` | Install all from team |

Examples:
- `/pandora:install` - Guided installation
- `/pandora:install decide-team` - Choose type and component from decide-team
- `/pandora:install decide-team/agents` - Choose which agent to install
- `/pandora:install decide-team/agents/my-agent` - Install specific agent directly
- `/pandora:install decide-team/agents/*` - Install all agents
- `/pandora:install decide-team/*` - Install everything from team

## Step 0: Determine Home Directory

First, get the user's home directory path:
```bash
echo $HOME
```

Use this value to replace `{home}` in all subsequent paths, OR use `$HOME` directly in bash commands.

## Locations

**Source** (pandora hub):
```
$HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/
```

**Target** (installation):

| Component Type | Target Location |
|----------------|-----------------|
| agents | `$HOME/.claude/agents/` |
| hooks | `$HOME/.claude/hooks/` + update settings.json |
| mcp_servers | `$HOME/.claude/mcp_servers/` + update settings.json |
| skills | `$HOME/.claude/skills/` |
| slash_commands | `$HOME/.claude/commands/` |
| workflows | `$HOME/.claude/workflows/` |

## Process

### 1. Parse Arguments and Progressively Narrow

Parse path-like argument: `[team]/[type]/[name]` (split by `/`)

**Step 1a: Determine Team**

If no team argument provided, list available teams and ask:
```
Use AskUserQuestion with:
- question: "Which team do you want to install from?"
- header: "Team"
- options: List teams found in $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/
  Each option: { label: "{team-name}", description: "{description from manifest.json}" }
```

**Step 1b: Determine Component Type**

If no type argument provided, read the team's manifest.json and ask:
```
Use AskUserQuestion with:
- question: "What type of component do you want to install?"
- header: "Type"
- options: Only show types that have components available:
  { label: "Agents", description: "{count} available" }
  { label: "Skills", description: "{count} available" }
  { label: "Hooks", description: "{count} available" }
  { label: "Slash Commands", description: "{count} available" }
  { label: "MCP Servers", description: "{count} available" }
  { label: "Workflows", description: "{count} available" }
  { label: "All", description: "Install everything from this team" }
```

Skip types with 0 components. If user selects "All", proceed to install all components.

**Step 1c: Determine Specific Component**

If no name argument provided and type is not "All", list available components and ask:
```
Use AskUserQuestion with:
- question: "Which {type} do you want to install?"
- header: "{Type}"
- multiSelect: true (allow installing multiple)
- options: List components from manifest.json components.{type} array
  Each option: { label: "{name}", description: "{description}" }
  Add final option: { label: "All", description: "Install all {count} {type}" }
```

### 2. Validate Team Exists

Read manifest from:
```
$HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/manifest.json
```

If not found:
```
Team '{team}' not found.

Use /pandora:teams to see available teams.
```

### 3. Determine Components to Install

Based on the selections from step 1, build the list of components to install.

### 4. Create Target Directories

```bash
mkdir -p $HOME/.claude/agents $HOME/.claude/hooks $HOME/.claude/mcp_servers $HOME/.claude/skills $HOME/.claude/commands $HOME/.claude/workflows
```

### 5. Copy Components

**Agents** (markdown files):
```bash
cp $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/agents/{name}.md $HOME/.claude/agents/{name}.md
```

**Skills** (directories with SKILL.md):
```bash
cp -r $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/skills/{name}/ $HOME/.claude/skills/{name}/
```

**Slash Commands** (markdown files):
```bash
cp $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/slash_commands/{name}.md $HOME/.claude/commands/{name}.md
```

**Hooks** (directories):
```bash
cp -r $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/hooks/{name}/ $HOME/.claude/hooks/{name}/
```
Then read `$HOME/.claude/hooks/{name}/hook.json` and add to `$HOME/.claude/settings.json` hooks array.

**MCP Servers** (directories):
```bash
cp -r $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/mcp_servers/{name}/ $HOME/.claude/mcp_servers/{name}/
```
Then read `$HOME/.claude/mcp_servers/{name}/mcp.json` and merge into `$HOME/.claude/settings.json` mcpServers object.

**Workflows** (directories):
```bash
cp -r $HOME/.claude/plugins/marketplaces/pandora-marketplace/plugins/community/online/{team}/workflows/{name}/ $HOME/.claude/workflows/{name}/
```

### 6. Display Results

```
Installed from {team}:

  Agents:
    + {name} → {home}/.claude/agents/{name}.md

  Skills:
    + {name} → {home}/.claude/skills/{name}/

Total: {n} components installed

Note: Restart Claude Code for changes to take effect.
```

### 7. Handle Conflicts

If component already exists at target, use AskUserQuestion:
```
Use AskUserQuestion with:
- question: "Component '{name}' already exists. What would you like to do?"
- header: "Conflict"
- options:
  { label: "Skip", description: "Keep existing, don't install" }
  { label: "Overwrite", description: "Replace with hub version" }
  { label: "Backup", description: "Save existing as {name}.backup, then install" }
```

### 8. Handle No Components

If the selected type has no components available:
```
No {type} available in {team}.

Use /pandora:browse {team} to see what's available.
```
