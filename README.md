# Pandora Marketplace

This repo is provide a Claude Code marketplace template that contains reusable plugins, agents, commands, skills, and team context for extending Claude Code capabilities across multiple teams.

## Overview

Pandora Marketplace is a structured repository that serves as a foundational template for teams to:

- **Extend Claude Code** with custom plugins, agents, and commands
- **Share Reusable Components** across teams and projects
- **Maintain Consistency** through shared team context, guidelines, and standards
- **Implement Team-Specific Workflows** tailored to your development practices
- **Build Documentation Automation** with intelligent context generation tools

This marketplace enables organizations to create a unified, scalable ecosystem for AI-assisted development while maintaining team-specific customizations and standards.

## How To Use This Marketplace

### Step 1: Add the Pandora Marketplace to Claude Code

```bash
/plugin marketplace add pandora-marketplace
```

Or add it with a specific repository path:

```bash
# Add from local directory
/plugin marketplace add ./pandora_marketplace

# Add from GitHub repository
/plugin marketplace add owner/pandora_marketplace

# Add from Git URL
/plugin marketplace add https://github.com/your-org/pandora_marketplace.git
```

### Step 2: Discover Available Plugins

Once the marketplace is added, you can discover all available plugins:

```bash
/plugin list
```

This will show all available plugins in the marketplace, organized by category:
- **Core Plugins**: Essential tools always recommended
- **Integration Plugins**: Third-party service integrations
- **Team Plugins**: Team-specific configurations

### Step 3: Install Plugins

Install any plugin from the marketplace using:

```bash
/plugin install <plugin-name>@pandora-marketplace
```

#### Available Plugins

##### Core Plugins

**DeepWiki** - Documentation Generation System
```bash
/plugin install deepwiki@pandora-marketplace
```
📖 [DeepWiki Usage Guide](./plugins/core/deepwiki/README.md)

**Safeguard** - Code Safety & Protection
```bash
/plugin install safeguard@pandora-marketplace
```
📖 [Safeguard Usage Guide](./plugins/core/safeguard/README.md)

##### Integration Plugins

**LaunchDarkly** - Feature Flag Management
```bash
/plugin install launchdarkly@pandora-marketplace
```
📖 [LaunchDarkly Usage Guide](./plugins/integrations/launchdarkly/README.md)

### Step 4: Use the Plugin

After installation, each plugin provides specific commands. Refer to individual plugin README files for detailed usage instructions:

```bash
# Initialize wiki documentation from your codebase
/deepwiki:init ./ ./wiki

# Sync wiki to Claude Code skills (after manual edits)
/deepwiki:sync ./wiki

# Install security protections
/install

# Manage feature flags
/add-feature-flag new-feature-name
```

### Step 5: Update and Manage Plugins

```bash
# Update marketplace to latest version
/plugin marketplace update

# List installed plugins
/plugin list --installed

# Uninstall a plugin
/plugin uninstall <plugin-name>@pandora-marketplace
```

### Quick Reference

| Task | Command |
|------|---------|
| Add marketplace | `/plugin marketplace add pandora-marketplace` |
| List plugins | `/plugin list` |
| Install plugin | `/plugin install <name>@pandora-marketplace` |
| Update marketplace | `/plugin marketplace update` |
| Initialize wiki documentation | `/deepwiki:init ./ ./wiki` |
| Sync wiki to skills | `/deepwiki:sync ./wiki` |
| Setup security | `/install` |
| Add feature flag | `/add-feature-flag <flag-name>` |

## Project Structure

```
pandora_marketplace/
├── .claude/
│   └── settings.json                 # Claude Code settings
├── .claude-plugin/
│   └── marketplace.json              # Marketplace configuration and registry
├── plugins/                          # All Claude Code plugins and extensions
│   ├── core/                         # Core plugins (always included)
│   │   ├── deepwiki/                 # Documentation generation suite
│   │   │   ├── agents/               # Planner, doc-generator, skill-generator
│   │   │   ├── commands/             # init.md, sync.md
│   │   │   └── skills/               # ASCII diagrams, templates, patterns
│   │   └── safeguard/                # Code safety and damage control
│   │       ├── commands/             # install.md
│   │       └── skills/               # Damage control hooks and cookbooks
│   ├── integrations/                 # Third-party integrations
│   │   └── launchdarkly/             # LaunchDarkly feature flags
│   │       ├── commands/             # add-feature-flag.md, remove-feature-flag.md
│   │       └── mcp/                  # MCP server configuration
│   └── pandora/                      # Organization-specific plugins
│       └── online/                   # Online team configurations
│           ├── decide-team/          # Team context and plugins
│           ├── find-team/            # Team context and plugins
│           └── inspire-team/         # Team context and plugins
├── templates/                        # Templates for creating new plugins
│   ├── agents/                       # Agent creation templates
│   ├── hooks/                        # Hook implementation templates
│   ├── mcp_servers/                  # MCP server templates
│   ├── skills/                       # Skill creation templates
│   ├── slash_commands/               # Slash command templates
│   └── workflows/                    # Workflow templates
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## Core Components

### 🔌 Plugins

#### DeepWiki
Documentation generation suite with on-demand context loading:

- **`/deepwiki:init`** - Initialize wiki documentation from codebase with ASCII diagrams and cross-references
- **`/deepwiki:sync`** - Sync documentation to Claude Code skills for automatic context loading
- **`deepwiki-planner`** - Agent that analyzes codebase and generates documentation structure
- **`deepwiki-doc-generator`** - Agent that generates individual wiki pages with diagrams
- **`deepwiki-skill-generator`** - Agent that creates Claude Code skills from wiki

#### Safeguard
Code safety and damage control plugin:

- Code analysis and safety checks
- Damage control recovery utilities
- Language-specific hooks for Python and TypeScript

#### Integrations
Third-party service integrations:

- **LaunchDarkly** - Feature flag management

### 🛠️ Templates

Starting templates for extending the marketplace:

- **Agents**: Templates for creating custom Claude Code agents
- **Skills**: Templates for implementing reusable skills
- **Slash Commands**: Templates for creating new commands
- **Workflows**: Templates for complex multi-step workflows
- **Hooks**: Templates for event-driven automation
- **MCP Servers**: Templates for MCP server integration

## Getting Started

### 1. Initialize the Marketplace

```bash
# Clone or copy the marketplace template
git clone <marketplace-repo> pandora_marketplace
cd pandora_marketplace
```

### 2. Register in Claude Code

The marketplace is automatically registered via `.claude-plugin/marketplace.json`. Claude Code will:
- Discover all plugins in the `/plugins` directory
- Load marketplace configuration
- Make all commands, agents, and skills available

### 3. Generate Documentation

Use DeepWiki to generate documentation from your codebase:

```bash
# Initialize wiki documentation
/deepwiki:init ./ ./wiki

# Sync to Claude Code skills for on-demand context
/deepwiki:sync ./wiki
```

### 4. Explore Available Commands

Once registered, use Claude Code to access marketplace features:

```bash
# Initialize wiki documentation from your codebase
/deepwiki:init /path/to/your/repo ./wiki

# Sync wiki to Claude Code skills (after manual edits)
/deepwiki:sync ./wiki

# Sync custom documentation as a skill
/deepwiki:sync ./docs/team-conventions conventions
```

## Plugin Development

### Creating a New Command

See `templates/slash_commands/slash-command-template.md` for:
- Command syntax and parameters
- Tool permissions configuration
- Output format guidelines
- Examples and usage patterns

### Creating a New Agent

See `templates/agents/subagent-template.md` for:
- Agent capability definition
- Input/output specifications
- Tool access configuration
- Integration with Claude Code

### Creating a New Skill

See `templates/skills/skill-template.md` for:
- Skill structure and metadata
- Template usage examples
- Reference materials
- Helper scripts

### Creating a Workflow

See `templates/workflows/workflow_template.md` for:
- Workflow composition
- Multi-step orchestration
- Conditional logic
- Error handling

## Marketplace Structure

### Plugin Organization

Plugins are organized by category:

```
plugins/
├── core/              # Essential plugins included by default
├── integrations/      # Third-party service integrations
└── pandora/          # Organization-specific plugins and customizations
```

### Plugin Components

Each plugin can contain:

- **Commands** (`.commands/`): Slash commands and CLI-style operations
- **Agents** (`.agents/`): Autonomous Claude agents for complex tasks
- **Skills** (`.skills/`): Reusable capabilities with templates
- **Workflows** (`.workflows/`): Multi-step orchestrated processes
- **MCP Servers** (`.mcp/`): Model Context Protocol integrations

### Marketplace Registry

`.claude-plugin/marketplace.json` maintains the registry of all plugins:

```json
{
  "version": "1.0.0",
  "description": "Pandora Marketplace catalog",
  "plugins": [
    {
      "name": "plugin-name",
      "source": "path/to/the/plugin",
      "description": "Sample description of the plugin",
      "version": "1.0.0",
      "category": "core"
    }
  ]
}
```

## Usage Examples

### Generate Wiki Documentation for Your Codebase

```bash
# Initialize wiki from your project
/deepwiki:init /path/to/your/project ./wiki

# Result: Complete documentation in ./wiki/
# ├── README.md           - Navigation hub
# ├── overview/           - System overview, tech stack, glossary
# ├── architecture/       - System design, components, data model
# ├── features/           - Feature documentation
# ├── development/        - Setup, coding standards
# ├── testing/            - Testing strategy
# └── deployment/         - Build and environments
```

### Sync Wiki to Claude Code Skills

```bash
# After manual edits to wiki, sync to skills
/deepwiki:sync ./wiki

# Creates skills at {home}/.claude/skills/
# ├── overview/SKILL.md
# ├── architecture/SKILL.md
# ├── features/SKILL.md
# └── ...

# Claude auto-loads relevant context as you work
```

### Create Custom Context Skills

```bash
# Create custom documentation directory
mkdir -p ./docs/team-conventions

# Sync with custom skill name
/deepwiki:sync ./docs/team-conventions conventions

# Result: {home}/.claude/skills/conventions/SKILL.md
```

### Sync Single Section

```bash
# Update only architecture skill after edits
/deepwiki:sync ./wiki/architecture

# Result: Updates {home}/.claude/skills/architecture/SKILL.md
```

## File Format Standards

### Commands and Agents

Defined in Markdown with frontmatter:

```markdown
---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [param1] [param2]
description: Brief description of functionality
---

## Purpose
...

## Parameters
...

## Execution Steps
...
```

### Team Context Files

Organized by category with consistent structure:

```markdown
# Topic Title

## Overview
...

## Current State
...

## Standards/Guidelines
...

## References
...
```

## Team Integration

### For Teams Using This Marketplace

1. **Generate Documentation** with `/deepwiki:init` to create wiki from your codebase
2. **Sync to Skills** with `/deepwiki:sync` for on-demand context loading
3. **Add Team Plugins** in `plugins/pandora/{team-name}/` for team-specific workflows
4. **Share with Team** and make marketplace available to all team members

### For Multiple Teams

1. **Maintain Core** plugins in `plugins/core/`
2. **Organize by Team** in `plugins/pandora/{team-name}/`
3. **Central Registry** via marketplace.json

## Contributing

To add new plugins or components to the marketplace:

1. **Use Templates**: Start with relevant template in `templates/`
2. **Follow Structure**: Organize in appropriate `plugins/` directory
3. **Update Registry**: Add entry to `.claude-plugin/marketplace.json`
4. **Test**: Verify plugin works with Claude Code

## Resources

- **Marketplace Configuration**: `.claude-plugin/marketplace.json`
- **Plugin Templates**: `templates/` directory
- **Core Plugins**: `plugins/core/` directory
- **Integration Examples**: `plugins/integrations/` directory

## Version

**Pandora Marketplace v1.0.0**

- Initial implementation
- Core plugins: DeepWiki, Safeguard
- Integration: LaunchDarkly
- Plugin development templates

## Support

For help:

1. Check [Plugin Marketplaces Documentation](https://code.claude.com/docs/en/plugin-marketplaces)
2. Check [Plugins Documentation](https://code.claude.com/docs/en/plugins)
3. Check [Discover Plugins Documentation](https://code.claude.com/docs/en/discover-plugins)

---

**Pandora Marketplace** - Building scalable, team-aware Claude Code ecosystems
