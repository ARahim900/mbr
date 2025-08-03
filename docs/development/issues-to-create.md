# GitHub Issues to Create

## Issue 1: Security Vulnerability - esbuild Dependency
**Title:** [SECURITY] Fix esbuild vulnerability (GHSA-67mh-4wv8-2f99)
**Labels:** security, high-priority, dependencies
**Description:**
The project has a moderate severity security vulnerability in the esbuild dependency (<=0.24.2). This vulnerability enables any website to send requests to the development server and read responses.

**Affected versions:** esbuild <=0.24.2
**Current version:** 0.25.6 (in package-lock.json)
**CVE:** GHSA-67mh-4wv8-2f99

**Steps to fix:**
1. Run `npm audit fix --force` (may introduce breaking changes)
2. Test application thoroughly after update
3. Update Vite to compatible version if needed

**Priority:** High - affects development security

---

## Issue 2: TypeScript Compilation Errors
**Title:** [BUG] Fix TypeScript errors in VisualizationFixes.tsx
**Labels:** bug, typescript, code-quality
**Description:**
Multiple TypeScript compilation errors in `src/components/VisualizationFixes.tsx` due to missing type annotations.

**Errors found:**
- Line 8: Binding element 'children' implicitly has 'any' type
- Line 47: Multiple binding elements missing types (active, payload, label)
- Line 69: Parameters 'entry' and 'index' implicitly have 'any' type
- Line 84: Multiple binding elements missing types (data, dataKeys, colors)
- Lines 108, 116: Additional type-related errors

**Impact:** Prevents clean TypeScript compilation with strict mode

**Acceptance Criteria:**
- [ ] All TypeScript errors resolved
- [ ] Type-check passes: `npm run type-check`
- [ ] No implicit 'any' types remain
- [ ] Chart components maintain functionality

---

## Issue 3: Code Quality - Excessive Console Statements
**Title:** [TASK] Remove console.log statements for production readiness
**Labels:** code-quality, maintenance, technical-debt
**Description:**
Found 289 console.log statements across 31 files. These should be removed or replaced with proper logging for production.

**Files with highest console usage:**
- Scripts and build files (multiple console statements)
- Database files (14 console statements)
- Component files (various counts)

**Acceptance Criteria:**
- [ ] Remove development console.log statements
- [ ] Keep essential error logging
- [ ] Use proper logging service where needed
- [ ] Script `npm run fix-console-logs` runs successfully

**Priority:** Medium - affects production code quality

---

## Issue 4: ESLint Configuration Issues
**Title:** [BUG] Fix ESLint errors (901 errors across codebase)
**Labels:** bug, code-quality, linting
**Description:**
ESLint reports 901 errors, primarily related to Node.js globals in browser context and unused variables.

**Main error types:**
- 'console' is not defined (no-undef)
- 'process' is not defined (no-undef) 
- Unused variables (no-unused-vars)
- Unexpected constant conditions (no-constant-condition)
- Missing dependency warnings (react-hooks/exhaustive-deps)

**Priority:** Medium - affects code maintainability

---

## Issue 5: Package Manager Consistency
**Title:** [TASK] Resolve package manager mismatch (pnpm vs npm)
**Labels:** dependencies, configuration
**Description:**
Package.json specifies `"packageManager": "pnpm@7.5.1"` but the project uses npm with package-lock.json.

**Options:**
1. Switch to pnpm completely (remove package-lock.json, use pnpm-lock.yaml)
2. Update package.json to specify npm as package manager
3. Add clear documentation about which package manager to use

**Priority:** Low - affects development consistency