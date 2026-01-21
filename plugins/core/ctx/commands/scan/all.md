---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [codebase-path] [output-directory]
description: Generate comprehensive context engineering documentation by running all context-eng commands
---

## Purpose

Execute all context engineering commands in sequence to generate a complete knowledge base for Claude Code. This command orchestrates glossary, architecture, coding guidelines, and tech stack documentation generation from a single invocation.

## Parameters

- `$1` (codebase-path): Path to the repository root directory to analyze
- `$2` (output-directory): Parent directory where all generated context documentation will be organized

## Execution Flow

This command will run the following slash commands sequentially, passing both parameters to each:

### 1. Generate Glossary
**Command**: `/context-eng:glossary $1 $2/glossary`

Extracts domain-specific terms and definitions from the codebase. Creates a structured glossary organized by concept categories.

**Output**: `$2/glossary/` directory

### 2. Generate Architecture Documentation
**Command**: `/context-eng:architecture $1 $2/architecture`

Analyzes system structure, design patterns, and architectural decisions. Produces comprehensive architecture documentation.

**Output**: `$2/architecture/` directory

### 3. Generate Coding Guidelines
**Command**: `/context-eng:coding-guidelines $1 $2/guidelines`

Detects technologies and generates tailored coding guidelines, best practices, and quality standards for each.

**Output**: `$2/guidelines/` directory

### 4. Generate Tech Stack Documentation
**Command**: `/context-eng:tech-stack $1 $2/tech-stack`

Identifies all technologies, frameworks, and infrastructure components. Produces detailed tech stack documentation.

**Output**: `$2/tech-stack/` directory

## Directory Structure

The command will organize generated documentation as follows:

```
$2/
├── glossary/
│   ├── architecture-terms.md
│   ├── data-model-terms.md
│   ├── business-logic-terms.md
│   └── ... (category-based glossary files)
├── architecture/
│   ├── system-architecture.md
│   ├── design-patterns.md
│   ├── integration-patterns.md
│   ├── data-flow.md
│   └── ... (architecture documentation)
├── guidelines/
│   ├── {language}-guidelines.md
│   ├── {framework}-guidelines.md
│   ├── testing-standards.md
│   ├── code-review-checklist.md
│   └── ... (technology-specific guidelines)
└── tech-stack/
    ├── tech-stack-overview.md
    ├── frontend-stack.md
    ├── backend-stack.md
    ├── infrastructure-stack.md
    └── ... (tech stack documentation)
```

## Progress Reporting

The command will report progress as follows:

```
Starting Context Engineering Documentation Generation
================================================

Repository: $1
Output Directory: $2

[1/4] Generating Glossary...
      Command: /context-eng:glossary $1 $2/glossary
      Status: Running...
      Status: ✓ Complete

[2/4] Generating Architecture Documentation...
      Command: /context-eng:architecture $1 $2/architecture
      Status: Running...
      Status: ✓ Complete

[3/4] Generating Coding Guidelines...
      Command: /context-eng:coding-guidelines $1 $2/guidelines
      Status: Running...
      Status: ✓ Complete

[4/4] Generating Tech Stack Documentation...
      Command: /context-eng:tech-stack $1 $2/tech-stack
      Status: Running...
      Status: ✓ Complete

================================================
Context Engineering Complete
All documentation generated in: $2
```

## Usage

```bash
/context-eng:all /path/to/repo ./docs/context
/context-eng:all . ./generated-context
```

## Output Summary

Upon completion, you'll have:

- **Glossary** (glossary/): Domain-specific terms and definitions organized by concept
- **Architecture** (architecture/): System design, patterns, decisions, and data flow
- **Guidelines** (guidelines/): Coding standards, best practices, and quality checklists
- **Tech Stack** (tech-stack/): Technology inventory and dependencies documentation

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
- Integrate with existing infrastructure
- Follow quality and testing standards

## Prerequisites

All referenced slash commands must be available:
- `/context-eng:glossary`
- `/context-eng:architecture`
- `/context-eng:coding-guidelines`
- `/context-eng:tech-stack`

## Notes

- Commands execute sequentially; each must complete before the next begins
- All output directories are automatically created if they don't exist
- Existing files in output directories may be overwritten
- Generation time depends on codebase size and complexity
- Each sub-command can also be run independently for targeted documentation
