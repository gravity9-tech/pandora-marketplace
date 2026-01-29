---
name: decision-logger
description: Logs and tracks architectural decisions and their rationale over time
type: stdio
---

# Decision Logger MCP Server

An MCP server that logs architectural and code decisions for future reference, helping teams maintain institutional knowledge.

## Configuration

Add to your `.mcp.json` or run via CLI:

```json
{
  "mcpServers": {
    "decision-logger": {
      "command": "npx",
      "args": ["-y", "@anthropic/decision-logger-mcp"],
      "env": {
        "DECISIONS_PATH": "${HOME}/.decisions",
        "PROJECT_ID": "${PROJECT_NAME}"
      }
    }
  }
}
```

### CLI Installation

```bash
claude mcp add --transport stdio decision-logger -- npx -y @anthropic/decision-logger-mcp
```

## Available Tools

| Tool | Description |
|------|-------------|
| `log_decision` | Record a new architectural or code decision |
| `list_decisions` | View past decisions with filters |
| `search_decisions` | Search decisions by keyword or tag |
| `update_decision` | Update or supersede an existing decision |

## Usage Examples

Once configured, ask Claude:

- "Log a decision to use PostgreSQL over MongoDB for our user data"
- "What decisions have we made about authentication?"
- "Show me all architecture decisions from last month"
- "Update the caching decision - we're switching to Redis"

## Decision Format

Decisions are stored with:
- **Title**: Brief summary
- **Context**: Why the decision was needed
- **Decision**: What was decided
- **Consequences**: Expected outcomes
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Tags**: Categorization labels
