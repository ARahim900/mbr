# GitHub Actions Updates - Deprecated Actions Fixed

## Summary
Fixed deprecated GitHub Actions versions that were causing workflow failures.

## Changes Made

### 1. Updated `.github/workflows/deploy.yml`
**Before:**
- `actions/checkout@v3` → `actions/checkout@v4`
- `actions/setup-node@v3` → `actions/setup-node@v4`
- `actions/upload-artifact@v3` → `actions/upload-artifact@v4`
- Node.js version: `18` → `20`
- Install command: `npm install --no-package-lock --omit=optional` → `npm ci --legacy-peer-deps`

### 2. Updated `.github/workflows/ci.yml`
**Before:**
- `codecov/codecov-action@v3` → `codecov/codecov-action@v4`

### 3. Verified Current Versions
All workflows now use current, supported action versions:
- ✅ `actions/checkout@v4`
- ✅ `actions/setup-node@v4`
- ✅ `actions/upload-artifact@v4`
- ✅ `codecov/codecov-action@v4`
- ✅ `github/codeql-action/init@v3`
- ✅ `github/codeql-action/analyze@v3`

## Impact
- **Fixes**: Eliminates deprecated action warnings/failures
- **Compatibility**: Ensures workflows run on current GitHub Actions infrastructure
- **Consistency**: Standardizes Node.js version to 20.x across all workflows
- **Reliability**: Uses `npm ci` for consistent, reproducible builds

## Next Steps
1. Commit and push these changes
2. Monitor workflow runs to ensure they complete successfully
3. Update any remaining deprecated actions in future PRs

## Deprecation Notice Resolved
The error `"This request has been automatically failed because it uses a deprecated version of actions/upload-artifact: v3"` has been resolved by updating to v4.