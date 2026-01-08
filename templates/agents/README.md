# Subagent Templates

This folder contains templates for creating specialized subagents for Claude Code.

## Purpose

Subagents are specialized AI assistants designed to handle specific domains or tasks within your codebase. They extend Claude Code's capabilities by providing focused expertise, custom instructions, and access to domain-specific tools and skills.

## Template Structure

The **`subagent-template.md`** provides a standard structure for defining subagents with:
- **Metadata** - Name, description, model, color, and assigned tools/skills
- **Purpose & Expertise** - Clear definition of what the agent does
- **Instructions** - Guidelines, do's/don'ts, and required context files
- **Capabilities** - Primary and secondary skills

**Note**: This is a flexible template, not a concrete structure. Add or remove sections based on your specific requirements. The template serves as a starting point—customize it to fit your subagent's needs.

## Example

The **`examples/`** folder contains reference implementations. For instance, **`unit_test_generator.md`** demonstrates a practical subagent that generates unit tests across multiple technologies (JavaScript, Python, Java, Go, etc.) while following team-specific quality standards.

## Getting Started

1. Copy `subagent-template.md` as a starting point
2. Customize the metadata and instructions for your specific use case
3. Reference any required context files from your team documentation
4. Include the agent in your plugin's `plugin.json` configuration

## Learn More

For comprehensive guidance on creating and configuring subagents, refer to the official Anthropic documentation:
- [Creating Sub-Agents](https://code.claude.com/docs/en/sub-agents)
