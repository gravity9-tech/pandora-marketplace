# Context Manager Plugin

## Overview
Context Manager enables teams to distribute and manage project context templates across the organization. It provides commands to initialize, pull, and update context templates from the Pandora Marketplace into local projects, ensuring consistency and knowledge sharing across teams.

## Installation

### Step 1: Add the Marketplace
First, add the Pandora Marketplace to your Claude Code installation:

```bash
/plugin marketplace add pandora-marketplace
```

### Step 2: Install the Plugin
Install the Context Manager plugin from the marketplace:

```bash
/plugin install context-manager@pandora-marketplace
```

## Components

### Commands
- **init**: Initialize context templates in a new project with interactive domain selection
- **pull**: Download additional context templates from the marketplace
- **list**: Display available context templates and their status
- **update**: Sync local templates with latest marketplace versions
- **delete**: Remove context templates from your project

### Templates
- Pre-built context templates for common project structures
- Domain-specific templates for different technologies
- Organized by Core, Process, and Reference categories

## How to Use

### Initialize Context in Your Project

```bash
/context:init [target-project-path]
```

**Parameters:**
- `[target-project-path]` (optional): Path to target project directory. Defaults to current directory if not specified.

### Examples

```bash
# Initialize context in current directory
/context:init

# Initialize in specific project
/context:init /path/to/my-project

# Initialize with all available domains
/context:init . --all
```

### Other Commands

```bash
# Pull additional templates
/context:pull

# List available context templates
/context:list

# Update templates to latest versions
/context:update

# Delete specific context templates
/context:delete
```

## Workflow

1. **Initialize**: Run `context:init` in your project directory
2. **Select Templates**: Choose relevant templates for your project (Core, Process, and Reference categories)
3. **Pull Templates**: Download selected templates from marketplace
4. **Customize**: Adapt templates to your project needs
5. **Update**: Keep templates synchronized with team standards periodically

## Output Structure

After initialization, your project will have:
```
your-project/
├── .claude/
│   └── context/
│       ├── INDEX.md                 # Context index
│       ├── architecture/             # System design templates
│       ├── coding_guidelines/        # Team standards
│       ├── workflows/                # Development processes
│       └── ... (other selected domains)
└── CLAUDE.md                         # Updated with context reference
```

## Benefits
- Standardized project documentation across teams
- Reduced onboarding time for new team members
- Consistent context setup for Claude Code
- Easy template sharing and version management
- Enables context-aware AI assistance

## Use Cases
- Onboarding new projects
- Synchronizing team context standards
- Maintaining consistent documentation practices
- Sharing domain knowledge across teams
