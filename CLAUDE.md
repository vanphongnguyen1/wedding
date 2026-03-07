# CLAUDE.md

Project instructions for Claude Code. All agents and commands inherit these rules.

---

## Commands

```bash
yarn dev       # Dev server at localhost:3000
yarn build     # Production build
yarn lint      # ESLint
npx shadcn@latest add <component-name>  # Add shadcn/ui component
```

---

## Architecture

**Next.js 16 App Router** · TypeScript · Tailwind CSS v4 · shadcn/ui

| Path | Purpose |
|---|---|
| `app/` | App Router pages + layouts |
| `app/globals.css` | Global styles, Tailwind v4 directives, CSS variables |
| `Components/` | Project components (capital C) |
| `components/ui/` | shadcn/ui generated — **never edit manually** |
| `lib/utils.ts` | `cn()` helper for Tailwind class merging |
| `hooks/` | Custom React hooks |

**shadcn/ui config** (`components.json`): style `new-york`, base color `neutral`, CSS variables on, icons `lucide`.

**Path aliases**: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`

---

## Non-Negotiable Conventions

1. **New page = new nav link.** Every new page in `app/` must have a corresponding entry added to the `navLinks` array in `Components/Header.tsx`. Never skip this.

2. **Server Components by default.** Only add `'use client'` when the component uses state, browser APIs, or event handlers.

3. **`@/` path aliases always.** No relative imports like `../../lib/utils`.

4. **`cn()` for class merging.** Use `cn()` from `@/lib/utils` for all conditional Tailwind class logic.

5. **lucide-react for icons.** No other icon libraries.

6. **Named exports for components.** Use `export function MyComponent` not `export default`.

---

## SOLID Principles

All code in this project follows SOLID. See full reference: `.claude/context/solid-principles.md`

| Principle | Rule in this codebase |
|---|---|
| **S** Single Responsibility | Pages = routing only. Components = UI only. Data fetching goes in `lib/` or Server Components. |
| **O** Open/Closed | All UI components accept `className?: string` + `cn()`. Extend by wrapping, not modifying. |
| **L** Liskov Substitution | HTML element wrappers use `React.ComponentPropsWithoutRef<'el'>` + spread `...props`. |
| **I** Interface Segregation | Props interfaces are minimal — only what the component actually uses. No fat objects. |
| **D** Dependency Inversion | No `fetch()` or API calls inside components. Inject data via props, Server Components, or Context. |

---

## Custom Commands

| Command | Usage |
|---|---|
| `/new-page` | `/new-page <route> "<Title>"` — creates page + adds Header nav link |
| `/new-component` | `/new-component <Name> [desc]` — creates SOLID component in `Components/` |
| `/solid-check` | `/solid-check [file]` — reviews code for SOLID violations |

---

## Agents

- **code-reviewer** — thorough review of modified code. Launched automatically after new pages/components are written.
