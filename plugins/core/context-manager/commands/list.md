---
allowed-tools: Glob(**/*), Read(**/*), Bash(ls:*)
argument-hint:
description: List available context domains in the marketplace
---

## Purpose

Display all available context domains from the marketplace's `team_context/` directory, showing what can be pulled into a project using `/context:init` or `/context:pull`.

## Execution Flow

### Step 1: Scan Marketplace

Read the marketplace's `team_context/` directory structure to identify available domains.

### Step 2: Display Domains

For each domain found, display:
- Domain name
- Number of files
- Brief description (from first line of README or inferred from content)

## Output Format

```
Available Context Domains
=========================

Marketplace: pandora-marketplace
Location: team_context/

Domain                     Files  Description
─────────────────────────────────────────────────────────────────
architecture               2      System design, patterns, components
business_domain            3      Domain knowledge, glossary, user stories
coding_guidelines          5      Best practices, style guides, reviews
development-env            3      Setup guides, troubleshooting
integration                3      API standards, third-party services
monitoring-observability   3      Logging, alerting, monitoring
qa-standards               1      Testing guidelines
references                 2      Quick references, useful links
repositories               2      Repository standards, inventory
security-compliance        2      Security guidelines, secrets
tech_stack                 3      Frameworks, libraries, tooling
workflows                  7      Dev, deploy, QA, PR processes
─────────────────────────────────────────────────────────────────
Total: 12 domains, 36 files

Commands:
  /context:init [path]         Initialize context in a project
  /context:pull <domain> [path] Pull a specific domain
```

## Usage

```bash
/context:list
```

## Notes

- This command only lists what's available in the marketplace
- Use `/context:init` to copy domains to your project
- Use `/context:pull` to add individual domains after initialization
