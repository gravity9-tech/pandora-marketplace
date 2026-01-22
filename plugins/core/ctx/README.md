# Context Toolkit (ctx)

## Overview

The Context Toolkit is a unified plugin that combines two complementary capabilities:

1. **Scan** (`/scan:*`) - Analyze and generate documentation from your codebase
2. **Sync** (`/sync:*`) - Distribute and manage team context as auto-loading skills

Together, these enable teams to both generate project-specific context and share standardized context templates across the organization.

## Installation

### Step 1: Add the Marketplace

```bash
/plugin marketplace add pandora-marketplace
```

### Step 2: Install the Plugin

```bash
/plugin install ctx@pandora-marketplace
```

### Step 3: Register the Marketplace Path

Create or update `~/.claude/plugins/known_marketplaces.json`:

```json
{
  "marketplaces": [
    "/path/to/pandora-marketplace"
  ]
}
```

## Commands

### Scan Commands

Generate context documentation by analyzing your codebase.

| Command | Description |
|---------|-------------|
| `/scan:all` | Generate all context documentation in one command |
| `/scan:architecture` | Analyze and document system architecture |
| `/scan:tech-stack` | Identify technologies, frameworks, and dependencies |
| `/scan:coding-guidelines` | Extract and document coding standards |
| `/scan:glossary` | Generate terminology glossary for your domain |

**Usage:**

```bash
# Generate all context documentation
/scan:all <codebase-path> <output-directory>

# Examples
/scan:all . ./generated-context
/scan:all /path/to/repo ./docs/context

# Individual commands
/scan:glossary /path/to/repo ./glossary
/scan:architecture /path/to/repo ./architecture
```

### Sync Commands

Distribute and manage team context as globally-installed skills.

| Command | Description |
|---------|-------------|
| `/sync:init` | Interactive setup - select team and domains to install |
| `/sync:pull` | Quick pull - directly specify team and domains |
| `/sync:list` | Display available teams, domains, and installed skills |
| `/sync:update` | Update installed skills with latest from marketplace |
| `/sync:delete` | Remove installed skills and clean up manifest |

**Usage:**

```bash
# Interactive initialization
/sync:init

# Quick pull specific domains
/sync:pull inspire-team architecture,workflows
/sync:pull inspire-team --all

# List available and installed skills
/sync:list

# Update installed skills
/sync:update

# Remove skills
/sync:delete
```

## How It Works

### Global Skills Installation

Skills are installed globally to your home directory, not per-project:

```
~/.claude/skills/
├── .skills-manifest.json          ← Tracks installed skills
├── inspire-architecture/          ← Team-namespaced folders
│   ├── SKILL.md
│   └── references/
│       └── *.md
├── inspire-workflows/
│   ├── SKILL.md
│   └── references/
│       └── *.md
└── ...
```

**Benefits:**
- No project pollution
- Skills shared across all projects
- Single update point
- Team namespacing prevents conflicts

### Manifest Tracking

The `.skills-manifest.json` file tracks which skills are installed from which marketplace:

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
      "installed_at": "2024-01-21T10:00:00Z",
      "updated_at": "2024-01-21T16:30:00Z"
    }
  ]
}
```

This ensures:
- `/sync:list` only shows skills from this marketplace
- `/sync:delete` only removes skills from this marketplace
- `/sync:update` only updates skills from this marketplace
- Other skills (from other marketplaces or manually created) are not affected

### Auto-Loading Skills

After installation, Claude Code automatically discovers skills:

1. **Session Start**: Claude discovers all `SKILL.md` files in `~/.claude/skills/`
2. **Description Loading**: Only skill descriptions loaded initially (small token footprint)
3. **Auto-Invocation**: When a task matches a skill's description, Claude loads the full content
4. **Context Files**: The skill instructs Claude to read files in `./references/`

This enables **on-demand context loading** - Claude only loads what's relevant to the current task.

## Skill Structure

Each skill follows this structure:

```
{team}-{domain}/
├── SKILL.md                    ← Auto-discovered by Claude
└── references/                 ← Context files
    ├── file1.md
    ├── file2.md
    └── ...
```

**SKILL.md** contains:
- Frontmatter with metadata (`name`, `description`, `source`, `team`, `domain`)
- Instructions for Claude on when and how to load the context
- References to files in `./references/`

## Available Context Domains

The marketplace provides 12 pre-built domains organized in 3 categories:

**Core:**
- `architecture` - System design, patterns, component relationships
- `coding_guidelines` - Best practices, style guides, code review standards
- `tech_stack` - Frameworks, libraries, tooling documentation
- `workflows` - Development, deployment, QA, PR processes

**Process:**
- `development-env` - Setup guides, troubleshooting, prerequisites
- `qa-standards` - Testing guidelines and quality standards
- `security-compliance` - Security guidelines, secrets management
- `monitoring-observability` - Logging, alerting, monitoring setup

**Reference:**
- `business_domain` - Domain knowledge, glossary, user stories
- `integration` - API standards, integration patterns, third-party services
- `references` - Quick references and useful links
- `repositories` - Repository standards and inventory

## Command Comparison

| Command | Use Case |
|---------|----------|
| `/sync:init` | First-time setup, guided interactive flow |
| `/sync:pull` | Quick addition of specific skills, scripting |
| `/sync:update` | Refresh already-installed skills to latest |
| `/sync:delete` | Remove installed skills |
| `/sync:list` | View available and installed skills |

## Workflow Example

```bash
# 1. First time setup - interactive
/sync:init
# Select team: inspire-team
# Select domains: architecture, coding_guidelines, workflows

# 2. Later, add more domains directly
/sync:pull inspire-team security-compliance,monitoring-observability

# 3. Check what's installed
/sync:list

# 4. Update all to latest
/sync:update

# 5. Remove a skill
/sync:delete
```

## Scan Output Structure

When using `/scan:*` commands to generate documentation:

```
output-directory/
├── glossary/                    # Domain terminology
│   ├── architecture-terms.md
│   ├── data-model-terms.md
│   └── business-logic-terms.md
├── architecture/                # System design documentation
│   ├── system-architecture.md
│   ├── design-patterns.md
│   └── data-flow.md
├── guidelines/                  # Coding standards
│   ├── {language}-guidelines.md
│   ├── testing-standards.md
│   └── code-review-checklist.md
└── tech-stack/                  # Technology documentation
    ├── tech-stack-overview.md
    ├── frontend-stack.md
    └── backend-stack.md
```

## Use Cases

- **Onboarding**: New team members get context automatically loaded
- **Consistency**: Standardized context across all team projects
- **AI Collaboration**: Claude understands your team's patterns and practices
- **Knowledge Sharing**: Domain knowledge distributed across the organization
- **Documentation**: Generate comprehensive codebase documentation with scan commands
