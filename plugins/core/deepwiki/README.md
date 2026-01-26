# DeepWiki Plugin

Generate comprehensive documentation from your codebase and sync it to Claude Code skills for on-demand context loading.

## Overview

DeepWiki is a documentation generation system that:
1. **Initializes** wiki documentation from your codebase with evidence-backed markdown
2. **Syncs** documentation to Claude Code skills for automatic context loading
3. Enables Claude to access relevant project knowledge **on-demand** without loading everything into memory

## Installation

```bash
# Add the marketplace
claude plugins:add pandora-marketplace

# Install DeepWiki
claude plugins:install deepwiki@pandora-marketplace
```

## Commands

### `/deepwiki:init` — Initialize Wiki

Initialize comprehensive wiki documentation from a codebase with ASCII diagrams and cross-references.

```bash
/deepwiki:init <codebase_path> <wiki_location> [user_context]
```

**Parameters:**
- `codebase_path` (required): Root directory to analyze
- `wiki_location` (required): Output directory for wiki
- `user_context` (optional): Additional guidance (e.g., "e-commerce PWA")

**Examples:**
```bash
/deepwiki:init ./ ./wiki
/deepwiki:init ./ ./wiki "Microservices backend with React frontend"
```

**Behavior:**
- **Idempotent** — Does nothing if wiki already exists
- **Resumable** — Continues from where it left off if interrupted
- **Auto-syncs** — Generates skills automatically after wiki creation

**Output:**
```
./wiki/
├── README.md
├── overview/
├── architecture/
├── features/
├── development/
├── testing/
├── deployment/
└── .temp/
    ├── documentation_structure.md
    └── todo.md
```

---

### `/deepwiki:sync` — Sync Documentation to Skills

Sync documentation to Claude Code skills. Use after manually enriching wiki content, or to create skills from any markdown directory.

```bash
/deepwiki:sync <context_path> [skill_name]
```

**Parameters:**
- `context_path` (required): Directory containing markdown documentation
- `skill_name` (optional): Custom skill name (single-directory mode only)

**Examples:**
```bash
# Sync entire wiki (creates skill per subdirectory)
/deepwiki:sync ./wiki

# Sync single directory
/deepwiki:sync ./wiki/architecture

# Sync custom docs with custom name
/deepwiki:sync ./docs/team-conventions conventions
```

**Behavior:**
- **Multi-skill mode**: If path has subdirectories → one skill per subdirectory
- **Single-skill mode**: If path has no subdirectories → one skill for entire directory
- **Overwrites**: Running again updates existing skills

**Output:**
```
{home}/.claude/skills/
├── overview/SKILL.md
├── architecture/SKILL.md
├── features/SKILL.md
└── ...
```

---

## How Context Loading Works

After running `/deepwiki:init` or `/deepwiki:sync`, Claude automatically loads relevant context when you ask questions:

| You Ask | Claude Loads |
|---------|--------------|
| "How does the cart work?" | `features` skill |
| "What's the tech stack?" | `overview` skill |
| "Add a new API endpoint" | `architecture` skill |
| "Run the tests" | `testing` skill |

**Key benefits:**
- Only loads relevant context (not entire wiki)
- Skills stored in `{home}/.claude/skills/` (user home, not project)
- Claude matches questions to skills via descriptions

---

## Workflow

### Initial Setup

```bash
# 1. Generate wiki from codebase
/deepwiki:init ./ ./wiki

# Skills are automatically created at {home}/.claude/skills/
```

### After Manual Edits

```bash
# 2. User manually enriches ./wiki/architecture/patterns.md

# 3. Sync changes to skills
/deepwiki:sync ./wiki
```

### Adding Custom Context

```bash
# Create custom documentation
mkdir -p ./docs/team-decisions
echo "# Our Conventions\n..." > ./docs/team-decisions/coding-style.md

# Sync to skills
/deepwiki:sync ./docs/team-decisions decisions
```

---

## Components

### Agents

| Agent | Purpose |
|-------|---------|
| `deepwiki-planner` | Analyzes codebase, generates documentation structure |
| `deepwiki-doc-generator` | Generates individual wiki pages with diagrams |
| `deepwiki-skill-generator` | Creates Claude Code skills from wiki |

### Skills (Internal)

Used by agents during documentation generation:
- `codebase-analysis-patterns` — Framework for analyzing codebases
- `documentation-structure-patterns` — Documentation organization patterns
- `generating-ascii-diagrams` — ASCII diagram templates (C4, sequence, etc.)
- `evidence-citation` — Source citation guidelines
- `doc-generator-output-templates` — Output formatting
- `documentation-quality-checklist` — Quality validation
- `planner-output-templates` — Structure file formatting

---

## Output Structure

### Wiki Structure

```
wiki/
├── README.md                    # Navigation hub
├── overview/
│   ├── system-overview.md
│   ├── technology-stack.md
│   └── glossary.md
├── architecture/
│   ├── system-architecture.md
│   ├── frontend-architecture.md
│   ├── backend-architecture.md
│   ├── data-model.md
│   └── api-design.md
├── features/
│   └── [feature-name].md
├── development/
│   ├── getting-started.md
│   ├── local-setup.md
│   ├── coding-standards.md
│   └── makefile-commands.md
├── testing/
│   ├── testing-strategy.md
│   └── running-tests.md
├── deployment/
│   ├── build-process.md
│   └── environments.md
└── .temp/
    ├── documentation_structure.md
    └── todo.md
```

### Generated Skills

```
{home}/.claude/skills/
├── overview/SKILL.md
├── architecture/SKILL.md
├── features/SKILL.md
├── development/SKILL.md
├── testing/SKILL.md
└── deployment/SKILL.md
```

---

## Use Cases

1. **New project documentation** — Generate comprehensive docs from existing codebase
2. **Team onboarding** — Create knowledge base for new team members
3. **AI-assisted development** — Give Claude deep project context on-demand
4. **Architecture visualization** — Generate ASCII diagrams of system design
5. **Living documentation** — Keep docs in sync with code changes
