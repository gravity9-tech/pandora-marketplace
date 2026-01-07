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

## Project Structure

```
pandora_marketplace/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace configuration and registry
├── plugins/                          # All Claude Code plugins and extensions
│   ├── core/                         # Core plugins (always included)
│   │   ├── context-engineering/      # Context generation commands
│   │   └── deepwiki/                 # Documentation generation suite
│   ├── integrations/                 # Third-party integrations
│   │   └── launchdarkly/             # LaunchDarkly feature flags
│   ├── roles/                        # Role-based plugin collection (for future)
│   ├── tech-stacks/                  # Technology-specific plugins (for future)
│   └── pandora/                      # Organization-specific plugins (for future)
├── team_context/                     # Shared team knowledge and standards
│   ├── architecture/                 # Architecture patterns and decisions
│   ├── business_domain/              # Domain knowledge and business rules
│   ├── coding_guidelines/            # Coding standards and best practices
│   ├── development-env/              # Environment setup and troubleshooting
│   ├── integration/                  # API standards and integration patterns
│   ├── monitoring-observability/     # Logging, metrics, and monitoring
│   ├── references/                   # Quick references and useful links
│   ├── repositories/                 # Repository standards and inventory
│   ├── security-compliance/          # Security and compliance guidelines
│   ├── tech_stack/                   # Technology inventory and rationale
│   └── workflows/                    # Team workflows and processes
├── templates/                        # Templates for creating new plugins
│   ├── agents/                       # Agent creation templates
│   ├── hooks/                        # Hook implementation templates
│   ├── mcp_servers/                  # MCP server templates
│   ├── skills/                       # Skill creation templates
│   ├── slash_commands/               # Slash command templates
│   └── workflows/                    # Workflow templates
├── .claude/
│   └── settings.json                 # Claude Code settings
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## Core Components

### 🔌 Plugins

#### Context Engineering
Automated context generation commands for project analysis and documentation:

- **`/context-eng:glossary`** - Extract domain-specific terms and build a comprehensive glossary
- **`/context-eng:architecture`** - Analyze system architecture and generate detailed design documentation
- **`/context-eng:coding-guidelines`** - Detect technologies and generate tailored coding guidelines
- **`/context-eng:tech-stack`** - Identify and document complete technology stack
- **`/context-eng:all`** - Run all context engineering commands in sequence

#### DeepWiki
Documentation generation and analysis suite:

- **`/deepwiki`** - Main command for wiki-style documentation generation
- **`deepwiki-doc-generator`** - Agent that generates documentation from codebase analysis
- **`deepwiki-planner`** - Agent that plans documentation structure and content
- **`generating-ascii-diagrams`** - Skill for creating ASCII architecture and flow diagrams

#### LaunchDarkly Integration
Feature flag management commands:

- **`/add-feature-flag`** - Create and configure feature flags
- **`/remove-feature-flag`** - Manage and remove feature flags

### 📚 Team Context

Structured documentation templates for shared team knowledge:

- **Architecture**: Design patterns, system architecture, component relationships
- **Business Domain**: Glossary, user stories, domain knowledge
- **Coding Guidelines**: Best practices, style guides, code review checklists
- **Development Environment**: Setup guides, troubleshooting, prerequisites
- **Integration**: API standards, integration patterns, third-party services
- **Monitoring & Observability**: Logging standards, alerting, monitoring setup
- **Security & Compliance**: Security guidelines, secrets management
- **Tech Stack**: Frameworks, libraries, tooling documentation
- **Workflows**: Development, deployment, QA, and PR processes

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

### 3. Customize Team Context

Update the files in `team_context/` to reflect your organization:

```bash
team_context/
├── coding_guidelines/   # Your coding standards
├── architecture/        # Your system architecture
├── workflows/          # Your team processes
└── tech_stack/         # Your technology choices
```

### 4. Explore Available Commands

Once registered, use Claude Code to access marketplace features:

```bash
# Generate complete project context
/context-eng:all /path/to/your/repo ./generated-context

# Or run individual commands:
/context-eng:glossary /path/to/your/repo ./glossary.md
/context-eng:architecture /path/to/your/repo ./architecture
/deepwiki /path/to/your/repo
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
├── roles/            # Role-specific plugin collections (PM, Backend, Frontend, etc.)
├── tech-stacks/      # Technology-specific plugins (Java, .NET, JavaScript, etc.)
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
  "items": [
    {
      "type": "command",
      "name": "glossary",
      "category": "core",
      "plugin": "context-engineering",
      "path": "plugins/core/context-engineering/commands/context-eng/glossary.md"
    }
  ]
}
```

## Usage Examples

### Generate Complete Context for Your Codebase

```bash
# Run all context engineering commands
/context-eng:all /path/to/your/project ./project-context

# Result: Complete documentation in project-context/
# ├── glossary/        - Domain terminology
# ├── architecture/    - System design
# ├── guidelines/      - Coding standards
# └── tech-stack/      - Technology inventory
```

### Generate Architecture Documentation

```bash
/context-eng:architecture /path/to/your/project ./docs/architecture

# Creates detailed documentation:
# ├── system-architecture.md
# ├── component-hierarchy.md
# ├── design-patterns.md
# ├── data-flow.md
# └── deployment-architecture.md
```

### Generate Tailored Coding Guidelines

```bash
/context-eng:coding-guidelines /path/to/your/project ./guidelines

# Detects your tech stack and generates:
# ├── typescript-guidelines.md
# ├── react-guidelines.md
# ├── python-guidelines.md
# ├── testing-standards.md
# ├── code-review-checklist.md
# └── ... (one file per detected technology)
```

### Generate Project Glossary

```bash
/context-eng:glossary /path/to/your/project ./glossary.md

# Creates glossary with:
# - Domain-specific terms extracted from code
# - Definitions from comments and docstrings
# - Organized by concept categories
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

1. **Customize `team_context/`** with your specific standards and processes
2. **Add Role-Based Plugins** in `plugins/roles/` for specialized workflows
3. **Add Tech Stack Plugins** in `plugins/tech-stacks/` for specific technologies
4. **Document Standards** in `team_context/` for team-wide consistency
5. **Share with Team** and make marketplace available to all team members

### For Multiple Teams

1. **Maintain Core** plugins in `plugins/core/`
2. **Organize by Team** in `plugins/pandora/{team-name}/`
3. **Share Common Context** in `team_context/`
4. **Team-Specific Context** in `team_context/{team-name}/`
5. **Central Registry** via marketplace.json

## Contributing

To add new plugins or components to the marketplace:

1. **Use Templates**: Start with relevant template in `templates/`
2. **Follow Structure**: Organize in appropriate `plugins/` directory
3. **Update Registry**: Add entry to `.claude-plugin/marketplace.json`
4. **Document**: Add documentation to `team_context/` as needed
5. **Test**: Verify plugin works with Claude Code

## Resources

- **Marketplace Configuration**: `.claude-plugin/marketplace.json`
- **Plugin Templates**: `templates/` directory
- **Team Context**: `team_context/` directory
- **Core Plugins**: `plugins/core/` directory
- **Integration Examples**: `plugins/integrations/` directory

## Version

**Pandora Marketplace v1.0.0**

- Initial implementation
- Core plugins: Context Engineering, DeepWiki
- Integration: LaunchDarkly
- Comprehensive team context templates
- Plugin development templates

## Support

For help:

1. Check `team_context/development-env/troubleshooting.md`
2. Review plugin documentation in respective directories
3. Consult templates for implementation examples
4. See `team_context/references/useful-links.md` for external resources

---

**Pandora Marketplace** - Building scalable, team-aware Claude Code ecosystems
