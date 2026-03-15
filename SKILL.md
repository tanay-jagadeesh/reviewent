# Frontend Design - Universal Skill Guide

## Overview

This document provides a comprehensive guide for frontend design work across any repository. Use this as a reference for building, styling, and maintaining frontend interfaces with modern best practices.

**Scope**: UI/UX implementation, component design, styling systems, responsive layouts, accessibility, and frontend architecture.

---

## Table of Contents

1. [Tech Stack Detection](#tech-stack-detection)
2. [Project Structure](#project-structure)
3. [Design System Setup](#design-system-setup)
4. [Component Patterns](#component-patterns)
5. [Styling Approaches](#styling-approaches)
6. [Responsive Design](#responsive-design)
7. [Accessibility (a11y)](#accessibility-a11y)
8. [Performance Optimization](#performance-optimization)
9. [Design Tools Integration](#design-tools-integration)
10. [Testing Frontend](#testing-frontend)
11. [Common Workflows](#common-workflows)
12. [Troubleshooting](#troubleshooting)

---

## Tech Stack Detection

### Quick Detection Commands

```bash
# Check for framework/library
ls package.json         # Node.js project
cat package.json | grep -E "react|vue|angular|svelte|solid"

# Check for styling solutions
cat package.json | grep -E "tailwind|styled-components|emotion|sass|less"

# Check for build tools
cat package.json | grep -E "vite|webpack|parcel|rollup|esbuild"

# Check for TypeScript
ls tsconfig.json

# Check for design tokens/system
ls -la | grep -E "tokens|design-system|theme"
```

### Common Stack Combinations

**React Ecosystem**:
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "@types/react": "^18.x",        // TypeScript
  "vite": "^5.x",                  // Build tool
  "tailwindcss": "^3.x",          // Utility CSS
  "framer-motion": "^11.x"        // Animations
}
```

**Vue Ecosystem**:
```json
{
  "vue": "^3.x",
  "vite": "^5.x",
  "pinia": "^2.x",                // State management
  "vue-router": "^4.x",           // Routing
  "sass": "^1.x"                  // Preprocessing
}
```

**Angular Ecosystem**:
```json
{
  "@angular/core": "^17.x",
  "@angular/material": "^17.x",   // Material Design
  "rxjs": "^7.x",                 // Reactive programming
  "typescript": "^5.x"
}
```

**Svelte Ecosystem**:
```json
{
  "svelte": "^4.x",
  "@sveltejs/kit": "^2.x",
  "tailwindcss": "^3.x"
}
```

---

## Project Structure

### Recommended Frontend Organization

```
src/
├── assets/                      # Static assets
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── videos/
├── components/                  # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Modal/
│   ├── layout/                  # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Container/
│   └── features/                # Feature-specific components
│       ├── UserProfile/
│       ├── Dashboard/
│       └── Settings/
├── pages/                       # Page components/routes
│   ├── Home/
│   ├── About/
│   └── Contact/
├── hooks/                       # Custom hooks (React)
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useMediaQuery.ts
├── styles/                      # Global styles
│   ├── globals.css
│   ├── variables.css
│   ├── reset.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── utils/                       # Utility functions
│   ├── classNames.ts
│   ├── formatters.ts
│   └── validators.ts
├── types/                       # TypeScript types
│   ├── index.ts
│   └── api.ts
├── constants/                   # Constants and config
│   ├── colors.ts
│   ├── breakpoints.ts
│   └── routes.ts
└── lib/                         # Third-party integrations
    ├── api.ts
    └── analytics.ts
```

### Design System Structure

```
design-system/
├── tokens/                      # Design tokens
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   ├── shadows.json
│   └── breakpoints.json
├── components/                  # Component library
│   ├── primitives/             # Atomic components
│   ├── patterns/               # Composed patterns
│   └── templates/              # Page templates
├── docs/                        # Documentation
│   ├── design-principles.md
│   ├── component-guidelines.md
│   └── accessibility.md
└── stories/                     # Storybook stories
    └── *.stories.tsx
```

---

## Design System Setup

### 1. Design Tokens

**CSS Custom Properties** (Recommended):
```css
/* tokens/colors.css */
:root {
  /* Brand Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-900: #0c4a6e;

  /* Neutral Colors */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-500: #737373;
  --color-neutral-900: #171717;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}

/* tokens/spacing.css */
:root {
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
}

/* tokens/typography.css */
:root {
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* tokens/shadows.css */
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* tokens/breakpoints.css */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

**JavaScript/TypeScript Tokens**:
```typescript
// tokens/colors.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    500: '#737373',
    900: '#171717',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

// tokens/spacing.ts
export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
} as const;

// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
```

**Tailwind Configuration**:
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### 2. Theme System

**CSS-based Theme Switching**:
```css
/* themes/light.css */
[data-theme="light"] {
  --bg-primary: var(--color-neutral-50);
  --bg-secondary: var(--color-neutral-100);
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-500);
  --border-color: var(--color-neutral-200);
}

/* themes/dark.css */
[data-theme="dark"] {
  --bg-primary: var(--color-neutral-900);
  --bg-secondary: var(--color-neutral-800);
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-400);
  --border-color: var(--color-neutral-700);
}

/* Usage */
.container {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

**React Theme Provider**:
```typescript
// ThemeProvider.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const activeTheme = theme === 'system' ? systemTheme : theme;
    setResolvedTheme(activeTheme);
    root.setAttribute('data-theme', activeTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

---

## Component Patterns

### 1. Atomic Design Methodology

**Atoms** (Smallest building blocks):
```typescript
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Molecules** (Simple component groups):
```typescript
// components/ui/FormField/FormField.tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FormField({ label, error, required, children, htmlFor }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-label="required">*</span>}
      </label>
      <div className="form-field__input">{children}</div>
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

**Organisms** (Complex components):
```typescript
// components/features/UserProfile/UserProfile.tsx
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface UserProfileProps {
  user: {
    name: string;
    avatar: string;
    bio: string;
    stats: {
      followers: number;
      following: number;
      posts: number;
    };
  };
  onFollow: () => void;
  isFollowing: boolean;
}

export function UserProfile({ user, onFollow, isFollowing }: UserProfileProps) {
  return (
    <Card>
      <div className="user-profile">
        <Avatar src={user.avatar} alt={user.name} size="lg" />
        <h2 className="user-profile__name">{user.name}</h2>
        <p className="user-profile__bio">{user.bio}</p>

        <div className="user-profile__stats">
          <div className="stat">
            <span className="stat__value">{user.stats.posts}</span>
            <span className="stat__label">Posts</span>
          </div>
          <div className="stat">
            <span className="stat__value">{user.stats.followers}</span>
            <span className="stat__label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat__value">{user.stats.following}</span>
            <span className="stat__label">Following</span>
          </div>
        </div>

        <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={onFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
    </Card>
  );
}
```

### 2. Composition Patterns

**Compound Components**:
```typescript
// components/ui/Tabs/Tabs.tsx
import { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tabs__list" role="tablist">{children}</div>;
}

export function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  if (context.activeTab !== value) return null;

  return (
    <div className="tabs__panel" role="tabpanel">
      {children}
    </div>
  );
}

// Usage:
// <Tabs defaultTab="profile">
//   <TabList>
//     <Tab value="profile">Profile</Tab>
//     <Tab value="settings">Settings</Tab>
//   </TabList>
//   <TabPanel value="profile">Profile content</TabPanel>
//   <TabPanel value="settings">Settings content</TabPanel>
// </Tabs>
```

**Render Props**:
```typescript
// components/ui/Toggle/Toggle.tsx
interface ToggleProps {
  children: (props: { isOn: boolean; toggle: () => void }) => React.ReactNode;
  defaultOn?: boolean;
}

export function Toggle({ children, defaultOn = false }: ToggleProps) {
  const [isOn, setIsOn] = useState(defaultOn);
  const toggle = () => setIsOn(!isOn);

  return <>{children({ isOn, toggle })}</>;
}

// Usage:
// <Toggle>
//   {({ isOn, toggle }) => (
//     <button onClick={toggle}>
//       {isOn ? 'Turn Off' : 'Turn On'}
//     </button>
//   )}
// </Toggle>
```

---

## Styling Approaches

### 1. CSS Modules

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.primary {
  background-color: var(--color-primary-500);
  color: white;
}

.primary:hover {
  background-color: var(--color-primary-600);
}

.secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}

.sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
}
```

### 2. Styled Components (CSS-in-JS)

```typescript
// Button.styled.ts
import styled from 'styled-components';

interface ButtonStyledProps {
  $variant?: 'primary' | 'secondary';
  $size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: `
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  md: `
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  lg: `
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `,
};

export const StyledButton = styled.button<ButtonStyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  ${({ $size = 'md' }) => sizeStyles[$size]}

  ${({ $variant = 'primary', theme }) =>
    $variant === 'primary'
      ? `
        background-color: ${theme.colors.primary[500]};
        color: white;

        &:hover {
          background-color: ${theme.colors.primary[600]};
        }
      `
      : `
        background-color: transparent;
        color: ${theme.colors.primary[500]};
        border: 1px solid ${theme.colors.primary[500]};

        &:hover {
          background-color: ${theme.colors.primary[50]};
        }
      `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### 3. Tailwind CSS

```typescript
// Button.tsx (with Tailwind)
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/classNames';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        secondary: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
        ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

### 4. Utility Function for Class Names

```typescript
// utils/classNames.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage:
// cn('base-class', condition && 'conditional-class', { 'object-class': true })
```

---

## Responsive Design

### 1. Breakpoint System

**Mobile-First Approach**:
```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
  font-size: 0.875rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
    font-size: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large desktop and up */
@media (min-width: 1280px) {
  .container {
    max-width: 1400px;
  }
}
```

**React Hook for Responsive Detection**:
```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage:
// const isMobile = useMediaQuery('(max-width: 768px)');
// const isDesktop = useMediaQuery('(min-width: 1024px)');
```

**Breakpoint Hook**:
```typescript
// hooks/useBreakpoint.ts
import { useMediaQuery } from './useMediaQuery';

export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2Xl = useMediaQuery('(min-width: 1536px)');

  const breakpoint = is2Xl
    ? '2xl'
    : isXl
    ? 'xl'
    : isLg
    ? 'lg'
    : isMd
    ? 'md'
    : isSm
    ? 'sm'
    : 'xs';

  return {
    breakpoint,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
  };
}

// Usage:
// const { isMobile, isDesktop } = useBreakpoint();
```

### 2. Responsive Container

```typescript
// components/layout/Container/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

export function Container({ children, size = 'lg', className }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}
```

### 3. Responsive Grid

```css
/* Responsive Grid System */
.grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(1, 1fr); /* Mobile: 1 column */
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* Large: 4 columns */
  }
}

/* Tailwind equivalent */
/* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 */
```

---

## Accessibility (a11y)

### 1. Semantic HTML

```html
<!-- ✅ Good: Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>

  <aside aria-label="Related articles">
    <h2>Related</h2>
    <ul>
      <li><a href="/related-1">Related Article 1</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2026 Company Name</p>
</footer>

<!-- ❌ Bad: Non-semantic HTML -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
```

### 2. ARIA Attributes

```typescript
// components/ui/Dialog/Dialog.tsx
import { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      ref={dialogRef}
      tabIndex={-1}
      className="dialog-overlay"
      onClick={onClose}
    >
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 id="dialog-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="dialog-close"
          >
            ×
          </button>
        </div>
        <div id="dialog-description" className="dialog-body">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 3. Keyboard Navigation

```typescript
// components/ui/Dropdown/Dropdown.tsx
import { useState, useRef, useEffect } from 'react';

export function Dropdown({ trigger, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          items[focusedIndex].onClick();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      {isOpen && (
        <ul role="menu" aria-label="Dropdown menu">
          {items.map((item, index) => (
            <li
              key={item.id}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 4. Focus Management

```typescript
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }, []);

  return ref;
}
```

### 5. Screen Reader Support

```typescript
// components/ui/VisuallyHidden/VisuallyHidden.tsx
import styles from './VisuallyHidden.module.css';

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className={styles.visuallyHidden}>{children}</span>;
}

// VisuallyHidden.module.css
.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Usage:
// <button>
//   <IconTrash />
//   <VisuallyHidden>Delete item</VisuallyHidden>
// </button>
```

### 6. Accessibility Checklist

- [ ] All images have meaningful `alt` text
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Form inputs have associated labels
- [ ] Semantic HTML is used (header, nav, main, footer, article, section)
- [ ] ARIA attributes are used correctly
- [ ] Skip navigation links are provided
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Interactive elements have appropriate roles
- [ ] Error messages are announced to screen readers
- [ ] Modal dialogs trap focus
- [ ] Loading states are announced

---

## Performance Optimization

### 1. Code Splitting

```typescript
// React lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Image Optimization

```typescript
// components/ui/Image/OptimizedImage.tsx
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-wrapper ${className || ''}`}>
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`image ${isLoaded ? 'image--loaded' : ''}`}
      />
    </div>
  );
}

// For modern formats with fallback:
// <picture>
//   <source srcSet="image.webp" type="image/webp" />
//   <source srcSet="image.avif" type="image/avif" />
//   <img src="image.jpg" alt="Description" />
// </picture>
```

### 3. Memoization

```typescript
// React.memo for component memoization
import { memo } from 'react';

interface ExpensiveComponentProps {
  data: ComplexData;
  onAction: () => void;
}

export const ExpensiveComponent = memo(
  ({ data, onAction }: ExpensiveComponentProps) => {
    return <div>{/* Complex rendering */}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return prevProps.data.id === nextProps.data.id;
  }
);

// useMemo for expensive calculations
import { useMemo } from 'react';

function DataList({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return <ul>{sortedItems.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
}

// useCallback for function memoization
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={handleClick} />;
}
```

### 4. Virtual Scrolling

```typescript
// Using react-window for large lists
import { FixedSizeList } from 'react-window';

interface VirtualListProps {
  items: string[];
}

export function VirtualList({ items }: VirtualListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="list-item">
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 5. Debouncing and Throttling

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
// const SearchInput = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//
//   useEffect(() => {
//     if (debouncedSearchTerm) {
//       // Perform search
//     }
//   }, [debouncedSearchTerm]);
//
//   return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
// };

// hooks/useThrottle.ts
import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}
```

---

## Design Tools Integration

### 1. Figma to Code

**Figma Variables → CSS Custom Properties**:
```css
/* Export from Figma design tokens */
:root {
  /* Figma color variables */
  --color-primary: #0ea5e9;
  --color-secondary: #8b5cf6;

  /* Figma spacing variables */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  /* Figma typography variables */
  --font-size-body: 16px;
  --font-size-heading: 24px;
  --line-height-body: 1.5;
}
```

**Figma Plugins**:
- **Tokens Studio**: Export design tokens as JSON
- **Figma to Code**: Generate React/Vue/HTML components
- **Anima**: Export responsive components
- **Inspect**: Get CSS values directly

### 2. Storybook Integration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;

// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

### 3. Design Token Management

```javascript
// tokens.config.js (Style Dictionary)
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/tokens/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/styles/tokens/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
```

---

## Testing Frontend

### 1. Component Testing (Vitest + Testing Library)

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('secondary');
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has accessible name', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
```

### 2. Visual Regression Testing (Chromatic/Percy)

```typescript
// Button.visual.test.tsx
import { test, expect } from '@playwright/test';

test.describe('Button Visual Tests', () => {
  test('primary button', async ({ page }) => {
    await page.goto('/storybook?path=/story/ui-button--primary');
    await expect(page).toHaveScreenshot('button-primary.png');
  });

  test('button hover state', async ({ page }) => {
    await page.goto('/storybook?path=/story/ui-button--primary');
    await page.hover('button');
    await expect(page).toHaveScreenshot('button-primary-hover.png');
  });

  test('button focus state', async ({ page }) => {
    await page.goto('/storybook?path=/story/ui-button--primary');
    await page.focus('button');
    await expect(page).toHaveScreenshot('button-primary-focus.png');
  });
});
```

### 3. Accessibility Testing

```typescript
// Button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible focus indicator', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container, {
      rules: {
        'focus-order-semantics': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
```

### 4. E2E Testing (Playwright)

```typescript
// e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Submission Flow', () => {
  test('user can submit contact form', async ({ page }) => {
    await page.goto('/contact');

    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Hello world');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toHaveText(
      'Thank you for your message!'
    );
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/contact');
    await page.click('button[type="submit"]');

    // Check for error messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});
```

---

## Common Workflows

### 1. Starting a New Component

```bash
# Create component structure
mkdir -p src/components/ui/ComponentName
touch src/components/ui/ComponentName/ComponentName.tsx
touch src/components/ui/ComponentName/ComponentName.module.css
touch src/components/ui/ComponentName/ComponentName.test.tsx
touch src/components/ui/ComponentName/ComponentName.stories.tsx
touch src/components/ui/ComponentName/index.ts

# Component template
cat > src/components/ui/ComponentName/ComponentName.tsx << 'EOF'
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentName({ children, className }: ComponentNameProps) {
  return (
    <div className={`${styles.component} ${className || ''}`}>
      {children}
    </div>
  );
}
EOF

# Export
cat > src/components/ui/ComponentName/index.ts << 'EOF'
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
EOF
```

### 2. Adding Icons

**Using React Icons**:
```typescript
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';

function Navigation() {
  return (
    <nav>
      <a href="/"><FiHome /> Home</a>
      <a href="/settings"><FiSettings /> Settings</a>
      <a href="/profile"><FiUser /> Profile</a>
    </nav>
  );
}
```

**Custom Icon Component**:
```typescript
// components/ui/Icon/Icon.tsx
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function Icon({ name, size = 'md', color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      fill={color}
      className={`icon ${className || ''}`}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
```

### 3. Form Handling

**React Hook Form**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Name" error={errors.name?.message}>
        <input {...register('name')} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <input type="email" {...register('email')} />
      </FormField>

      <FormField label="Message" error={errors.message?.message}>
        <textarea {...register('message')} />
      </FormField>

      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

### 4. Animation Patterns

**Framer Motion**:
```typescript
import { motion } from 'framer-motion';

// Fade in
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Slide in
export function SlideIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children
export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
```

**CSS Transitions**:
```css
/* Smooth transitions */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Keyframe animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. State Management Patterns

**Context + useReducer**:
```typescript
// contexts/AppContext.tsx
import { createContext, useContext, useReducer } from 'react';

interface State {
  user: User | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: State = {
  user: null,
  theme: 'light',
  isLoading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
```

---

## Troubleshooting

### Common Issues

#### 1. CSS Not Applying

```bash
# Check CSS module naming
# Ensure file ends with .module.css
# Import as: import styles from './Component.module.css'

# Check class name application
# Use: className={styles.myClass}
# Not: className="myClass"

# Clear cache
rm -rf node_modules/.cache
```

#### 2. Component Not Updating

```typescript
// Check if props are being mutated (anti-pattern)
// ❌ Bad
props.data.push(newItem);

// ✅ Good
const newData = [...props.data, newItem];

// Check dependency arrays in useEffect/useMemo/useCallback
useEffect(() => {
  // This will only run once
}, []); // ← Empty array

useEffect(() => {
  // This runs when `data` changes
}, [data]); // ← Include dependencies
```

#### 3. Build Errors

```bash
# Type errors
npm run type-check
# or
tsc --noEmit

# Clear build cache
rm -rf dist .vite node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. Style Conflicts

```css
/* Use CSS reset/normalize */
@import 'normalize.css';

/* Use CSS modules for scoping */
/* Component.module.css */

/* Or use unique prefixes */
.myapp-button { }
.myapp-card { }

/* Or use CSS-in-JS for automatic scoping */
```

#### 5. Performance Issues

```typescript
// Use React DevTools Profiler
// Identify expensive renders

// Memoize expensive operations
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Virtualize long lists
import { FixedSizeList } from 'react-window';

// Code split large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## Best Practices Summary

### ✅ Do

- Use semantic HTML elements
- Implement responsive design mobile-first
- Follow accessibility guidelines (WCAG 2.1 AA)
- Write component tests
- Use TypeScript for type safety
- Implement design tokens for consistency
- Optimize images and assets
- Use CSS custom properties for theming
- Implement proper error boundaries
- Document components with Storybook
- Use meaningful component and prop names
- Implement loading and error states
- Follow consistent naming conventions
- Use git for version control
- Write clear commit messages

### ❌ Don't

- Don't use inline styles excessively
- Don't ignore accessibility
- Don't hardcode values (use tokens)
- Don't mutate props or state directly
- Don't skip testing
- Don't over-optimize prematurely
- Don't ignore browser compatibility
- Don't use nested ternaries excessively
- Don't create deeply nested components
- Don't forget to clean up side effects
- Don't use `any` in TypeScript
- Don't commit console.logs
- Don't ignore ESLint warnings
- Don't skip code reviews

---

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [React Documentation](https://react.dev/)
- [Vue Documentation](https://vuejs.org/)
- [Angular Documentation](https://angular.io/)
- [Svelte Documentation](https://svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tools
- [Figma](https://www.figma.com/)
- [Storybook](https://storybook.js.org/)
- [Chromatic](https://www.chromatic.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Learning
- [Frontend Masters](https://frontendmasters.com/)
- [Scrimba](https://scrimba.com/)
- [CSS-Tricks](https://css-tricks.com/)
- [Smashing Magazine](https://www.smashingmagazine.com/)

---

**Last Updated**: March 2026
**Applies To**: All frontend projects (React, Vue, Angular, Svelte, etc.)