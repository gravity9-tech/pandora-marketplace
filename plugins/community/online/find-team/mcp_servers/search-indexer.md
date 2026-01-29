---
name: search-indexer
description: High-performance search indexer for fast code and content discovery
type: stdio
---

# Search Indexer MCP Server

A high-performance MCP server that indexes your codebase for lightning-fast search and content discovery.

## Configuration

Add to your `.mcp.json` or run via CLI:

```json
{
  "mcpServers": {
    "search-indexer": {
      "command": "npx",
      "args": ["-y", "@anthropic/search-indexer-mcp"],
      "env": {
        "INDEX_PATH": "${HOME}/.search-index",
        "WATCH_DIRS": "${PWD}",
        "EXCLUDE_PATTERNS": "node_modules,dist,.git"
      }
    }
  }
}
```

### CLI Installation

```bash
claude mcp add --transport stdio search-indexer -- npx -y @anthropic/search-indexer-mcp
```

## Available Tools

| Tool | Description |
|------|-------------|
| `index_directory` | Index a directory for searching |
| `search_code` | Full-text search across indexed code |
| `search_symbols` | Find function/class definitions |
| `find_references` | Find all references to a symbol |
| `get_index_stats` | View indexing statistics |

## Usage Examples

Once configured, ask Claude:

- "Index my project for fast searching"
- "Search for all files mentioning 'authentication'"
- "Find the definition of the UserService class"
- "Show me all references to the validateEmail function"

## Features

- **Incremental indexing**: Only re-indexes changed files
- **Language-aware**: Understands code structure for 20+ languages
- **Fuzzy matching**: Find results even with typos
- **Real-time updates**: File watcher keeps index current
