# MCP Servers

This folder contains examples of Model Context Protocol (MCP) server configurations for Claude Code.

## What is MCP?

The Model Context Protocol is an **open standard for connecting AI systems with data sources and tools**. It acts as a universal bridge between Claude Code and external applications, enabling Claude to access real-time data, execute operations, and integrate seamlessly with hundreds of external tools and services.

## Purpose

MCP servers solve data isolation by connecting Claude Code to:
- **External APIs and Services** - GitHub, Slack, web services, databases
- **Local Tools & Scripts** - File systems, custom automation, development tools
- **Data Sources** - Business intelligence, knowledge bases, repositories
- **Custom Applications** - Proprietary systems and internal tools

## Server Types

Claude Code supports three types of MCP servers:

### **1. Stdio Servers (Local Processes)**
Direct system access for local tools and scripts running as external processes.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "/Users/me/projects"
      }
    }
  }
}
```

**Best for**: Local file operations, custom scripts, development tools

### **2. HTTP/SSE Servers (Remote)**
Network-based servers for cloud services and remote APIs.

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Best for**: Cloud services, remote APIs, centralized tools

### **3. SDK MCP Servers (In-Process)**
Servers that run directly within your application code.

**Best for**: Custom integrations, embedded tools, tight coupling with your application

## Configuration

### Basic Configuration File

Configure MCP servers in a `.mcp.json` file at your project root. See the simple example in this folder.

### Environment Variables

Store credentials securely using environment variables:

```json
{
  "mcpServers": {
    "secure-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "${API_KEY}",
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

## Common MCP Servers

| Server | Type | Purpose |
|--------|------|---------|
| **Filesystem** | Local | Read/write file system operations |
| **GitHub** | Remote | Repository management, code review |
| **Slack** | Remote | Workspace integration, messaging |
| **Web Search** | Remote | Information retrieval |
| **Database** | Local/Remote | Database queries and management |

## Security Best Practices

1. **Never hardcode credentials** - Use environment variables for all sensitive data
2. **Minimal permissions** - Grant only necessary permissions using API tokens
3. **Verify trust** - Research third-party MCP servers before installation
4. **Environment variables** - Store all API keys and tokens in `.env` or environment configuration
5. **Error handling** - Monitor server connections and handle failures gracefully

## Resource Management

MCP servers can expose resources that Claude can reference using @ mentions, similar to file references in Claude Code.

## Token Usage

- **Maximum output**: 25,000 tokens per MCP response (configurable)
- **Warning threshold**: Claude warns when MCP output exceeds 10,000 tokens
- **Optimization**: Disable unused servers to free context window tokens

## Examples

The **`.mcp.json`** file in this folder shows a very simple example of HTTP server configuration. You can extend it with:
- Multiple servers
- Environment variable injection
- Different server types (stdio, HTTP, SSE)
- Custom headers and authentication

## Getting Started

1. **Start simple** - Configure one MCP server at a time
2. **Test integration** - Verify server connectivity before adding more
3. **Use environment variables** - Store all credentials securely
4. **Monitor connections** - Check server status during initialization
5. **Document purposes** - Record why each server is configured

## Learn More

For comprehensive guidance on MCP servers and configuration, refer to the official Anthropic documentation:
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)
- [Model Context Protocol Overview](https://www.anthropic.com/news/model-context-protocol)
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
