# Hooks

This folder contains hook implementations for Claude Code.

## Purpose

Hooks are application-level code that execute automatically at specific points throughout a Claude Code session's lifecycle. They provide precise control over Claude Code's behavior by intercepting key moments in the development workflow, enabling security enforcement, team convention enforcement, automation, and custom context management.

## Hook Types

Claude Code supports ten distinct hook types, each firing at a specific moment in the session lifecycle:

| Hook | Execution Timing | Purpose |
|------|-----------------|---------|
| **SessionStart** | When a Claude Code session initializes | Initialization and setup logic (e.g., load configuration, set environment) |
| **UserPromptSubmit** | When the user submits a prompt, before Claude processes it | Validate, augment, or reject user prompts |
| **PreToolUse** | After Claude selects a tool, before execution | Intercept and control tool execution; approve, deny, or modify planned actions |
| **PermissionRequest** | When Claude requests permission to use a tool | Grant or deny access based on custom policies |
| **PostToolUse** | Immediately after a tool completes | Handle results, side effects, and post-execution logic |
| **Notification** | When Claude Code sends notifications | Intercept and customize notification behavior |
| **Stop** | When response generation completes | Cleanup, finalization, and session teardown |
| **SubagentStop** | When subagent tasks complete | Handle subagent completion and result aggregation |
| **PreCompact** | Before Claude Code runs a compact operation | Control and manage compact operations |
| **SessionEnd** | When Claude Code session ends | Final cleanup and session termination logic |

## Execution Models

Hooks can be implemented using two execution types:

- **Command**: Direct bash command execution for fast, deterministic operations
- **Prompt**: LLM-based evaluation for intelligent, context-aware decision-making

## Implementation Guidelines

1. **Choose the right hook type** for your use case (PreToolUse is most commonly used for tool control)
2. **Select appropriate execution model**: Use Command for simple logic, Prompt for complex reasoning
3. **Make scripts executable**: `chmod +x hook-name`
4. **Implement error handling**: Gracefully handle failures to avoid blocking workflows
5. **Test thoroughly**: Verify hook behavior across different scenarios
6. **Configure in settings**: Add hook definitions to your Claude Code configuration

## Common Use Cases

- **Security Policies**: Enforce security restrictions and prevent unauthorized tool usage
- **Team Standards**: Validate code against organizational conventions and standards
- **Automation**: Automatically approve routine operations and block suspicious patterns
- **Context Injection**: Dynamically inject relevant context based on session state and user input
- **Developer Experience**: Implement custom notifications and workflow enhancements

## Best Practices

- Keep hook logic simple and fast to avoid session latency
- Use PostToolUse for resource cleanup and logging
- Leverage PreToolUse for access control and security decisions
- Handle edge cases and unexpected inputs gracefully
- Document hook behavior and dependencies clearly

## Examples

The **`examples/`** folder contains reference implementations:

- **`session_start.py`** - Demonstrates a SessionStart hook that disables all MCP servers on session initialization. Shows how to retrieve server status, iterate through enabled servers, and execute individual disable commands with proper error handling.

- **`settings.json`** - Example Claude Code configuration showing how to register hooks in your settings. Update the command paths to point to your hook scripts and customize matchers for specific use cases.

## Learn More

For comprehensive guidance on creating and configuring hooks, refer to the official Anthropic documentation:
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Hooks Reference Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
