Create a new project component in `Components/` following SOLID principles.

Arguments: $ARGUMENTS (format: `<ComponentName> [description]`, e.g. `UserCard "Displays user avatar and name"`)

## Steps

1. Parse arguments: first word = PascalCase component name, rest = optional description.
2. Create `Components/<ComponentName>.tsx` using this template:

```tsx
import { cn } from "@/lib/utils";

interface <ComponentName>Props {
  className?: string;
  // Add only props this component actually needs (Interface Segregation)
}

export function <ComponentName>({ className, ...props }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>
      {/* component content */}
    </div>
  );
}
```

3. Review the generated component against the SOLID checklist before finishing.

## SOLID Constraints

- **S (Single Responsibility)**: One component = one UI concern. No data fetching, no API calls inside.
- **O (Open/Closed)**: Always accept `className?: string` prop. Use `cn()` for merging. Extend via children/composition, not by adding more props.
- **L (Liskov Substitution)**: If wrapping an HTML element, extend its props with `React.ComponentPropsWithoutRef<'element'>` and spread `...props`.
- **I (Interface Segregation)**: Props interface contains ONLY what this component uses. Never pass full objects when only a subset is needed.
- **D (Dependency Inversion)**: Logic and data enter via props or context. No hardcoded fetch/API calls inside the component.

## Rules

- File goes in `Components/` (capital C), NOT `components/ui/` (that's for shadcn only).
- Use named exports (`export function`), not default exports.
- Use `cn()` from `@/lib/utils` for all conditional class merging.
- Use `lucide-react` for any icons.
- Use `@/` path aliases for all imports.
- Add `'use client'` directive ONLY if the component uses browser APIs, state, or event handlers.
