# Copy Domain Logic

This is the shared logic for copying a context domain from the marketplace to a target project.

## Parameters

- `domain`: The context domain name (e.g., `architecture`, `workflows`)
- `target-path`: The target project path

## Steps

### 1. Validate Domain Exists

Check if the requested domain exists in `team_context/`:
- If not found, report error and skip this domain

### 2. Check Target Directory

1. Check if `.claude/context/{domain}/` already exists in the target
   - If exists and not in merge mode: Ask user whether to merge or overwrite
   - If overwrite: Remove existing directory first
2. Create `.claude/context/{domain}/` if it doesn't exist

### 3. Copy Files

1. Find all `.md` files in `team_context/{domain}/`
2. Copy each file to `.claude/context/{domain}/`
3. Report each file as it's copied:
   ```
   - {filename}.md
   ```

### 4. Report Completion

```
✓ {domain} complete ({n} files)
```

## Error Handling

- If domain doesn't exist in marketplace: Skip and report warning
- If copy fails: Report error and continue with next domain
- If no `.md` files found in domain: Report warning but create empty directory
