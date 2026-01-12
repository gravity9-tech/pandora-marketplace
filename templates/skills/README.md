# Skills

This folder contains template and an example of reusable Agent Skills for Claude Code.

## What are Skills?

Skills are modular capabilities that teach Claude domain-specific expertise, workflows, and best practices. Unlike one-off prompts, Skills persist across conversations and are automatically applied when relevant to a task. They specialize Claude for your specific needs—whether that's code review standards, document generation, database queries, or custom workflows.

## Purpose

Skills enable you to:
- **Teach Claude** your team's standards, processes, and domain knowledge
- **Eliminate repetition** by creating guidance once, applying it automatically across conversations
- **Compose capabilities** by combining multiple Skills for complex workflows
- **Maintain consistency** across projects and team members

## Skill Structure

Every Skill requires a `SKILL.md` file with:

```yaml
---
name: your-skill-name
description: What this skill does and when to use it (max 1024 chars)
---

# Your Skill Name

## Instructions
[Clear guidance for Claude on how to complete tasks with this skill]

## Examples
[Concrete examples of using this skill]
```

**File Requirements:**
- Filename: `SKILL.md` (case-sensitive)
- Name: Lowercase, alphanumeric with hyphens, max 64 characters
- Description: Non-empty, max 1024 characters, clearly states both what it does and when to use it

**Optional Directory Structure:**
```
your-skill/
├── SKILL.md (main instructions)
├── REFERENCE.md (detailed documentation)
├── EXAMPLES.md (additional examples)
└── scripts/
    └── utility.py (helper scripts)
```

## How Skills Work

Skills use **progressive disclosure** architecture—Claude only loads content as needed:

1. **Metadata (Always loaded)** - YAML frontmatter for discovery (~100 tokens)
2. **Instructions (Loaded when triggered)** - SKILL.md body (~5k tokens)
3. **Resources (On-demand)** - Bundled files and scripts loaded only when needed (no context penalty)

This means you can bundle extensive reference materials, code examples, and resources with zero context cost—Claude only loads what's relevant for each task.

## Creating Skills

1. **Create SKILL.md** with required YAML frontmatter and instructions
2. **Write clear guidance** - Explain what problem the Skill solves and how Claude should approach it
3. **(Optional) Add supporting files** - Reference materials, scripts, examples
4. **Use progressive loading** - Put commonly-needed content in SKILL.md, reference specialized content in supporting files

## Best Practices

**Description Design:**
- Include both what the Skill does AND when Claude should use it
- Make trigger conditions explicit
- Use domain-specific keywords

**Instruction Writing:**
- Provide step-by-step guidance and workflows
- Include decision trees for complex tasks
- Explain constraints and edge cases
- Reference bundled files clearly
- Keep under 500 lines for optimal performance

**Bundled Content:**
- Use executable scripts for deterministic operations
- Include reference materials (schemas, templates, standards)
- Organize files logically (scripts/, references/)
- Script output only consumes tokens, not the code itself

**Progressive Loading:**
- Put essential content in SKILL.md
- Reference specialized content in supporting files
- Include extensive resources without context impact

## Template

The **`skill-template.md`** file provides a standard structure for creating new Skills. Use it as a starting point and customize it for your specific use case.

## Examples

Consider these use cases for Skills:
- **Code Review**: Team-specific code review standards and best practices
- **Document Generation**: Company branding, templates, and style guides
- **Database Operations**: Organization-specific schema and query patterns
- **Workflow Automation**: Commit message formats, issue templates, release procedures
- **Data Processing**: Custom analysis workflows and validation scripts

## Security

- Use Skills only from trusted sources
- Audit all files before deployment (SKILL.md, scripts, resources)
- Be cautious with Skills that access sensitive data
- Verify that Skills do what they claim to do

## Learn More

For comprehensive guidance on creating and deploying Skills, refer to the official Anthropic documentation:
- [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Agent Skills - Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Introducing Agent Skills](https://claude.com/blog/skills)
