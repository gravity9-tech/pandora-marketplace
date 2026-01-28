# Pandora Plugin

Pandora hub commands for browsing and installing team-contributed components.

## Overview

The pandora plugin provides commands to discover and install components shared by teams in the `plugins/community/online/` directory. Teams can share:

- **Agents** - Claude Code subagents for specialized tasks
- **Hooks** - Event-driven automation scripts
- **MCP Servers** - Model Context Protocol server configurations
- **Skills** - Reusable context and capabilities
- **Slash Commands** - Custom commands
- **Workflows** - Multi-step orchestrated processes

## Commands

### `/pandora:teams`

List all available teams in the marketplace.

```bash
/pandora:teams
```

Output:
```
Pandora Teams

| Team | Description | Components |
|------|-------------|------------|
| decide-team | Decision-making tools | 2 agents, 1 hook |
| find-team | Search and discovery | 3 skills |
| inspire-team | Creative tools | (empty) |

Total: 3 teams
```

### `/pandora:browse <team>`

Browse all available components from a specific team.

```bash
/pandora:browse decide-team
```

Output:
```
Team: decide-team
Description: Decision-making tools and workflows

Agents (2)
| Name | Description |
|------|-------------|
| decision-tree | Builds decision trees |
| pros-cons | Analyzes pros and cons |

Hooks (1)
| Name | Description |
|------|-------------|
| review-gate | Review before destructive ops |
```

### `/pandora:install <team>:<path>`

Install components from a team.

```bash
# Install specific component
/pandora:install decide-team:agents/decision-tree

# Install all of a type
/pandora:install decide-team:agents/*

# Install everything from team
/pandora:install decide-team:*
```

## Installation Locations

| Component | Installed To |
|-----------|--------------|
| agents | `~/.claude/agents/` |
| hooks | `~/.claude/hooks/` |
| mcp_servers | `~/.claude/mcp_servers/` |
| skills | `~/.claude/skills/` |
| slash_commands | `~/.claude/commands/` |
| workflows | `~/.claude/workflows/` |

## Team Structure

Teams are located in `plugins/community/online/`:

```
plugins/community/online/
├── decide-team/
│   ├── manifest.json
│   ├── agents/
│   ├── hooks/
│   ├── mcp_servers/
│   ├── skills/
│   ├── slash_commands/
│   └── workflows/
├── find-team/
│   └── ...
└── inspire-team/
    └── ...
```

## Adding a New Team

1. Create team directory:
   ```bash
   mkdir -p plugins/community/online/my-team/{agents,hooks,mcp_servers,skills,slash_commands,workflows}
   ```

2. Create `manifest.json`:
   ```json
   {
     "team": "my-team",
     "description": "My team's tools",
     "version": "1.0.0",
     "maintainers": ["me@example.com"],
     "components": {
       "agents": [],
       "hooks": [],
       "mcp_servers": [],
       "skills": [],
       "slash_commands": [],
       "workflows": []
     }
   }
   ```

3. Add components and update manifest.json to register them.

## Version

1.0.0
