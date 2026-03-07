# SOLID Principles — Applied to This Next.js Project

This document defines how SOLID principles apply to code in this codebase.
All new components and pages must follow these guidelines.

---

## S — Single Responsibility

Each module/component does ONE thing.

- **Pages** (`app/**/page.tsx`): handle routing + layout only. No inline business logic.
- **Components** (`Components/`): render UI based on props. No data fetching inside components.
- **Data fetching**: in Server Components or dedicated `lib/` functions.
- **Hooks** (`hooks/`): one hook = one concern (e.g., `useAuth`, `useCart`, not `useEverything`).

```tsx
// BAD: component does too many things
export function UserCard() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(...) }, []); // fetching
  const handleDelete = () => { ... }; // business logic
  return <div>...</div>; // rendering
}

// GOOD: component only renders
export function UserCard({ user, onDelete }: UserCardProps) {
  return <div>...</div>;
}
```

---

## O — Open/Closed

Open for extension, closed for modification.

- Always accept `className?: string` prop so callers can extend styles without modifying the component.
- Use composition: wrap shadcn/ui components instead of editing them.
- Prefer `children` + slot patterns over adding more props.

```tsx
// GOOD: extensible without editing the component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}
export function Card({ className, children }: CardProps) {
  return <div className={cn("rounded-lg border p-4", className)}>{children}</div>;
}
```

---

## L — Liskov Substitution

Subtypes must be substitutable for their base types.

- When extending HTML elements, use `React.ComponentPropsWithoutRef<'button'>` so all native props still work.
- Don't narrow prop types in ways that break expected usage.

```tsx
// GOOD: fully substitutable for a native <button>
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'default' | 'ghost';
}
export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  return <button className={cn(variants[variant], className)} {...props} />;
}
```

---

## I — Interface Segregation

Don't force components to depend on props they don't use.

- Keep prop interfaces focused and minimal.
- Split large prop objects into smaller, purpose-specific interfaces.
- Don't pass entire data objects; pass only what the component needs.

```tsx
// BAD: component receives a full User object but only uses name + avatar
function Avatar({ user }: { user: User }) { ... }

// GOOD: only what's needed
interface AvatarProps {
  name: string;
  avatarUrl?: string;
}
function Avatar({ name, avatarUrl }: AvatarProps) { ... }
```

---

## D — Dependency Inversion

Depend on abstractions (interfaces), not concrete implementations.

- Components receive callbacks as props instead of calling APIs directly.
- Use React Context for shared services (auth, theme, notifications).
- Data fetching logic lives in `lib/` and is injected via Server Components or props.

```tsx
// BAD: component is tightly coupled to a specific API
function DeleteButton({ id }: { id: string }) {
  const handleClick = () => fetch(`/api/items/${id}`, { method: 'DELETE' });
  return <button onClick={handleClick}>Delete</button>;
}

// GOOD: component depends on an abstraction (callback prop)
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return <button onClick={onDelete}>Delete</button>;
}
// Caller provides the concrete implementation
<DeleteButton onDelete={() => deleteItem(id)} />
```

---

## Quick Reference Checklist

Before submitting any component, verify:

- [ ] Does this component have exactly one reason to change? (S)
- [ ] Can callers extend it without editing its source? (O)
- [ ] Do I spread `...props` for HTML element wrappers? (L)
- [ ] Are props minimal — only what this component actually uses? (I)
- [ ] Does data/logic enter via props/context, not hardcoded calls? (D)
