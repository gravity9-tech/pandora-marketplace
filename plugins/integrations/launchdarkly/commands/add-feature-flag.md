---
description: Add a feature flag to recent code changes - creates flag in LaunchDarkly via MCP, wraps React code, and generates tests for both variants
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - mcp__LaunchDarkly
argument-hint: [flag-key] [project-key] [--dry-run] [--base=branch] [--skip-tests]
---

# Feature Flag Automation with Tests

You are adding a feature flag to the user's recent code changes and generating tests for both variants. Follow this workflow:

---

## Step 0: Parse Options and Detect Mode

Check for flags in the arguments:

**Arguments:**
- `$1` = flag key (optional)
- `$2` = project key (optional, default: default)
- `--dry-run` = Preview mode - show all planned operations without executing them
- `--base=<branch>` = Compare against specific branch (default: auto-detect trunk)
- `--skip-tests` = Skip test generation (only create flag and wrap code)

**Dry Run Mode:**
If `--dry-run` is present, set `DRY_RUN=true` and:
- ⚠️ DO NOT create the flag in LaunchDarkly
- ⚠️ DO NOT modify any files
- ✅ Show all planned operations
- ✅ Show exact code changes that would be made (as diffs)
- ✅ Show the LaunchDarkly API call that would be made
- ✅ Show test files that would be generated

When in dry-run mode, prefix all output sections with `[DRY RUN]` to make it clear no changes are being made.

---

## Step 1: Gather Flag Information

If arguments were provided, use them. Ask the user for any missing required information:

1. **Flag Key** (required): Unique identifier in `kebab-case`
   - Must match pattern: `^[a-z][a-z0-9-]*[a-z0-9]$`
   - Examples: `new-checkout-flow`, `bloomreach-integration`
   - ❌ Invalid: `NewCheckout`, `new_checkout`, `-new-checkout`

2. **Flag Name**: Human-readable name (default: generated from key by converting kebab-case to Title Case)

3. **Description** (required): What does this flag control? Be specific about the behavior change.

4. **Flag Type** (required):
   - `temporary` - Feature rollout, will be removed after full deployment
   - `permanent` - Long-term operational toggle
   - `killswitch` - Emergency disable capability for critical paths

5. **Tags** (required) alwasy ask , remind to tag flag with team tag: e.g., `FIND`, `DECIDE`, `PWA`, `team-checkout`

6. **Project Key** (optional): LaunchDarkly project identifier (default: `default`)

7. **Target Environments** (optional): Which environments should have the flag enabled initially?
   - Default: all environments start with flag OFF

---

## Step 2: Analyze Code Changes

Detect the base branch or use provided option:

```bash
# Try to detect main branch
BASE_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
if [ -z "$BASE_BRANCH" ]; then
  BASE_BRANCH="HEAD~5"
fi

# If --base was provided, use that instead
# BASE_BRANCH=$PROVIDED_BASE

git diff --name-only $BASE_BRANCH | grep -E '\.(tsx|jsx|ts|js)$'
```

Then examine the changed files to identify:
- New components that need wrapping
- Modified hooks or API calls
- JSX changes that should be conditional
- New exports that consumers might depend on

**For each file, determine:**
1. What specific code block should be wrapped?
2. Is there existing/old behavior to fall back to?
3. Where should `useVariant` be placed (must be component top-level)?
4. What test file exists or should be created?

---

## Step 3: Create Flag in LaunchDarkly

### If DRY_RUN=true:

```
[DRY RUN] Would create LaunchDarkly flag with:

Tool: mcp__LaunchDarkly - createFeatureFlag
Parameters:
  projectKey: "<project-key>"
  key: "<flag-key>"
  name: "<flag-name>"
  description: "<description>"
  tags: ["<tag1>", "<tag2>"]
  temporary: true|false
  variations:
    - { "value": false, "name": "Off" }
    - { "value": true, "name": "On" }

No flag will be created in dry-run mode.
```

### If DRY_RUN=false:

Use the LaunchDarkly MCP server to create the flag:

```
Tool: mcp__LaunchDarkly - createFeatureFlag

Parameters:
- projectKey: [from user]
- key: [flag-key]
- name: [flag-name]
- description: [description]
- tags: [array]
- temporary: true/false
- variations: [{"value": false, "name": "Off"}, {"value": true, "name": "On"}]
```

**Error Handling:**
- If flag already exists: Ask user if they want to proceed with code changes only
- If API fails: Show error, suggest checking LaunchDarkly access/permissions
- If project not found: List available projects if possible

---

## Step 4: Implement Flag in React Code

### If DRY_RUN=true:

For each file that would be modified, show:

```
[DRY RUN] Would modify: src/components/Checkout.tsx

--- BEFORE ---
export const Checkout = () => {
  return <OldCheckoutFlow />;
};

--- AFTER ---
export const Checkout = () => {
  const showNewCheckout = useVariant('new-checkout-flow', false);

  return showNewCheckout ? <NewCheckoutFlow /> : <OldCheckoutFlow />;
};

--- DIFF ---
@@ -1,3 +1,5 @@
 export const Checkout = () => {
+  const showNewCheckout = useVariant('new-checkout-flow', false);
+
-  return <OldCheckoutFlow />;
+  return showNewCheckout ? <NewCheckoutFlow /> : <OldCheckoutFlow />;
 };
```

### If DRY_RUN=false:

Apply the changes using these patterns:

#### For Components
```tsx
const flagValue = useVariant('flag-key', false);
return flagValue ? <NewComponent /> : <OldComponent />;
```

#### For Hooks (always at top level!)
```tsx
// ✅ CORRECT - hook at component top level
const flagValue = useVariant('flag-key', false);

useEffect(() => {
  if (flagValue) {
    fetchNewAPI();
  } else {
    fetchOldAPI();
  }
}, [flagValue]);

// ❌ WRONG - never do this!
useEffect(() => {
  const flagValue = useVariant('flag-key', false); // BREAKS RULES OF HOOKS
}, []);
```

#### For JSX Elements
```tsx
const flagValue = useVariant('flag-key', false);

return (
  <div>
    {flagValue ? <NewFeature /> : <LegacyFeature />}
  </div>
);
```

#### For Feature Addition (no fallback)
```tsx
const flagValue = useVariant('flag-key', false);

return (
  <div>
    <ExistingContent />
    {flagValue && <NewOptionalFeature />}
  </div>
);
```

---

## Step 5: Generate Tests for Feature Flag Variants

Unless `--skip-tests` is provided, generate tests for both flag states.

### Test File Location Strategy

1. If test file already exists for the modified file → add new test cases
2. If no test file exists → create new test file following project conventions:
   - `src/components/Checkout.tsx` → `src/components/__tests__/Checkout.test.tsx`
   - `src/hooks/useCheckout.ts` → `src/hooks/__tests__/useCheckout.test.ts`

### Test Generation Patterns

#### Pattern A: Component with Conditional Rendering

For components that render different content based on flag:

```tsx
import {render, screen} from '@testing-library/react'
import {ComponentName} from '../ComponentName'
import {useVariant} from '@/hooks/useVariant'

// Mock the useVariant hook
jest.mock('@/hooks/useVariant', () => ({
    useVariant: jest.fn()
}))

describe('ComponentName', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('when flag-key is disabled (default)', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key, fallback) => fallback)
        })

        it('should render old/default behavior', () => {
            render(<ComponentName />)

            // Assert old behavior is rendered
            expect(screen.getByTestId('old-component')).toBeInTheDocument()
            expect(screen.queryByTestId('new-component')).not.toBeInTheDocument()
        })

        it('should call useVariant with correct flag key and fallback', () => {
            render(<ComponentName />)

            expect(useVariant).toHaveBeenCalledWith('flag-key', false)
        })
    })

    describe('when flag-key is enabled', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-key'
            })
        })

        it('should render new behavior', () => {
            render(<ComponentName />)

            // Assert new behavior is rendered
            expect(screen.getByTestId('new-component')).toBeInTheDocument()
            expect(screen.queryByTestId('old-component')).not.toBeInTheDocument()
        })
    })
})
```

#### Pattern B: Hook with Conditional Logic

For hooks that change behavior based on flag:

```tsx
import {renderHook, waitFor} from '@testing-library/react'
import {useHookName} from '../useHookName'
import {useVariant} from '@/hooks/useVariant'

jest.mock('@/hooks/useVariant', () => ({
    useVariant: jest.fn()
}))

// Mock other dependencies as needed
jest.mock('../api', () => ({
    fetchOldApi: jest.fn(),
    fetchNewApi: jest.fn()
}))

describe('useHookName', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('when flag-key is disabled (default)', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key, fallback) => fallback)
        })

        it('should use old API/behavior', async () => {
            const {result} = renderHook(() => useHookName())

            await waitFor(() => {
                expect(fetchOldApi).toHaveBeenCalled()
            })
            expect(fetchNewApi).not.toHaveBeenCalled()
        })

        it('should return expected shape with old behavior', () => {
            const {result} = renderHook(() => useHookName())

            expect(result.current).toEqual(
                expect.objectContaining({
                    // expected properties for old behavior
                })
            )
        })
    })

    describe('when flag-key is enabled', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-key'
            })
        })

        it('should use new API/behavior', async () => {
            const {result} = renderHook(() => useHookName())

            await waitFor(() => {
                expect(fetchNewApi).toHaveBeenCalled()
            })
            expect(fetchOldApi).not.toHaveBeenCalled()
        })

        it('should return expected shape with new behavior', () => {
            const {result} = renderHook(() => useHookName())

            expect(result.current).toEqual(
                expect.objectContaining({
                    // expected properties for new behavior
                })
            )
        })
    })
})
```

#### Pattern C: Multiple Flags in Same Component

When a component uses multiple feature flags:

```tsx
import {render, screen} from '@testing-library/react'
import {ComponentName} from '../ComponentName'
import {useVariant} from '@/hooks/useVariant'

jest.mock('@/hooks/useVariant', () => ({
    useVariant: jest.fn()
}))

describe('ComponentName', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Default: all flags disabled
        useVariant.mockImplementation((key, fallback) => fallback)
    })

    describe('feature flags behavior', () => {
        it('should render default state when all flags are disabled', () => {
            render(<ComponentName />)

            expect(useVariant).toHaveBeenCalledWith('flag-a', false)
            expect(useVariant).toHaveBeenCalledWith('flag-b', false)
            // Assert default rendering
        })

        it('should enable feature A when flag-a is true', () => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-a'
            })

            render(<ComponentName />)

            // Assert feature A is enabled, B is disabled
        })

        it('should enable feature B when flag-b is true', () => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-b'
            })

            render(<ComponentName />)

            // Assert feature B is enabled, A is disabled
        })

        it('should enable both features when both flags are true', () => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-a' || key === 'flag-b'
            })

            render(<ComponentName />)

            // Assert both features are enabled
        })
    })
})
```

#### Pattern D: API/Query Parameters Affected by Flag

For hooks that modify API calls based on flags (like the example provided):

```tsx
import {renderHook} from '@testing-library/react'
import {useCustomHook} from '../useCustomHook'
import {useVariant} from '@/hooks/useVariant'
import {useCustomQuery} from '../../useCustomQuery'

jest.mock('@/hooks/useVariant', () => ({
    useVariant: jest.fn()
}))

jest.mock('../../useCustomQuery', () => ({
    useCustomQuery: jest.fn()
}))

describe('useCustomHook', () => {
    const mockQueryResult = {data: [{id: '123'}]}

    beforeEach(() => {
        jest.clearAllMocks()
        useCustomQuery.mockReturnValue(mockQueryResult)
        // Default: flag disabled
        useVariant.mockImplementation((key, fallback) => fallback)
    })

    describe('when flag-key is disabled (default)', () => {
        it('should call API with default parameters', () => {
            renderHook(() => useCustomHook())

            expect(useCustomQuery).toHaveBeenCalledWith(
                expect.any(Array),
                expect.objectContaining({
                    headers: {},
                    queryParams: expect.objectContaining({
                        // default params
                    })
                }),
                expect.anything()
            )
        })
    })

    describe('when flag-key is enabled', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-key'
            })
        })

        it('should call API with modified parameters', () => {
            renderHook(() => useCustomHook())

            expect(useCustomQuery).toHaveBeenCalledWith(
                expect.any(Array),
                expect.objectContaining({
                    headers: {
                        'x-custom-header': 'value'
                    },
                    queryParams: expect.objectContaining({
                        // modified params
                    })
                }),
                expect.anything()
            )
        })
    })
})
```

#### Pattern E: Optional Feature Addition (no fallback)

For features that are simply added/removed:

```tsx
import {render, screen} from '@testing-library/react'
import {ComponentName} from '../ComponentName'
import {useVariant} from '@/hooks/useVariant'

jest.mock('@/hooks/useVariant', () => ({
    useVariant: jest.fn()
}))

describe('ComponentName', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('when flag-key is disabled (default)', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key, fallback) => fallback)
        })

        it('should not render optional feature', () => {
            render(<ComponentName />)

            expect(screen.queryByTestId('optional-feature')).not.toBeInTheDocument()
            // Core content should still be present
            expect(screen.getByTestId('core-content')).toBeInTheDocument()
        })
    })

    describe('when flag-key is enabled', () => {
        beforeEach(() => {
            useVariant.mockImplementation((key) => {
                return key === 'flag-key'
            })
        })

        it('should render optional feature alongside existing content', () => {
            render(<ComponentName />)

            expect(screen.getByTestId('optional-feature')).toBeInTheDocument()
            expect(screen.getByTestId('core-content')).toBeInTheDocument()
        })
    })
})
```

### Test Generation Guidelines

1. **Always mock `useVariant`** at the module level
2. **Use `beforeEach` to reset mocks** and set default flag states
3. **Group tests by flag state** using nested `describe` blocks
4. **Test the flag call itself** - verify `useVariant` is called with correct key and fallback
5. **Test observable behavior**, not implementation details
6. **Include edge cases** like:
   - Component with missing dependencies
   - API errors when flag is enabled
   - Loading states for both variants

### If DRY_RUN=true:

```
[DRY RUN] Would create/modify test file: src/components/__tests__/Checkout.test.tsx

--- NEW TEST CASES ---
describe('when new-checkout-flow is disabled (default)', () => {
    beforeEach(() => {
        useVariant.mockImplementation((key, fallback) => fallback)
    })

    it('should render old checkout flow', () => {
        // ...
    })
})

describe('when new-checkout-flow is enabled', () => {
    beforeEach(() => {
        useVariant.mockImplementation((key) => {
            return key === 'new-checkout-flow'
        })
    })

    it('should render new checkout flow', () => {
        // ...
    })
})
```

---

## When to Use Feature Flags

### ✅ MUST use:
- New features visible to users
- Additional functionality to existing features
- External API integrations (DOL, SCAPI, Bloomreach, etc.)
- Performance optimizations that change behavior
- Component refactors with different rendering
- Bug fixes that change observable behavior
- A/B test variants

### ❌ DO NOT use:
- File imports (never wrap imports with flags!)
- Auto-generated tag/version changes
- Translation/i18n updates
- Typo fixes
- Pure refactors with identical behavior
- Dev tooling changes

---

## Step 6: Summary

### If DRY_RUN=true:

```
╔══════════════════════════════════════════════════════════════╗
                    DRY RUN SUMMARY
╚══════════════════════════════════════════════════════════════╝

📋 FLAG DETAILS:
   Key:         new-checkout-flow
   Name:        New Checkout Flow
   Project:     default
   Type:        temporary
   Tags:        [checkout, q4-release]

🔧 LAUNCHDARKLY:
   Would create flag via mcp__LaunchDarkly.createFeatureFlag

📝 FILES TO MODIFY (3):
   • src/components/Checkout.tsx
   • src/hooks/useCheckoutData.ts
   • src/pages/CheckoutPage.tsx

🧪 TEST FILES TO CREATE/MODIFY (3):
   • src/components/__tests__/Checkout.test.tsx (modify - add 4 test cases)
   • src/hooks/__tests__/useCheckoutData.test.ts (create - 6 test cases)
   • src/pages/__tests__/CheckoutPage.test.tsx (modify - add 4 test cases)

📄 CODE CHANGES PREVIEW:
   [Show diffs for each file as above]

📄 TEST CHANGES PREVIEW:
   [Show test code that would be added]

▶️ TO EXECUTE:
   Run this command again without --dry-run flag

╚══════════════════════════════════════════════════════════════╝
```

### If DRY_RUN=false:

After completing, show:

```
╔══════════════════════════════════════════════════════════════╗
                    EXECUTION COMPLETE
╚══════════════════════════════════════════════════════════════╝

✅ LAUNCHDARKLY FLAG CREATED:
   Key:     new-checkout-flow
   URL:     https://app.launchdarkly.com/projects/default/flags/new-checkout-flow/targeting

✅ FILES MODIFIED (3):
   • src/components/Checkout.tsx
   • src/hooks/useCheckoutData.ts
   • src/pages/CheckoutPage.tsx

✅ TEST FILES CREATED/MODIFIED (3):
   • src/components/__tests__/Checkout.test.tsx (+4 test cases)
   • src/hooks/__tests__/useCheckoutData.test.ts (new file, 6 test cases)
   • src/pages/__tests__/CheckoutPage.test.tsx (+4 test cases)

🧪 RUN TESTS:
   npm test -- --testPathPattern="Checkout|useCheckoutData|CheckoutPage"

   Expected results:
   • All "flag disabled" tests should pass (default behavior)
   • All "flag enabled" tests should pass (new behavior)

🔍 TESTING CHECKLIST:
   1. Run tests locally to verify both variants work
   2. Go to LaunchDarkly dashboard
   3. Enable flag for your user/environment
   4. Refresh the application
   5. Verify new behavior is active
   6. Toggle off and verify old behavior returns

🧹 CLEANUP (after full rollout):
   1. Remove useVariant calls and conditional logic
   2. Keep only the new code path
   3. Remove "flag disabled" test cases
   4. Update remaining tests to reflect permanent behavior
   5. Archive flag in LaunchDarkly
   6. Delete flag after 30 days

╚══════════════════════════════════════════════════════════════╝
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP connection failed | Check LaunchDarkly MCP server is running |
| Flag already exists | Use existing flag or choose different key |
| No files found in diff | Verify you have uncommitted changes or adjust --base |
| useVariant not found | Add import: `import { useVariant } from '@/hooks/useVariant'` |
| Tests failing after generation | Check mock setup matches actual useVariant signature |
| Test file location wrong | Adjust based on project's test file conventions |
| Missing test dependencies | Ensure @testing-library/react is installed |
