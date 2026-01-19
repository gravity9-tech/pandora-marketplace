# DeepWiki Plugin

## Overview
DeepWiki is a comprehensive documentation generation system that automatically analyzes your codebase structure and generates evidence-backed, well-organized markdown documentation. It creates detailed documentation with ASCII diagrams and automatic cross-references to help your team understand your project architecture.

## Installation

### Step 1: Add the Marketplace
First, add the Pandora Marketplace to your Claude Code installation:

```bash
/plugin marketplace add pandora-marketplace
```

### Step 2: Install the Plugin
Install the DeepWiki plugin from the marketplace:

```bash
/plugin install deepwiki@pandora-marketplace
```

## Components

### Agents
- **DeepWiki Planner**: Orchestrates the documentation generation workflow by analyzing project structure and planning documentation scope
- **DeepWiki Doc Generator**: Generates comprehensive markdown documentation with cross-references and structured content

### Commands
- **deepwiki**: Main command to generate complete codebase documentation

### Skills
- **Generating ASCII Diagrams**: Creates visual representations including:
  - Component diagrams
  - Class diagrams
  - Data flow diagrams
  - C4 architecture diagrams
  - Deployment diagrams
  - Integration diagrams
  - Sequence diagrams

## How to Use

After installation, invoke the DeepWiki command to generate documentation:

```bash
/deepwiki <codebase_path> <wiki_location> [user_context]
```

### Parameters
- `<codebase_path>` (required): Root directory to analyze (e.g., `./`, `/path/to/project`)
- `<wiki_location>` (required): Output directory for generated wiki (e.g., `./wiki`, `./docs`)
- `[user_context]` (optional): Additional guidance for documentation generation (e.g., "small e-commerce PWA")

### Examples

```bash
# Generate documentation for current project
/deepwiki ./ ./wiki

# Generate documentation with custom context
/deepwiki /path/to/repo /path/to/repo/wiki "Microservices backend"

# Generate for specific project
/deepwiki ./myproject ./myproject/docs "React PWA"
```

## Output Structure

The generated documentation includes:
- System overview and technology stack documentation
- Architecture and component descriptions
- ASCII diagrams for system visualization
- Cross-referenced documentation pages
- Completion tracking via todo lists

## Use Cases
- Creating project documentation from existing codebase
- Visualizing system architecture and components
- Onboarding new team members
- Maintaining up-to-date technical documentation
- Generating knowledge base for AI assistance
