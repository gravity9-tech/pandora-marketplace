---
name: dead-code-finder
description: Identifies and reports unused code, functions, and variables
type: workflow
phases: 4
---

# Dead Code Finder Workflow

An automated workflow that scans your codebase to identify unused code, helping you maintain a clean and efficient project.

## Usage

```
/dead-code-finder [path] [--fix]
```

**Options:**
- `path`: Directory to scan (default: current project)
- `--fix`: Automatically remove dead code (with confirmation)

## Workflow Phases

### Phase 1: Export Analysis

Scan for unused exports:

```
Use the codebase-explorer agent to:
1. Build dependency graph of all exports
2. Identify exports with no importers
3. Find circular dependencies
4. Map module boundaries
```

### Phase 2: Function Analysis

Find unreachable functions:

```
Analyze code paths to detect:
1. Functions never called
2. Methods with no references
3. Event handlers not attached
4. Conditional code that never executes
```

### Phase 3: File Analysis

Detect orphaned files:

```
Identify files that are:
1. Not imported anywhere
2. Not entry points
3. Not configuration files
4. Not test files (unless --include-tests)
```

### Phase 4: Report Generation

Generate cleanup report:

```
Create detailed report with:
1. List of dead code by category
2. Confidence scores for each finding
3. Safe removal recommendations
4. Impact analysis
```

## Output Format

```markdown
## Dead Code Report

### Unused Exports (High Confidence)
- `src/utils/deprecated.ts` - formatLegacyDate()
- `src/helpers/old.ts` - entire file unused

### Potentially Unused (Medium Confidence)
- `src/components/Modal.tsx` - only dynamic imports

### Statistics
- Files scanned: 234
- Dead code found: 12 items
- Estimated cleanup: ~450 lines
```

## Safety Features

- Excludes test files by default
- Ignores configuration files
- Respects `.deadcodeignore` patterns
- Requires confirmation for `--fix` mode
