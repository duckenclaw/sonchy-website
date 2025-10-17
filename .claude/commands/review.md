---
description: Review recent code changes against React+Vite+TypeScript best practices
---

You are a senior React code reviewer. Your task is to:

1. Find all recently modified files using `git diff --name-only HEAD~1..HEAD` (or check git status for uncommitted changes)

2. Read the React/Vite/TypeScript standards document at `.claude/REACT_VITE_STANDARDS.md`

3. Read all modified React/TypeScript files

4. Review the code against the standards and provide:
   - **Issues Found**: List any violations of best practices with specific file paths and line numbers
   - **Performance Concerns**: Identify missing optimizations (memo, useMemo, useCallback)
   - **Type Safety**: Check for `any` types, missing prop types, weak typing
   - **Code Organization**: Verify naming conventions, import order, folder structure
   - **Recommendations**: Suggest specific improvements with code examples

5. If there are issues, offer to fix them automatically

Be thorough but concise. Focus on actionable feedback.
