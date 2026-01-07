Remove a LaunchDarkly feature flag from the codebase using the MCP server.

## Prerequisites

Ensure the LaunchDarkly MCP server is configured in the Claude Code settings. The MCP server provides these tools:
- `list_feature_flags` - List all flags in a project
- `get_feature_flag` - Get details of a specific flag
- `update_feature_flag` - Update flag settings (including archive)
- `delete_feature_flag` - Permanently delete a flag
- `list_environments` - List environments in a project

## Arguments

- `$FLAG_NAME` - The feature flag key to remove (required)
- `$PROJECT_KEY` - The LaunchDarkly project key (default: default)
- `$ENVIRONMENT` - Target environment for analysis: dev, staging, or production (default: dev)
- `$DRY_RUN` - If "true", only report what would be removed without making changes (default: false)
## Workflow

### Step 1: Validate Flag Exists in LaunchDarkly

Use the MCP server to verify the flag exists and gather its current state:

```
Use the LaunchDarkly MCP tool `get_feature_flag` with:
- projectKey: $PROJECT_KEY
- featureFlagKey: $FLAG_NAME
- env: $ENVIRONMENT (to get environment-specific configuration)
```

Capture and display:
- Flag name and description
- Flag kind (boolean, multivariate, etc.)
- Current variations and their values
- Targeting status in each environment
- Creation date and last modified date
- Tags associated with the flag
- Whether it's already archived

If the flag doesn't exist, stop and inform the user.

### Step 2: Get Environment-Specific Targeting Details

Use the MCP server to understand the flag's state across all environments:

```
Use the LaunchDarkly MCP tool `list_environments` with:
- projectKey: $PROJECT_KEY

Then for each environment, use `get_feature_flag` with:
- projectKey: $PROJECT_KEY
- featureFlagKey: $FLAG_NAME
- env: [environment_key]
```

Build a summary table:

| Environment | Targeting | Default Variation | Rollout % | Last Modified |
|-------------|-----------|-------------------|-----------|---------------|
| dev         | ON        | true              | 100%      | 2024-01-15    |
| staging     | ON        | true              | 100%      | 2024-01-20    |
| production  | ON        | true              | 100%      | 2024-02-01    |

**Determine the "winner" variation**: The variation serving 100% in production becomes the permanent behavior.

### Step 3: Find All Flag References in Codebase

Search for all occurrences of the flag in the codebase:

1. **Direct flag key references**: Search for `"$FLAG_NAME"` and `'$FLAG_NAME'`

2. **SDK usage patterns** (customize based on client's stack):
   - JavaScript/TypeScript:
     - `ldClient.variation('$FLAG_NAME'`
     - `useFlags().$FLAG_NAME` or `flags.$FLAG_NAME`
     - `useLDClient()` followed by variation calls
     - `withLDConsumer` HOC usage
   - React:
     - `useVariant('$FLAG_NAME', defaultValue)`
     - `useVariant('$FLAG_NAME')`
     - `useVariant(LD_KEYS.'$FLAG_NAME_CAMEL_CASE')` use camelCase version of flag name
     - `useVariant(LD_KEYS.'$FLAG_NAME_CAMEL_CASE', defaultValue)` use camelCase version of flag name
     - `<LDConsumer>` with flag access

3. **Configuration files**: Check for flag references in:
   - `.env` files
   - `config/*.json` or `config/*.yaml`
   - Feature flag configuration files

4. **Test files**: Find test mocks or fixtures:
   - Jest mocks: `jest.mock` with LD references
   - Test fixtures with flag keys

Use ripgrep for efficient searching:
```bash
# Find all files referencing the flag
rg -l "$FLAG_NAME" --type-add 'code:*.{ts,tsx,js,jsx,py,java,kt,go,rb,cs}' -t code

# Find with context
rg -C 3 "$FLAG_NAME" --type-add 'code:*.{ts,tsx,js,jsx,py,java,kt,go,rb,cs}' -t code

# Check config files
rg -l "$FLAG_NAME" --type-add 'config:*.{json,yaml,yml,env,properties,toml}' -t config

# Check test files
rg -l "$FLAG_NAME" --type-add 'test:*.{test,spec}.{ts,tsx,js,jsx}' -t test
```

### Step 4: Analyze Impact

For each file found, analyze:

1. **What is the default/fallback behavior?**
   - Check the second argument to `useVariant()` calls - this is the fallback
   - This should match what we want to keep (usually the production state)

2. **Are there feature-flag-specific code paths?**
   - Identify both the "enabled" and "disabled" branches
   - Determine which branch to keep based on production state

3. **Dependencies**:
   - Does removing this flag affect other flags? (Check for prerequisite relationships)
   - Are there segments or rules that reference this flag?

4. **Test coverage**:
   - List tests that mock or reference this flag
   - Note assertions that need updating

Present a summary:

```markdown
## Impact Analysis for: $FLAG_NAME

### Production State
- **Serving**: true (100% of users)
- **Action**: Keep the "enabled" code path, remove "disabled" path

### Files to Modify

| File | Line(s) | Pattern | Action |
|------|---------|---------|--------|
| src/components/Checkout.tsx | 45-52 | useFlags() conditional | Remove conditional, keep enabled branch |
| src/hooks/useFeature.ts | 12 | variation() call | Remove entire hook if only used for this flag |
| src/tests/Checkout.test.tsx | 23, 45 | LD mock | Remove mock setup |

### Potential Issues
- [ ] Flag is used in 3 files
- [ ] 2 test files need updating
- [ ] No prerequisite relationships found
```

### Step 5: Generate Removal Plan

Based on analysis, create a detailed removal plan:

```markdown
## Removal Plan for: $FLAG_NAME

### 1. Code Changes Required

#### File: src/components/Checkout.tsx
**Current code:**
```tsx
const { $FLAG_NAME } = useVariant();

if ($FLAG_NAME) {
  return <NewCheckoutFlow />;
} else {
  return <LegacyCheckout />;
}
```

**After removal:**
```tsx
return <NewCheckoutFlow />;
```

#### File: src/hooks/useFeature.ts
- Remove import of flag
- Remove flag from destructuring
- If hook is now empty, consider removing the entire file


#### File: src/**/ld-keys.js
- remove flag definition in object LD_KEYS


### 2. Test Updates Required

#### File: src/tests/Checkout.test.tsx
- Remove LD mock configuration
- Update test assertions to match permanent behavior
- Remove test cases for "disabled" state

```

### Step 6: Execute Removal (if not dry run)

If `$DRY_RUN` is not "true":

#### 6a. Create a Feature Branch

```bash
git checkout -b cleanup/remove-flag-$FLAG_NAME
```

#### 6b. Apply Code Transformations

For each file identified:

1. **Remove flag checks**, keeping the appropriate code path based on production state
2. **Clean up imports** - remove unused LD imports if no other flags used
3. **Remove dead code** - the unused variation branch
4. **Simplify components** - remove unnecessary conditionals

Example transformation patterns:

**Pattern 1: Simple Boolean Check**
```typescript
// Before
const { myFlag } = useVariant();
return myFlag ? <NewFeature /> : <OldFeature />;

// After (if myFlag was true in production)
return <NewFeature />;
```

**Pattern 2: Variation Call**
```typescript
// Before
const showFeature = useVariant('my-flag', false);
if (showFeature) {
  enableFeature();
}

// After (if flag was true in production)
enableFeature();
```

**Pattern 3: Multivariate Flag**
```typescript
// Before
const variant = useVariant('my-flag', 'control');
switch(variant) {
  case 'treatment-a': return <TreatmentA />;
  case 'treatment-b': return <TreatmentB />;
  default: return <Control />;
}

// After (if 'treatment-a' won)
return <TreatmentA />;
```

#### 6c. Update Tests

- Remove flag mocking setup
- Update assertions to match new permanent behavior
- Remove test cases for removed code paths

#### 6e. Commit Changes

```bash
git add -A
git commit -m "chore: remove feature flag $FLAG_NAME

- Removed flag checks from [N] files
- Kept '$WINNING_VARIATION' behavior as permanent
- Updated [N] test files

Flag was serving 100% '$WINNING_VARIATION' in production since [date].
Safe to remove as behavior is now permanent."
```

### Step 7: Generate Report

Output a summary report:

```markdown
## Feature Flag Removal Report

### Flag Details
- **Flag Key**: $FLAG_NAME
- **Project**: $PROJECT_KEY
- **Status**: [Completed / Dry Run]
- **Date**: [current date]

### Production State (Before Removal)
- Targeting: ON
- Serving: 100% → variation '$WINNING_VARIATION'
- Last modified: [date]

### Changes Made

#### Code Changes
- **Files modified**: [count]
- **Lines removed**: [count]
- **Tests updated**: [count]

#### Files Changed
| File | Changes |
|------|---------|
| src/components/Feature.tsx | Removed conditional, kept enabled branch |
| src/tests/Feature.test.tsx | Removed LD mock |

### LaunchDarkly Status
- **Action taken**: [Archived / Deleted]
- **Timestamp**: [datetime]

### Verification Steps
- [ ] Run full test suite locally
- [ ] Create PR for code review
- [ ] Deploy to staging environment
- [ ] Verify feature works as expected
- [ ] Deploy to production
- [ ] Monitor for any issues
- [ ] If archived, delete flag after [N] days

### Rollback Plan
If issues arise:
1. The flag still exists in LaunchDarkly (if archived)
2. Revert the git commit: `git revert [commit-hash]`
3. Restore flag from archive if needed
```

## Safety Checks

Before any removal, verify:

- ✅ Flag is serving 100% to one variation in production
- ✅ No recent changes in LaunchDarkly (stable for > 7 days recommended)
- ✅ No scheduled flag changes pending
- ✅ No active experiments using this flag
- ✅ Flag is not a prerequisite for other flags
- ✅ All code references identified and reviewed

## MCP Tool Reference

### get_feature_flag
Get details about a specific flag:
- `projectKey` (required): LaunchDarkly project key
- `featureFlagKey` (required): The flag key to retrieve
- `env` (optional): Filter by environment

### list_feature_flags
List all flags in a project:
- `projectKey` (required): LaunchDarkly project key
- `env` (optional): Include environment-specific details
- `tag` (optional): Filter by tag
- `filter` (optional): Filter expression

### update_feature_flag
Update a flag (including archive):
- `projectKey` (required): LaunchDarkly project key
- `featureFlagKey` (required): The flag key to update
- `patch` (required): JSON Patch or Semantic Patch operations

### delete_feature_flag
Permanently delete a flag:
- `projectKey` (required): LaunchDarkly project key
- `featureFlagKey` (required): The flag key to delete

### list_environments
List environments in a project:
- `projectKey` (required): LaunchDarkly project key
