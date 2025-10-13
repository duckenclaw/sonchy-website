# React + Vite + TypeScript Code Standards & Best Practices

This document outlines code quality standards and best practices for React development with Vite and TypeScript in 2025.

## Table of Contents
1. [Project Structure](#project-structure)
2. [TypeScript Best Practices](#typescript-best-practices)
3. [React Component Patterns](#react-component-patterns)
4. [Vite-Specific Optimizations](#vite-specific-optimizations)
5. [Code Quality & Performance](#code-quality--performance)
6. [Naming Conventions](#naming-conventions)

---

## Project Structure

### 5-Step Progressive Structure

**Level 1: Single File**
- Start with one file for initial component
- Break into multiple files as complexity grows

**Level 2: Multiple Files**
- Split components into separate files
- Use `.tsx` for components, `.ts` for utilities

**Level 3: Component Folders**
```
components/
  Button/
    index.ts          # public export
    Button.tsx        # implementation
    Button.test.tsx   # tests
    Button.module.css # styles
```

**Level 4: Technical Separation**
```
src/
  components/   # reusable UI components
  pages/        # page-level components
  hooks/        # custom hooks
  context/      # React context providers
  services/     # API calls, external services
  utils/        # helper functions
  assets/       # images, fonts, static files
```

**Level 5: Feature-Based**
```
src/
  features/
    user/
      components/
      hooks/
      services/
    payment/
      components/
      hooks/
      services/
  components/   # shared reusable components
  hooks/        # shared hooks
```

### Key Principles
- Avoid nesting more than 2-3 levels deep
- Separate reusable components from feature-specific ones
- Use `index.ts` files for clean public interfaces
- Keep folder structure flexible and evolving

---

## TypeScript Best Practices

### Type Safety

**Enable Strict Mode**
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Prefer Type Inference**
```typescript
// Good
const user = { name: "John", age: 30 };

// Avoid unnecessary explicit types
const user: { name: string; age: number } = { name: "John", age: 30 };
```

**Use `unknown` instead of `any`**
```typescript
// Bad
const data: any = await fetchData();

// Good
const data: unknown = await fetchData();
if (isUser(data)) {
  // TypeScript knows data is User here
}
```

### Component Props

**Always Type Props**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

**Use Discriminated Unions for Complex States**
```typescript
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function DataComponent() {
  const [state, setState] = useState<FetchState<User>>({ status: 'idle' });

  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <div>{state.data.name}</div>;
    case 'error':
      return <Error message={state.error} />;
    default:
      return null;
  }
}
```

### Utility Types

**Leverage Built-in Utility Types**
```typescript
// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Partial - make all properties optional
type PartialUser = Partial<User>;

// Record - typed key-value objects
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

**Type Inference from Values**
```typescript
const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts'
} as const;

type Endpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

// Extract return type from functions
type UserData = ReturnType<typeof fetchUser>;
```

### Naming Conventions

- **Classes, Interfaces, Types**: `UpperCamelCase` (e.g., `UserProfile`, `ButtonProps`)
- **Variables, Functions**: `lowerCamelCase` (e.g., `userName`, `fetchData`)
- **Constants**: `CONSTANT_CASE` (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Files/Folders**: `kebab-case` (e.g., `user-profile.tsx`, `api-client.ts`)

---

## React Component Patterns

### Functional Components & Hooks

**Prefer Functional Components**
```typescript
// Good - clean and simple
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>{user.name}</div>;
};
```

**Custom Hooks for Reusable Logic**
```typescript
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}
```

### Performance Optimization

**React.memo for Pure Components**
```typescript
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* expensive render */}</div>;
});
```

**useMemo for Expensive Calculations**
```typescript
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);
```

**useCallback for Stable References**
```typescript
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

### Component Composition

**Single Responsibility Principle**
```typescript
// Bad - too many responsibilities
function UserDashboard() {
  // fetching data
  // rendering UI
  // handling auth
  // managing forms
}

// Good - separated concerns
function UserDashboard() {
  return (
    <>
      <UserHeader />
      <UserStats />
      <UserActivity />
    </>
  );
}
```

**Compound Components Pattern**
```typescript
function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="tabs">{children}</div>;
}

Tabs.Tab = function Tab({ label, children }: TabProps) {
  return <div className="tab">{children}</div>;
};

// Usage
<Tabs>
  <Tabs.Tab label="Home">Content</Tabs.Tab>
  <Tabs.Tab label="Profile">Profile</Tabs.Tab>
</Tabs>
```

### Context with Strong Typing

**Type-Safe Context**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Generic Components

**Reusable Type-Safe Components**
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage with type inference
<List items={users} renderItem={(user) => <li>{user.name}</li>} />
```

---

## Vite-Specific Optimizations

### Configuration

**Use SWC for Faster Compilation**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
});
```

**Path Aliases for Clean Imports**
```typescript
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
});
```

**Environment Variables**
```typescript
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// Usage
const apiUrl = import.meta.env.VITE_API_URL;
```

### Performance Optimizations

**Pre-Bundle Dependencies**
```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['some-large-lib'],
  },
});
```

**Code Splitting with Lazy Loading**
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Bundle Analysis**
```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});
```

### Recommended Plugins

**SVG as React Components**
```typescript
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
});

// Usage
import Logo from './logo.svg?react';
<Logo />
```

**PWA Support**
```bash
npm install vite-plugin-pwa -D
```

---

## Code Quality & Performance

### ESLint & Prettier

**Essential ESLint Rules**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### DRY Principle

**Don't Repeat Yourself**
```typescript
// Bad
function formatUserName(user: User) { /* ... */ }
function formatUserName2(user: User) { /* ... */ }

// Good - one function, reused
function formatUserName(user: User) { /* ... */ }
```

### Performance Best Practices

**Avoid Inline Function Definitions in JSX**
```typescript
// Bad - creates new function on every render
<button onClick={() => handleClick(id)}>Click</button>

// Good - stable reference
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<button onClick={handleButtonClick}>Click</button>
```

**Conditional Rendering Optimization**
```typescript
// Bad - component always renders
{showModal && <HeavyModal />}

// Good - lazy load when needed
{showModal && <Suspense fallback={null}><HeavyModal /></Suspense>}
```

### Error Handling

**Always Use Error Boundaries**
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## Naming Conventions

### File Naming

- **Components**: `kebab-case` for files, `PascalCase` for component names
  ```
  user-profile.tsx  →  export function UserProfile()
  ```

- **Hooks**: `kebab-case` with `use-` prefix
  ```
  use-user-data.ts  →  export function useUserData()
  ```

- **Utils**: `kebab-case`
  ```
  format-date.ts  →  export function formatDate()
  ```

### Import Order

**Consistent Import Structure**
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Internal modules/utils
import { formatDate } from '@/utils/format-date';
import { useUser } from '@/hooks/use-user';

// 3. Components
import { Button } from '@/components/button';
import { Card } from '@/components/card';

// 4. Styles
import styles from './component.module.css';
```

---

## Testing Best Practices

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './user-card';

describe('UserCard', () => {
  it('renders user name', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from './use-user-data';

test('fetches user data', async () => {
  const { result } = renderHook(() => useUserData('123'));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user).toBeDefined();
});
```

---

## Code Review Checklist

### Before Committing
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] No `console.log` statements left in code
- [ ] No `any` types (use `unknown` or specific types)
- [ ] Component props are properly typed
- [ ] Performance optimizations applied where needed (memo, useMemo, useCallback)
- [ ] Error boundaries in place for error-prone components
- [ ] Accessibility attributes added (aria-label, alt text, etc.)
- [ ] Responsive design considered
- [ ] Code follows DRY principle
- [ ] Import order is clean and consistent
- [ ] File and folder naming follows conventions

---

## References

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Official Docs](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
