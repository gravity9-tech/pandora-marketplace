---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [repo-path] [output-path]
description: Extract domain-specific terms from codebase and generate a grouped glossary in Markdown
---

## Purpose

Scan a repository and extract a comprehensive glossary of domain-specific terms, definitions, and architectural concepts. The glossary is organized by concept category and saved to a Markdown file for reference during development.

## Parameters

- `$1` (repo-path): Path to the repository root directory to scan
- `$2` (output-path): Target file path where the Markdown glossary will be saved (e.g., `./glossary.md`)

## Scanning Strategy

### Files to Include
- Python files (`.py`): Classes, functions, constants, docstrings
- JavaScript/TypeScript (`.js`, `.ts`): Classes, functions, constants, JSDoc comments
- Configuration (`.json`, `.yaml`, `.yml`, `.toml`): Settings and constants
- Documentation (`.md`, `README.md`, `CLAUDE.md`): Domain concepts and explanations

### Files to Skip
- Node modules, venv, build artifacts
- Minified or compiled files
- Binary files and images

### Extraction Methods
1. **Classes & Functions**: Extract names and extract definitions from docstrings/comments
2. **Constants**: Capture UPPER_SNAKE_CASE identifiers with nearby documentation
3. **Type Definitions**: Extract Pydantic models, TypeScript interfaces, type hints
4. **Comments**: Parse docstrings and inline comments describing intent
5. **README Content**: Extract feature descriptions and architectural terms

## Concept Grouping

Automatically categorize extracted terms into:
- **Architecture**: Patterns, design decisions, system layers
- **Data Models**: Classes, entities, type definitions
- **API & Endpoints**: Routes, HTTP methods, request/response structures
- **Business Logic**: Domain rules, operations, workflows
- **Frontend**: Components, UI states, interactions
- **Backend**: Server logic, processing, storage
- **Utilities**: Helper functions, shared tools
- **Configuration**: Settings, environment variables, constants
- **External Services**: Third-party integrations, libraries

## Output Format

Generate a well-structured Markdown glossary:

```markdown
# Codebase Glossary

Auto-generated glossary extracted from repository structure.

## [Concept Category]

### Term Name
**Definition**: [Extracted definition from code/documentation]

**Context**: Where this term is used or why it matters

**References**: Related terms or files

---

## [Another Concept Category]

### Another Term
**Definition**: [Definition]

**Context**: [Context]

**References**: [Related terms]
```

## Execution Steps

1. Scan repository at `$1` for relevant files
2. Extract terms, definitions, and context from code and documentation
3. Identify concept groupings based on term relationships
4. Generate Markdown glossary organized by concept
5. Write output to `$2`
6. Report extraction statistics (terms found, categories created)

## Example Usage

```bash
/glossary /path/to/repo ./glossary.md
/glossary . ./docs/glossary.md
```

## Output Contains

- Term name and concise definition
- Context explaining where/how term is used
- Related terms for cross-reference
- File references showing where term originates
- Clear concept-based grouping

This glossary becomes shared context for Claude Code during development, improving code understanding and consistency.
