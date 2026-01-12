---
name: command-name
description: Brief description of what the command does
parameters:
  - name: argument-name
    description: Description of the argument
    type: string | number | boolean | path
    required: true
    example: example-value
    hint: User-friendly hint displayed in CLI
  - name: optional-argument
    description: Description of the optional argument
    type: string
    required: false
    default: default-value
    example: optional-value
    hint: Optional argument hint
  - name: flag-option
    description: Description of a flag option
    type: boolean
    required: false
    example: --option-name
    hint: Enable specific feature with this flag
---

Complete description of what the command does.

## Syntax

```bash
/[command-name] [required-arg] [optional-arg] [--option value]
```

## Arguments

### Required Arguments

- **argument-name**: Description of what this argument is
  - **Type**: string | number | boolean | path
  - **Example**: `value-example`

### Optional Arguments

- **[optional-arg]**: Description of the optional argument
  - **Type**: string | number | path
  - **Default**: Default value if not provided
  - **Example**: `optional-value`

## Usage Examples

### Basic Usage

```bash
/[command-name] my-value
```

**Output**:
```
Description of what the command returns
```

### With parameters

```bash
/[command-name] --parameter-name custom-value
```

**Output**:
```
Description of the output with the parameter
```

## Use Cases

### Use Case 1: [Scenario Title]

**Situation**: When would you use this command?

**Command**:
```bash
/[command-name] [specific-args] [specific-options]
```

**Explanation**: How it solves the problem

## Error Messages & Troubleshooting

### Error: "[error-message]"

**Cause**: What causes this error

**Solution**: How to fix it

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Command not found | Plugin not installed | Install the plugin |
| Argument error | Wrong format | Check syntax |

## Related Commands

- `/related-command-1` - Description
- `/related-command-2` - Description

## Permissions Required

- **File System**: What file system permissions are needed
- **Network**: What network access is required

## Configuration

To use this command in a plugin:

1. Create `commands/[command-name].md` in your plugin
2. Add to `plugin.json`:
```json
{
  "components": {
    "commands": ["commands/[command-name].md"]
  }
}
```

## Version

- **Version**: 1.0.0
- **Created**: 2025-12-15
- **Maintained By**: [Team/Person]
