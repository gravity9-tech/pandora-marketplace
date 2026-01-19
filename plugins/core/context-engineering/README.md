# Context Engineering Plugin

## Overview
Context Engineering is a comprehensive toolkit for analyzing and documenting your codebase architecture, tech stack, coding guidelines, and project terminology. It provides specialized commands to generate detailed context documentation that improves AI assistant understanding of your project.

## Installation

### Step 1: Add the Marketplace
First, add the Pandora Marketplace to your Claude Code installation:

```bash
/plugin marketplace add pandora-marketplace
```

### Step 2: Install the Plugin
Install the Context Engineering plugin from the marketplace:

```bash
/plugin install context-engineering@pandora-marketplace
```

## Components

### Commands
- **architecture**: Analyze and document your project's system architecture
- **tech-stack**: Identify and document technologies, frameworks, and dependencies
- **coding-guidelines**: Extract and document your project's coding standards
- **glossary**: Generate a terminology glossary for your domain
- **all**: Generate complete context documentation in one command

### Skills
- **Context Injection**: Embeds generated context into Claude Code sessions for better understanding

## How to Use

Generate comprehensive context documentation using the main command:

```bash
/context-eng:all <codebase-path> <output-directory>
```

### Parameters
- `<codebase-path>` (required): Path to the repository root directory to analyze
- `<output-directory>` (required): Parent directory where all generated context documentation will be organized

### Examples

```bash
# Generate all context documentation
/context-eng:all /path/to/repo ./docs/context

# Generate for current project
/context-eng:all . ./generated-context

# Generate for specific repository
/context-eng:all ~/projects/myapp ./context-docs
```

### Individual Commands

You can also run individual context generation commands:

```bash
# Generate glossary only
/context-eng:glossary /path/to/repo ./glossary

# Generate architecture documentation
/context-eng:architecture /path/to/repo ./architecture

# Generate coding guidelines
/context-eng:coding-guidelines /path/to/repo ./guidelines

# Generate tech stack documentation
/context-eng:tech-stack /path/to/repo ./tech-stack
```

## Output Structure

The generated documentation is organized as follows:

```
output-directory/
├── glossary/                    # Domain terminology
│   ├── architecture-terms.md
│   ├── data-model-terms.md
│   └── business-logic-terms.md
├── architecture/                # System design documentation
│   ├── system-architecture.md
│   ├── design-patterns.md
│   ├── integration-patterns.md
│   └── data-flow.md
├── guidelines/                  # Coding standards
│   ├── {language}-guidelines.md
│   ├── {framework}-guidelines.md
│   ├── testing-standards.md
│   └── code-review-checklist.md
└── tech-stack/                  # Technology documentation
    ├── tech-stack-overview.md
    ├── frontend-stack.md
    ├── backend-stack.md
    └── infrastructure-stack.md
```

## Features
- Automated architecture documentation
- Technology stack inventory
- Coding guidelines extraction
- Terminology definitions
- Batch generation of all context types
- Evidence-backed documentation

## Use Cases
- Preparing context for AI collaboration
- Onboarding documentation for new developers
- Maintaining consistent coding standards
- Knowledge management and documentation
- Creating knowledge base for team collaboration
- Generating context for Claude Code enhancement

## Context Integration

The complete generated documentation provides Claude Code with:
- **Glossary**: Shared vocabulary and domain understanding
- **Architecture**: System design patterns and component relationships
- **Guidelines**: Technology-specific best practices and quality standards
- **Tech Stack**: Complete technology inventory and capability reference

Combined, these files create a comprehensive knowledge base that enables Claude Code to:
- Make informed architectural decisions
- Follow project-specific conventions
- Maintain consistency across implementation
- Understand domain and business logic
- Apply appropriate design patterns
