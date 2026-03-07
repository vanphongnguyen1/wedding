Review recently modified or specified files for SOLID principle violations.

Arguments: $ARGUMENTS (optional file path or component name to review; defaults to recently changed files)

## What to do

1. Identify which files to review:
   - If $ARGUMENTS is provided, review that specific file.
   - Otherwise, review all files recently modified in this session.

2. For each file, check every SOLID principle:

### S — Single Responsibility
- Does this file/component have more than one reason to change?
- Is there data fetching mixed with rendering? (violation)
- Is there business logic inside a UI component? (violation)

### O — Open/Closed
- Can the component be extended without modifying its source?
- Is `className?: string` accepted and applied via `cn()`? (required for UI components)
- Are new features being added as props or are existing internals being hacked? (hack = violation)

### L — Liskov Substitution
- If this wraps an HTML element, does it use `React.ComponentPropsWithoutRef<'element'>`?
- Are `...props` spread through so all native attributes still work?

### I — Interface Segregation
- Are any props interfaces bloated with unused fields?
- Is a full object passed when only a subset is used?
- Can the props be split into smaller, focused interfaces?

### D — Dependency Inversion
- Does the component call APIs or `fetch()` directly? (violation)
- Are external dependencies injected via props or context?
- Is logic decoupled from the component (in `lib/` or hooks)?

3. Also check project conventions:
   - New pages: is there a corresponding nav link in `Components/Header.tsx`?
   - Correct directory: `Components/` for project, `components/ui/` for shadcn only
   - Path aliases: `@/` prefixes used correctly
   - `'use client'` only added when truly necessary

## Output Format

For each violation found:
- **File**: path and line number
- **Principle**: which SOLID rule is violated
- **Issue**: what the problem is
- **Fix**: concrete, minimal change to resolve it

If no violations found, confirm which principles were checked and that the code passes.
