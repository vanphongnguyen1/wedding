Create a new Next.js App Router page and register it in the navigation header.

Arguments: $ARGUMENTS (format: `<route-name> "<Page Title>"`, e.g. `dashboard "Dashboard"`)

## Steps

1. Parse arguments: first word = route slug, quoted text = page display title.
2. Create the page file at `app/<route-name>/page.tsx` using this template:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "<Page Title>",
  description: "<Brief description>",
};

export default function <PageName>Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight"><Page Title></h1>
    </main>
  );
}
```

3. Add a nav link to `Components/Header.tsx` — append to the `navLinks` array:

```ts
{ href: "/<route-name>", label: "<Page Title>" },
```

4. Confirm both files were updated and show the user what was created.

## SOLID Constraints

- S: Page file only handles layout. No inline data fetching or business logic.
- O: Wrap the page in a `<main>` container so callers can extend via children.
- I: Export only `metadata` and the default page component — nothing else.
- D: If data is needed, fetch in a Server Component or pass via a separate `lib/` function.

## Rules

- Page must be a Server Component by default (no `'use client'` unless required).
- Always export `metadata` for SEO.
- The header link MUST be added — never skip this step.
- Use `@/` path aliases for all imports.
