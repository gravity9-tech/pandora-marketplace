# Slash Commands

This folder contains templates and examples for creating custom slash commands for Claude Code.

## Purpose

Slash commands provide a powerful way to extend Claude Code's functionality by creating custom commands that can be invoked directly from the CLI. They enable developers to:
- Automate repetitive workflows
- Create domain-specific tools tailored to your project
- Integrate with external services and APIs
- Enhance developer productivity with quick actions
- Share reusable command definitions across teams

## What Are Slash Commands?

Slash commands are user-defined actions that start with a `/` and can accept arguments, options, and parameters. They bridge Claude Code's capabilities with your project's specific needs.

### Command Anatomy

```bash
/command-name [required-arg] [optional-arg] [--option value]
```

- **Command Name**: Identifies the action (e.g., `/deploy`, `/test`, `/format`)
- **Arguments**: Positional inputs required by the command
- **Options**: Named parameters that modify behavior
- **Flags**: Boolean toggles that enable/disable features

## Folder Structure

```
slash_commands/
├── README.md                    # This file
├── slash-command-template.md    # Template for creating new commands
└── examples/                    # Sample implementations
```

### File Descriptions

- **`slash-command-template.md`**: A complete template showing how to structure a slash command with all sections, metadata, and examples
- **`examples/`**: Reference implementations demonstrating different command types and use cases

## How to Use This Template

### 1. Create Your Command File

Copy the `slash-command-template.md` file as the basis for your new command:

```bash
cp slash-command-template.md commands/my-command.md
```

### 2. Define Command Metadata

Update the YAML frontmatter section with your command details:

```yaml
---
name: my-command
description: Brief description of what the command does
parameters:
  - name: target
    description: What this argument does
    type: string
    required: true
    example: my-value
    hint: User-friendly hint for the CLI
  - name: verbose
    description: Enable verbose output
    type: boolean
    required: false
    example: --verbose
    hint: Show detailed execution information
---
```

### 3. Fill in Command Details

Include comprehensive documentation:
- **Syntax**: Show the command signature
- **Arguments**: Define all required and optional parameters
- **Usage Examples**: Provide real-world examples
- **Use Cases**: Explain when and why to use this command
- **Error Handling**: Document potential errors and solutions
- **Permissions**: List required access levels

### 4. Register in Plugin Configuration

Add your command to your plugin's `plugin.json`:

```json
{
  "components": {
    "commands": ["commands/my-command.md"]
  }
}
```

## YAML Parameter Reference

Each parameter in the `parameters` section can include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Parameter identifier |
| `description` | string | Yes | What the parameter does |
| `type` | string | Yes | Parameter type: `string`, `number`, `boolean`, `path` |
| `required` | boolean | Yes | Whether this parameter is mandatory |
| `example` | string | No | Example value for the parameter |
| `hint` | string | No | CLI hint text shown to users |
| `default` | string/number | No | Default value if not provided |

## Creating Effective Slash Commands

### Best Practices

1. **Clear Naming**: Use descriptive, action-oriented names
   - Good: `/deploy-service`, `/format-code`, `/run-tests`
   - Avoid: `/cmd`, `/do-stuff`

2. **Comprehensive Documentation**: Include examples for every parameter combination
3. **Error Handling**: Define clear error messages and recovery steps
4. **Minimal Arguments**: Keep required arguments minimal; use optional flags for advanced options
5. **Consistent Syntax**: Follow standard CLI conventions (flags with `--`, short options with `-`)
6. **User-Friendly Hints**: Provide helpful hints that guide users through command usage

### Command Organization

- **Simple commands**: One file with clear parameters
- **Complex commands**: Use sub-commands for multiple related operations
- **Reusable commands**: Document parameters for easy integration with plugins

## Common Command Patterns

### Deployment Command

```bash
/deploy [service-name] [--environment prod] [--version 1.0.0]
```

### Testing Command

```bash
/test [--filter pattern] [--coverage] [--watch]
```

### Utility Command

```bash
/format [file-path] [--style prettier]
```

## Examples

The `examples/` folder contains reference implementations showing:
- Commands with multiple parameters
- Integration with external APIs
- Error handling patterns
- Documentation best practices

## Security Considerations

1. **Validate Inputs**: Always validate user-provided arguments
2. **Limit Scope**: Restrict command permissions to necessary operations
3. **Handle Secrets**: Never hardcode credentials; use environment variables
4. **Error Messages**: Avoid exposing sensitive system information in errors
5. **Audit Logging**: Log important command executions for security review

## Version Information

- **Template Version**: 1.0.0
- **Minimum Claude Code Version**: Compatible with all Claude Code versions
- **Last Updated**: 2025-12-15

## Learn More

For comprehensive guidance on creating and configuring slash commands, refer to the official documentation:
- [Claude Code Slash Commands Guide](https://code.claude.com/docs/en/slash-commands)
- [Plugin Development](https://code.claude.com/docs/en/plugins)
- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference)

## Quick Start Checklist

- [ ] Copy `slash-command-template.md` to your project
- [ ] Update the command name and description
- [ ] Define all required and optional parameters
- [ ] Write comprehensive usage examples
- [ ] Test your command with different argument combinations
- [ ] Document error scenarios and solutions
- [ ] Add the command to your `plugin.json`
- [ ] Share with your team or community

## Contributing

If you have improvements or new command templates, consider contributing to the Pandora Marketplace to help the community!
