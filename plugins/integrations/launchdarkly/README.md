# LaunchDarkly Integration Plugin

## Overview
LaunchDarkly Integration enables seamless feature flag management directly from Claude Code. It provides commands to add feature flags with automated test generation and remove flags from your codebase, all while maintaining integration with the LaunchDarkly platform via MCP server.

## Installation

### Step 1: Add the Marketplace
First, add the Pandora Marketplace to your Claude Code installation:

```bash
/plugin marketplace add pandora-marketplace
```

### Step 2: Install the Plugin
Install the LaunchDarkly Integration plugin from the marketplace:

```bash
/plugin install launchdarkly@pandora-marketplace
```

### Step 3: Configure LaunchDarkly Credentials
Set up your LaunchDarkly API credentials in your environment:

```bash
export LAUNCHDARKLY_SDK_KEY="your-sdk-key"
export LAUNCHDARKLY_API_KEY="your-api-key"
```

## Components

### Commands
- **add-feature-flag**: Add new feature flags to your codebase with automated test generation
- **remove-feature-flag**: Remove feature flags and clean up related code

### MCP Server
- **LaunchDarkly MCP**: Enables communication with LaunchDarkly API for flag management and synchronization

## How to Use

### Add a Feature Flag

```bash
/add-feature-flag [flag-key] [project-key] [--dry-run] [--base=branch] [--skip-tests]
```

**Parameters:**
- `[flag-key]` (optional): Unique identifier for the flag (kebab-case, e.g., `new-checkout-flow`)
- `[project-key]` (optional): LaunchDarkly project identifier (default: `default`)
- `--dry-run`: Preview mode - show all planned operations without executing
- `--base=branch`: Compare against specific branch (default: auto-detect main branch)
- `--skip-tests`: Skip test generation (only create flag and wrap code)

### Examples

```bash
# Add a simple feature flag
/add-feature-flag new-checkout-flow

# Add flag with specific project
/add-feature-flag payment-integration production

# Preview changes before applying
/add-feature-flag new-feature --dry-run

# Add flag without generating tests
/add-feature-flag ui-redesign --skip-tests

# Compare against specific branch
/add-feature-flag feature-x --base=develop
```

### Remove a Feature Flag

```bash
/remove-feature-flag <flag-key> [project-key]
```

**Parameters:**
- `<flag-key>` (required): The flag to remove
- `[project-key]` (optional): LaunchDarkly project identifier (default: `default`)

### Example

```bash
# Remove a feature flag
/remove-feature-flag old-feature

# Remove flag from specific project
/remove-feature-flag experiment-1 staging
```

## Workflow

1. **Create Flag**: Run `/add-feature-flag` to create a new LaunchDarkly flag
2. **Code Wrapping**: The plugin automatically wraps relevant code with `useVariant()` hooks
3. **Test Generation**: Automated tests are generated for both flag variants (enabled/disabled)
4. **Verification**: Tests ensure both code paths work correctly
5. **Rollout**: Gradually enable the flag through LaunchDarkly dashboard
6. **Cleanup**: Remove the flag and clean up code after full rollout

## Features
- Automated test generation for feature flags
- Bi-directional sync with LaunchDarkly platform
- Easy flag lifecycle management
- Codebase cleanup when removing flags
- Dry-run mode for preview before execution
- Support for multiple LaunchDarkly projects
- Automatic branch detection and diff analysis

## Test Generation

The plugin automatically generates tests for:
- Component rendering with flag enabled/disabled
- Hook behavior variations
- API call modifications
- Multiple flag combinations
- Optional feature additions

Tests cover both variants to ensure:
- Old behavior works correctly
- New behavior works as expected
- Smooth transitions between variants

## Use Cases
- Managing feature rollouts and experiments
- A/B testing implementation
- Gradual deployment strategies
- Feature flag lifecycle automation
- Safe feature development and testing
- Conditional feature availability

## Best Practices

1. **Always use dry-run first** to preview changes
2. **Keep flags in sync** with LaunchDarkly dashboard
3. **Test both variants** before rollout
4. **Use meaningful flag keys** that describe the feature
5. **Tag flags appropriately** for team organization
6. **Clean up flags** after full rollout or removal
