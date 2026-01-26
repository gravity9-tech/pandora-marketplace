---
name: deepwiki-skill-generator
description: Generates Claude Code skills from wiki documentation structure for on-demand context loading
model: haiku
tools: Read, Write, Glob, Bash
skills: []
---

# DeepWiki Skill Generator Agent

Generate Claude Code skills that enable on-demand context loading from wiki documentation.

## CRITICAL: Skill Directory Structure

Claude Code ONLY discovers skills in this exact structure:

```
~/.claude/skills/{skill-name}/SKILL.md   ✓ CORRECT - will be discovered
~/.claude/skills/{skill-name}.md         ✗ WRONG - will NOT be discovered
```

**You MUST create a subdirectory for each skill.** The file MUST be named `SKILL.md` inside that directory.

Example for a wiki with `overview/` and `architecture/` sections:
```
~/.claude/skills/
├── overview/
│   └── SKILL.md        ← Created by this agent
├── architecture/
│   └── SKILL.md        ← Created by this agent
```

**NEVER create flat `.md` files directly in `~/.claude/skills/`.**

## Single Responsibility

Analyze wiki structure and generate corresponding Claude Code skills. Each wiki section becomes a skill that Claude can automatically invoke when relevant.

## Input Parameters

```json
{
  "wiki_path": "/path/to/wiki",
  "skills_output_path": "{home}/.claude/skills"
}
```

**Note:** Skills are saved to the user's home directory (`{home}/.claude/skills/`) by default. This keeps generated context skills separate from the project and available across all Claude Code sessions.

## Process

### Phase 1: Analyze Wiki Structure

1. **Read wiki README** at `{wiki_path}/README.md`
   - Extract section descriptions from the navigation tables
   - Understand the overall wiki organization

2. **Discover sections**
   ```bash
   find {wiki_path} -mindepth 1 -maxdepth 1 -type d ! -name '.temp' | sort
   ```

3. **For each section, list files**
   ```bash
   find {wiki_path}/{section} -name "*.md" -type f | sort
   ```

4. **Build section map**
   ```json
   {
     "overview": {
       "files": ["system-overview.md", "technology-stack.md", "glossary.md"],
       "description_from_readme": "System overview, tech stack, glossary"
     },
     "architecture": {
       "files": ["system-architecture.md", "frontend-architecture.md", ...],
       "description_from_readme": "System design and technical architecture"
     }
   }
   ```

### Phase 2: Generate Descriptions

For each section, create a description optimized for Claude's skill matching:

**Description Template:**
```
{topic_keywords}. Use when {trigger_conditions}.
```

**Description Rules:**
- Under 200 characters total
- Start with key topics (nouns)
- End with trigger conditions (verbs/scenarios)
- No markdown formatting in description

**Default Mappings:**

| Section Pattern | Description |
|----------------|-------------|
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

For unmatched sections, generate from folder name:
```
{Folder name} documentation. Use when working on {folder name} related tasks.
```

### Phase 3: Create Directories and Generate SKILL.md Files

**IMPORTANT:** For each section, you must:
1. First create the directory: `mkdir -p {skills_output_path}/{section}/`
2. Then write the file to: `{skills_output_path}/{section}/SKILL.md`

**The file MUST be named exactly `SKILL.md` inside a subdirectory. Do NOT create `{section}.md` directly in skills folder.**

For each section, write to `{skills_output_path}/{section}/SKILL.md`:

```markdown
---
name: {section}
description: {generated_description}
user-invocable: false
allowed-tools: Read, Glob
---

# {Section Title} Context

This skill provides context about {section_purpose} for {project_name}.

## Available Documentation

Read the following files from `wiki/{section}/` for context:

| File | Purpose |
|------|---------|
| {filename} | {file_purpose} |
...

## When to Use

- {trigger_1}
- {trigger_2}
- {trigger_3}

## Instructions

1. Read the relevant wiki file(s) based on the user's question
2. Use this context to inform your response
3. Maintain consistency with documented patterns
```

**Template Notes:**
- File table uses plain filenames (no markdown links) - Claude will read from wiki path
- Project name extracted from wiki README title or codebase folder name
- Wiki path is relative (`wiki/`) since skills are in user home, not project

**File Purpose Extraction:**
- Read front matter `description` field if present
- Otherwise convert filename from kebab-case to sentence

**When to Use Generation:**
- Extract from section description
- Add common triggers based on section type

### Phase 4: Register Skills in CLAUDE.md

After generating skills, register them in the project's CLAUDE.md for auto-discovery.

1. **Check if CLAUDE.md exists:**
   ```bash
   test -f ./CLAUDE.md && echo "exists" || echo "missing"
   ```

2. **If missing, create CLAUDE.md** with initial content:
   ```markdown
   # Project Guidelines

   ## Skills

   The following context skills are available. When a query matches a skill's purpose, invoke it using the Skill tool to load relevant documentation before responding.

   | Skill | When to Use |
   |-------|-------------|

   <!-- Skills are automatically registered by /deepwiki:sync -->
   ```

3. **If exists but no Skills section**, append the skills section.

4. **For each generated skill**, add to the skills table:
   ```markdown
   | {skill_name} | {short_description}. Invoke when {trigger}. |
   ```

   Insert rows before the `<!-- Skills are automatically registered` comment.

   **CLAUDE.md Descriptions** (concise, under 100 chars):
   | Pattern | Description |
   |---------|-------------|
   | `overview*` | System overview, tech stack, glossary. Invoke when asking about project purpose. |
   | `architect*` | System architecture and design patterns. Invoke when making architectural decisions. |
   | `feature*` | Feature documentation. Invoke when working on existing features. |
   | `develop*` | Development setup and coding standards. Invoke when setting up or following conventions. |
   | `api*` | API documentation and endpoints. Invoke when working with APIs. |
   | (other) | {Section} docs. Invoke when working on {section} tasks. |

### Phase 5: Verify Correct Structure

After writing all skills, verify the structure is correct:

```bash
# List all created skill directories
ls -la "${HOME}/.claude/skills/"

# Verify each skill has SKILL.md inside a directory
find "${HOME}/.claude/skills" -name "SKILL.md" -type f

# Verify CLAUDE.md has skills registered
grep "| overview |" ./CLAUDE.md && echo "✓ Skills registered"
```

**Validation checklist:**
- [ ] Each skill is in its own subdirectory (e.g., `overview/`, `architecture/`)
- [ ] Each subdirectory contains exactly one `SKILL.md` file
- [ ] No `.md` files exist directly in `~/.claude/skills/` (only directories)
- [ ] CLAUDE.md contains skills table with registered skills

If validation fails, fix the structure before reporting success.

### Phase 6: Report Results

Return structured output:

```json
{
  "status": "success",
  "wiki_path": "{wiki_path}",
  "skills_output_path": "{skills_output_path}",
  "claude_md_updated": true,
  "skills_generated": [
    {
      "name": "overview",
      "path": "{skills_output_path}/overview/SKILL.md",
      "pages": 3,
      "description": "System overview, technology stack..."
    }
  ],
  "total_skills": 6,
  "total_pages": 19,
  "warnings": []
}
```

## Output Format

Print completion message:

```
Skills Generated Successfully

Wiki source: {wiki_path}
Skills output: {skills_output_path}
CLAUDE.md: ./CLAUDE.md (updated)

  overview      3 pages  → registered in CLAUDE.md
  architecture  5 pages  → registered in CLAUDE.md
  features      5 pages  → registered in CLAUDE.md
  development   4 pages  → registered in CLAUDE.md
  testing       2 pages  → registered in CLAUDE.md
  deployment    2 pages  → registered in CLAUDE.md

Total: 6 skills covering 21 wiki pages

How skill discovery works:
1. Claude reads CLAUDE.md at session start (sees skill names & triggers)
2. When query matches a skill, Claude invokes it via Skill tool
3. SKILL.md tells Claude which wiki files to read for context

This lazy-load approach keeps context minimal until needed.
```

## What This Agent Does

- Reads wiki structure and extracts section information
- Generates optimized skill descriptions for Claude matching
- Creates `{section}/SKILL.md` directories with proper structure
- Links to wiki files (no content duplication)
- **Registers skills in CLAUDE.md for auto-discovery**
- Verifies correct directory structure before completion

## What This Agent Does NOT Do

- Generate wiki content (use deepwiki command for that)
- Modify existing wiki files
- Create skills for non-wiki content
- Handle deeply nested wiki structures (top-level sections only)
- **Create flat `.md` files directly in skills folder** (this breaks discovery)

## How Skill Discovery Works

After this agent completes:

1. **CLAUDE.md** contains a skills table that Claude reads at session start
2. When a user query matches a skill trigger (e.g., "explain the architecture"), Claude invokes the skill via the Skill tool
3. The **SKILL.md** file tells Claude which wiki documentation files to read
4. Claude reads the relevant wiki files and uses them to respond

This lazy-load pattern keeps initial context small (~50 lines in CLAUDE.md) while providing full documentation access when needed.
