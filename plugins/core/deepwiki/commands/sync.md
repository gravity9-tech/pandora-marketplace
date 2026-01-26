---
description: Sync documentation to Claude Code skills for on-demand context loading. Regenerates skills from wiki or any markdown directory.
argument-hint: <context_path> [skill_name]
allowed-tools: Read, Write, Bash, Glob
model: haiku
---

# DeepWiki Sync Command

Sync documentation to Claude Code skills. Use this to regenerate skills after manually enriching wiki content, or to create skills from any markdown directory structure.

## CRITICAL: Skill Directory Structure

Claude Code ONLY discovers skills in this exact structure:

```
~/.claude/skills/{skill-name}/SKILL.md   ✓ CORRECT - will be discovered
~/.claude/skills/{skill-name}.md         ✗ WRONG - will NOT be discovered
```

**You MUST create a subdirectory for each skill.** Always use:
1. `mkdir -p ~/.claude/skills/{skill-name}/`
2. Write to `~/.claude/skills/{skill-name}/SKILL.md`

**NEVER create flat `.md` files directly in `~/.claude/skills/`.**

## Input Parameters

- **Argument 1** (`$1` - required): `context_path` - Directory containing markdown documentation
- **Argument 2** (`$2` - optional): `skill_name` - Custom skill name (only for single-directory mode)

---

## Phase 0: CLAUDE.md Check

Before syncing skills, ensure CLAUDE.md exists so skills are discoverable.

### Check for CLAUDE.md

```bash
test -f ./CLAUDE.md && echo "exists" || echo "missing"
```

### If CLAUDE.md is missing

Display warning and create initial CLAUDE.md:

```
⚠ CLAUDE.md not found in project root.

Creating CLAUDE.md with skills section...
```

Create `./CLAUDE.md` with initial content:

```markdown
# Project Guidelines

## Skills

The following context skills are available. When a query matches a skill's purpose, invoke it using the Skill tool to load relevant documentation before responding.

| Skill | When to Use |
|-------|-------------|

<!-- Skills are automatically registered by /deepwiki:sync -->
```

### If CLAUDE.md exists but has no Skills section

Check if CLAUDE.md contains a `## Skills` section:

```bash
grep -q "## Skills" ./CLAUDE.md && echo "has_skills" || echo "no_skills"
```

If no Skills section exists, append it to CLAUDE.md:

```markdown

## Skills

The following context skills are available. When a query matches a skill's purpose, invoke it using the Skill tool to load relevant documentation before responding.

| Skill | When to Use |
|-------|-------------|

<!-- Skills are automatically registered by /deepwiki:sync -->
```

---

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

4. **Register each skill in CLAUDE.md** (see Phase 2)

5. **Display results:**
   ```
   ✓ Skills synced from {context_path}

     overview       3 files  → registered in CLAUDE.md
     architecture   5 files  → registered in CLAUDE.md
     features       5 files  → registered in CLAUDE.md
     ...

   Skills location: {home}/.claude/skills/
   CLAUDE.md updated: ./CLAUDE.md
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

4. **Register skill in CLAUDE.md** (see Phase 2)

5. **Display results:**
   ```
   ✓ Skill synced from {context_path}

     {name}   {N} files  → registered in CLAUDE.md

   Skill location: {home}/.claude/skills/{name}/
   CLAUDE.md updated: ./CLAUDE.md
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

## Phase 2: Register Skills in CLAUDE.md

After generating each skill, register it in CLAUDE.md so Claude auto-discovers it.

### For Each Skill Generated

1. **Read current CLAUDE.md content**

2. **Check if skill already registered:**
   ```bash
   grep -q "| ${skill_name} |" ./CLAUDE.md && echo "registered" || echo "not_registered"
   ```

3. **If not registered, add to skills table:**

   Find the line containing `<!-- Skills are automatically registered` and insert the skill row before it:

   ```markdown
   | {skill_name} | {skill_description} |
   ```

   Example skill rows:
   ```markdown
   | overview | System overview, tech stack, glossary. Invoke when asking about project purpose or technologies. |
   | architecture | System architecture and design patterns. Invoke when making architectural decisions. |
   | features | Feature documentation. Invoke when working on or understanding existing features. |
   | development | Development setup and coding standards. Invoke when setting up environment or following conventions. |
   | api | API documentation and endpoints. Invoke when working with APIs. |
   ```

4. **If skill already registered, update the description** (in case it changed)

### CLAUDE.md Skills Table Format

The skills table in CLAUDE.md should look like:

```markdown
## Skills

The following context skills are available. When a query matches a skill's purpose, invoke it using the Skill tool to load relevant documentation before responding.

| Skill | When to Use |
|-------|-------------|
| overview | System overview, tech stack, glossary. Invoke when asking about project purpose or technologies. |
| architecture | System architecture and design patterns. Invoke when making architectural decisions. |
| features | Feature documentation. Invoke when working on or understanding existing features. |
<!-- Skills are automatically registered by /deepwiki:sync -->
```

### Skill Description for CLAUDE.md

Generate a concise "When to Use" description (under 100 chars):

| Pattern | CLAUDE.md Description |
|---------|----------------------|
| `overview*` | System overview, tech stack, glossary. Invoke when asking about project purpose or technologies. |
| `architect*` | System architecture and design patterns. Invoke when making architectural decisions. |
| `feature*` | Feature documentation. Invoke when working on or understanding existing features. |
| `develop*` | Development setup and coding standards. Invoke when setting up environment or following conventions. |
| `test*` | Testing strategy. Invoke when writing or running tests. |
| `deploy*` | Deployment and environments. Invoke when building or deploying. |
| `api*` | API documentation and endpoints. Invoke when working with APIs. |
| (other) | {Section name} docs. Invoke when working on {section name} tasks. |

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

- Skills are always written to `{home}/.claude/skills/{name}/SKILL.md` (subdirectory required)
- Running again overwrites existing skills with same names
- Excludes `.temp/` directories
- Only processes `.md` files
- CLAUDE.md is created if missing, or updated if it exists
- Skills are registered in CLAUDE.md for auto-discovery

## Verification

After writing skills, verify the structure is correct:

```bash
# Should show directories, NOT .md files
ls -la ~/.claude/skills/

# Should list SKILL.md files inside subdirectories
find ~/.claude/skills -name "SKILL.md" -type f

# Verify CLAUDE.md has skills registered
grep "| overview |" ./CLAUDE.md && echo "✓ Skills registered in CLAUDE.md"
```

If you see `.md` files directly in `~/.claude/skills/` (not inside subdirectories), the structure is wrong and skills will not be discovered.

## How Skill Discovery Works

After sync completes, Claude discovers skills through two mechanisms:

1. **CLAUDE.md Skills Table**: Claude reads CLAUDE.md at session start and sees the skills table, which tells it which skills exist and when to use them.

2. **Lazy Loading**: When Claude identifies a matching query (e.g., "explain the architecture"), it invokes the skill using the Skill tool. The skill's SKILL.md tells Claude which documentation files to read.

This two-step approach keeps context minimal until needed:
- CLAUDE.md: ~50 lines (just skill names and triggers)
- SKILL.md: Loaded on-demand with file references
- Wiki docs: Read only when the skill is invoked
