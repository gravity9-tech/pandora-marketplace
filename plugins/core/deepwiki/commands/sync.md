---
description: Sync documentation to Claude Code skills for on-demand context loading. Regenerates skills from wiki or any markdown directory.
argument-hint: <context_path> [skill_name]
allowed-tools: Read, Write, Bash, Glob
model: haiku
---

# DeepWiki Sync Command

Sync documentation to Claude Code skills. Use this to regenerate skills after manually enriching wiki content, or to create skills from any markdown directory structure.

## Input Parameters

- **Argument 1** (`$1` - required): `context_path` - Directory containing markdown documentation
- **Argument 2** (`$2` - optional): `skill_name` - Custom skill name (only for single-directory mode)

## Behavior

### Mode Detection

Check if `{context_path}` contains subdirectories (excluding `.temp`):

```bash
find {context_path} -mindepth 1 -maxdepth 1 -type d ! -name '.temp' | wc -l
```

- **If subdirectories exist** → Multi-skill mode (one skill per subdirectory)
- **If no subdirectories** → Single-skill mode (one skill for the entire directory)

---

### Multi-Skill Mode

When `{context_path}` has subdirectories (e.g., `./wiki/` with `overview/`, `architecture/`, etc.):

1. **Discover sections:**
   ```bash
   find {context_path} -mindepth 1 -maxdepth 1 -type d ! -name '.temp' | sort
   ```

2. **For each section directory**, generate a skill:
   - Skill name: `{section_name}`
   - Skill path: `{home}/.claude/skills/{section_name}/SKILL.md`

3. **Generate SKILL.md** for each section using the template below

4. **Display results:**
   ```
   ✓ Skills synced from {context_path}

     overview       3 files
     architecture   5 files
     features       5 files
     ...

   Location: {home}/.claude/skills/
   ```

---

### Single-Skill Mode

When `{context_path}` has no subdirectories (e.g., `./wiki/my-custom-context/`):

1. **Determine skill name:**
   - If `$2` provided: use `{$2}`
   - Otherwise: use `{directory_name}`

2. **List all markdown files:**
   ```bash
   find {context_path} -name "*.md" -type f | sort
   ```

3. **Generate single SKILL.md** at `{home}/.claude/skills/{name}/SKILL.md`

4. **Display results:**
   ```
   ✓ Skill synced from {context_path}

     {name}   {N} files

   Location: {home}/.claude/skills/{name}/
   ```

---

## SKILL.md Template

```markdown
---
name: {section}
description: {generated_description}
user-invocable: false
allowed-tools: Read, Glob
---

# {Section Title} Context

This skill provides context from the project documentation.

## Available Documentation

Read the following files from `{relative_context_path}/{section}/` for context:

| File | Purpose |
|------|---------|
| {filename} | {file_purpose} |
...

## When to Use

- {trigger_1}
- {trigger_2}
- {trigger_3}

## Instructions

1. Read the relevant file(s) based on the user's question
2. Use this context to inform your response
3. Maintain consistency with documented patterns
```

### Description Generation

Generate descriptions based on section name patterns:

| Pattern | Description |
|---------|-------------|
| `overview*` | System overview, technology stack, and domain glossary. Use when understanding project purpose or tech stack. |
| `architect*` | System architecture, component relationships, and design patterns. Use when making architectural decisions. |
| `feature*` | Feature documentation and behavior. Use when working on or understanding existing features. |
| `develop*` | Development setup, coding standards, and workflows. Use when setting up or following conventions. |
| `test*` | Testing strategy and execution. Use when writing or running tests. |
| `deploy*` | Build process and environments. Use when building for production or configuring deployments. |
| `domain*` | Business domain knowledge. Use when understanding business requirements or terminology. |
| `service*` | Service documentation. Use when working on specific services or understanding boundaries. |
| `integrat*` | External integrations. Use when working with third-party services or APIs. |
| `security*` | Security patterns and configurations. Use when handling auth, secrets, or security concerns. |
| `operat*` | Operations and monitoring. Use when dealing with logs, metrics, or incident response. |
| `api*` | API documentation and endpoints. Use when working with or designing APIs. |
| `data*` | Data models and database schemas. Use when working with data structures. |
| (other) | `{Section name} documentation. Use when working on {section name} related tasks.` |

### File Purpose Extraction

For each markdown file:
1. Try to read YAML front matter `description` field
2. If not found, convert filename from kebab-case to sentence case

### When to Use Generation

Based on section type, generate 3-5 relevant trigger scenarios.

---

## Example Usage

```bash
# Sync all sections from a wiki
/deepwiki:sync ./wiki

# Sync a single custom context directory
/deepwiki:sync ./docs/my-custom-context

# Sync with custom skill name
/deepwiki:sync ./notes/project-decisions decisions
```

## Use Cases

1. **After manual edits:** User enriches wiki content, runs `/deepwiki:sync ./wiki` to update skills

2. **Custom context:** User creates `./docs/team-conventions/` with markdown files, runs `/deepwiki:sync ./docs/team-conventions conventions`

3. **Partial update:** User updates only architecture docs, runs `/deepwiki:sync ./wiki/architecture` to regenerate just that skill

4. **Non-wiki content:** User has existing markdown docs in `./documentation/`, runs `/deepwiki:sync ./documentation` to create skills from it

## Notes

- Skills are always written to `{home}/.claude/skills/` (user home, not project)
- Running again overwrites existing skills with same names
- Excludes `.temp/` directories
- Only processes `.md` files
