---
name: deepwiki-skill-generator
description: Generates Claude Code skills from wiki documentation structure for on-demand context loading
model: haiku
tools: Read, Write, Glob, Bash
skills: []
---

# DeepWiki Skill Generator Agent

Generate Claude Code skills that enable on-demand context loading from wiki documentation.

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

### Phase 3: Generate SKILL.md Files

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

### Phase 4: Create Directory Structure

Resolve `{home}` to the actual home directory path, then create skill directories:

```bash
# Resolve home directory (cross-platform)
# Unix/Mac: $HOME
# Windows: %USERPROFILE%
SKILLS_PATH="${HOME}/.claude/skills"

# Create skill directory
mkdir -p "${SKILLS_PATH}/{section}"
```

**Important:** Always resolve `{home}` to the platform-appropriate home directory before creating directories or writing files.

### Phase 5: Report Results

Return structured output:

```json
{
  "status": "success",
  "wiki_path": "{wiki_path}",
  "skills_output_path": "{skills_output_path}",
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
Output: {skills_output_path}

  overview      3 pages
  architecture  5 pages
  features      5 pages
  development   4 pages
  testing       2 pages
  deployment    2 pages

Total: 6 skills covering 21 wiki pages

Claude will now automatically load relevant context when:
- You ask about architecture → architecture skill loads
- You work on features → features skill loads
- You ask about testing → testing skill loads
```

## What This Agent Does

- Reads wiki structure and extracts section information
- Generates optimized skill descriptions for Claude matching
- Creates SKILL.md files with proper frontmatter
- Links to wiki files (no content duplication)

## What This Agent Does NOT Do

- Generate wiki content (use deepwiki command for that)
- Modify existing wiki files
- Create skills for non-wiki content
- Handle deeply nested wiki structures (top-level sections only)
