---
name: template-server
description: Serves project templates and boilerplate code for quick scaffolding
type: stdio
---

# Template Server MCP

An MCP server that provides project templates and boilerplate code for rapid scaffolding of new projects and components.

## Configuration

Add to your `.mcp.json` or run via CLI:

```json
{
  "mcpServers": {
    "template-server": {
      "command": "npx",
      "args": ["-y", "@anthropic/template-server-mcp"],
      "env": {
        "TEMPLATES_PATH": "${HOME}/.templates",
        "CUSTOM_TEMPLATES": "${PWD}/.project-templates"
      }
    }
  }
}
```

### CLI Installation

```bash
claude mcp add --transport stdio template-server -- npx -y @anthropic/template-server-mcp
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_templates` | Browse available project templates |
| `get_template` | Retrieve a specific template |
| `scaffold_project` | Generate a new project from template |
| `add_component` | Add a component to existing project |
| `register_template` | Add a custom template |

## Usage Examples

Once configured, ask Claude:

- "What project templates are available?"
- "Scaffold a new React TypeScript project"
- "Add a REST API component to my project"
- "Create a template from my current project structure"

## Built-in Templates

| Template | Description |
|----------|-------------|
| `react-typescript` | React + TypeScript + Vite setup |
| `node-api` | Express/Fastify API boilerplate |
| `python-cli` | Python CLI application |
| `next-app` | Next.js full-stack application |
| `monorepo` | Turborepo monorepo setup |
