# Lanyon-Inspired Theming Plan with Dark/Light Mode

## Overview

This plan outlines the implementation of a Lanyon-inspired design system with toggleable dark/light themes for the Next.js blog. The plan focuses on matching Lanyon's elegant, content-first aesthetic while adding modern theme switching capabilities.

---

## 1. Design Tokens (from Lanyon CSS)

### Typography

```css
/* Fonts */
--font-serif: 'PT Serif', Georgia, 'Times New Roman', serif;
--font-sans: 'PT Sans', Helvetica, Arial, sans-serif;

/* Font Sizes (rem units for scalability) */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.25rem; /* 20px */
--text-xl: 1.5rem; /* 24px */
--text-2xl: 2rem; /* 32px */
--text-3xl: 2.5rem; /* 40px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-bold: 700;

/* Letter Spacing */
--tracking-tight: -0.025rem;
```

### Colors (Lanyon Base16 Themes)

**Light Mode (Default):**

```css
--bg-primary: #ffffff;
--bg-secondary: #f9f9f9;
--bg-sidebar: #202020;

--text-primary: #313131;
--text-secondary: #515151;
--text-muted: #9a9a9a;
--text-sidebar: rgba(255, 255, 255, 0.6);
--text-sidebar-active: #ffffff;

--border-color: #e5e5e5;
--link-color: #268bd2; /* Blue accent */
--link-hover: #1e6fa8;
```

**Dark Mode:**

```css
--bg-primary: #1a1a1a;
--bg-secondary: #202020;
--bg-sidebar: #0a0a0a;

--text-primary: #e0e0e0;
--text-secondary: #b0b0b0;
--text-muted: #707070;
--text-sidebar: rgba(255, 255, 255, 0.5);
--text-sidebar-active: #ffffff;

--border-color: #2a2a2a;
--link-color: #6a9fb5; /* Softer blue for dark */
--link-hover: #8bb9d0;
```

**8 Optional Theme Colors** (for accent/customization):

```css
--theme-red: #ac4142;
--theme-orange: #d28445;
--theme-yellow: #f4bf75;
--theme-green: #90a959;
--theme-cyan: #75b5aa;
--theme-blue: #6a9fb5;
--theme-magenta: #aa759f;
--theme-brown: #8f5536;
```

### Spacing & Layout

```css
/* Spacing Scale */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.5rem; /* 24px */
--space-6: 2rem; /* 32px */
--space-8: 3rem; /* 48px */
--space-10: 4rem; /* 64px */

/* Container Widths */
--container-sm: 28rem; /* 448px */
--container-md: 32rem; /* 512px */
--container-lg: 38rem; /* 608px */

/* Sidebar */
--sidebar-width: 14rem; /* 224px */

/* Breakpoints */
--bp-sm: 30em; /* 480px */
--bp-md: 38em; /* 608px */
--bp-lg: 48em; /* 768px */
--bp-xl: 56em; /* 896px */
```

### Effects & Transitions

```css
--transition-fast: 0.15s ease-in-out;
--transition-base: 0.3s ease-in-out;
--shadow-sm: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.1);
--shadow-md: 0.5rem 0 1rem rgba(0, 0, 0, 0.15);
--border-radius: 0.25rem;
```

---

## 2. Implementation Structure

### File Structure

```
/app
  /globals.css          # Tailwind + CSS variables
  /layout.tsx           # Add theme provider
/components
  /ThemeToggle.tsx      # New: Dark/light mode toggle button
  /ThemeProvider.tsx    # New: Context for theme state
  /Header.tsx           # Update: Add ThemeToggle
  /Footer.tsx
  /PostList.tsx
  /Pagination.tsx
/lib
  /theme-config.ts      # New: Theme constants and utilities
/hooks
  /useTheme.ts          # New: Custom hook for theme management
```

---

## 3. Step-by-Step Implementation Guide

### Phase 1: Setup Theme Infrastructure

#### Step 1.1: Create Theme Provider

**File: `components/ThemeProvider.tsx`**

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### Step 1.2: Create Theme Toggle Component

**File: `components/ThemeToggle.tsx`**

```typescript
'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )}
    </button>
  );
}
```

### Phase 2: Configure Tailwind v4 & CSS Variables

#### Step 2.1: Update globals.css

**File: `app/globals.css`**

**Note:** This project uses **Tailwind CSS v4**, which uses CSS-based configuration via `@theme` instead of `tailwind.config.ts`.

```css
@import 'tailwindcss';

/* Tailwind v4 Theme Configuration */
@theme {
  /* Custom colors referencing CSS variables */
  --color-primary: var(--bg-primary);
  --color-secondary: var(--bg-secondary);
  --color-sidebar: var(--bg-sidebar);
  --color-border: var(--border-color);

  /* Text colors */
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);

  /* Link colors */
  --color-link: var(--link-color);
  --color-link-hover: var(--link-hover);

  /* Font families */
  --font-family-sans: var(--font-sans);
  --font-family-serif: var(--font-serif);

  /* Spacing - Container max-width */
  --width-container: 38rem;

  /* Breakpoints (Tailwind v4 uses same breakpoint names) */
  --breakpoint-sm: 30rem;
  --breakpoint-md: 38rem;
  --breakpoint-lg: 48rem;
  --breakpoint-xl: 56rem;
}

/* CSS Variables for Light Mode */
:root {
  /* Typography */
  --font-serif: 'PT Serif', Georgia, 'Times New Roman', serif;
  --font-sans: 'PT Sans', Helvetica, Arial, sans-serif;

  /* Colors - Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9f9;
  --bg-sidebar: #202020;

  --text-primary: #313131;
  --text-secondary: #515151;
  --text-muted: #9a9a9a;
  --text-sidebar: rgba(255, 255, 255, 0.6);
  --text-sidebar-active: #ffffff;

  --border-color: #e5e5e5;
  --link-color: #268bd2;
  --link-hover: #1e6fa8;

  /* Spacing */
  --container-max: 38rem;
  --sidebar-width: 14rem;

  /* Effects */
  --transition: 0.3s ease-in-out;
  --shadow: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.1);
}

/* Dark Mode Variables */
.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #202020;
  --bg-sidebar: #0a0a0a;

  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #707070;
  --text-sidebar: rgba(255, 255, 255, 0.5);
  --text-sidebar-active: #ffffff;

  --border-color: #2a2a2a;
  --link-color: #6a9fb5;
  --link-hover: #8bb9d0;

  --shadow: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.3);
}

/* Base Styles */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition:
    background-color var(--transition),
    color var(--transition);
  font-family: var(--font-serif);
  line-height: 1.75;
}

/* Headings use PT Sans */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-sans);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.025rem;
  color: var(--text-primary);
}

/* Links */
a {
  color: var(--link-color);
  transition: color var(--transition);
}

a:hover {
  color: var(--link-hover);
}

/* Container */
.container {
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Code blocks */
code {
  font-family: Menlo, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
}

pre {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 1rem;
  overflow-x: auto;
}

/* Markdown content styling (for react-markdown) */
.markdown-content {
  color: var(--text-primary);
  font-family: var(--font-serif);
  line-height: 1.75;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.025rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.markdown-content h1 {
  font-size: 2.5rem;
}
.markdown-content h2 {
  font-size: 2rem;
}
.markdown-content h3 {
  font-size: 1.5rem;
}
.markdown-content h4 {
  font-size: 1.25rem;
}
.markdown-content h5 {
  font-size: 1rem;
}
.markdown-content h6 {
  font-size: 0.875rem;
}

.markdown-content p {
  margin-bottom: 1.5rem;
}

.markdown-content a {
  color: var(--link-color);
  text-decoration: none;
  transition: color var(--transition);
}

.markdown-content a:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

.markdown-content strong {
  font-weight: 700;
  color: var(--text-primary);
}

.markdown-content em {
  font-style: italic;
}

.markdown-content code {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: Menlo, Monaco, 'Courier New', monospace;
}

.markdown-content pre {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.markdown-content ul {
  list-style-type: disc;
}

.markdown-content ol {
  list-style-type: decimal;
}

.markdown-content li {
  margin-bottom: 0.5rem;
}

.markdown-content li > ul,
.markdown-content li > ol {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content blockquote {
  border-left: 0.25rem solid var(--border-color);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-style: italic;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1.5rem 0;
  box-shadow: var(--shadow);
}

.markdown-content hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2rem 0;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.markdown-content table th,
.markdown-content table td {
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.markdown-content table th {
  background-color: var(--bg-secondary);
  font-weight: 700;
  font-family: var(--font-sans);
}
```

#### Step 2.2: Using Tailwind Classes with Custom Variables

**Note:** With Tailwind v4, you can now use your custom theme tokens directly in utility classes:

```tsx
// Use custom colors
<div className="bg-primary text-text-primary">

// Use custom fonts
<h1 className="font-sans">Heading</h1>
<p className="font-serif">Body text</p>

// Use custom widths
<div className="max-w-container">

// Or continue using CSS variables with arbitrary values
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
```

**Dark mode** is automatically enabled in Tailwind v4 when you use the `.dark` class on the `<html>` element.

### Phase 3: Update Components

#### Step 3.1: Update Layout

**File: `app/layout.tsx`**

```typescript
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SITE_CONFIG } from '@/lib/site-config';
import type { Metadata } from 'next';
import { PT_Sans, PT_Serif } from 'next/font/google';
import './globals.css';

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${ptSerif.variable}`}>
      <body className="flex min-h-screen flex-col font-serif antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Step 3.2: Update Header Component

**File: `components/Header.tsx`**

```typescript
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/site-config';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="container mx-auto flex items-center justify-between px-4 py-6">
        <div>
          <Link
            href="/"
            className="font-sans text-2xl font-normal no-underline transition-colors hover:text-[var(--link-hover)]"
          >
            {SITE_CONFIG.title}
          </Link>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {SITE_CONFIG.description}
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

#### Step 3.3: Update Post Page for Markdown Styling

**File: `app/posts/[slug]/page.tsx`**

**IMPORTANT:** Add the `.markdown-content` class to your Markdown container so the styles from `globals.css` apply:

```typescript
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-container px-4 py-12">
      <article>
        <h1 className="mb-2 font-sans text-4xl font-normal tracking-tight text-text-primary">
          {post.title}
        </h1>
        <time
          dateTime={post.date}
          className="mb-8 block text-sm text-text-secondary"
        >
          {formatDate(post.date)}
        </time>

        {/* Add markdown-content class here */}
        <div className="markdown-content">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

**Key changes:**

- Added `markdown-content` class to the Markdown wrapper
- Updated typography to use Tailwind custom classes
- Added proper spacing with `max-w-container`
- Styled the title and date with Lanyon aesthetic

#### Step 3.4: Update Other Components

Apply similar Lanyon-inspired styling to:

- `Footer.tsx`: Use CSS variables for colors, add spacing
- `PostList.tsx`: Style post list with proper spacing and typography
- `Pagination.tsx`: Style buttons with Lanyon aesthetic
- `app/page.tsx`: Add container classes

### Phase 4: Responsive Design

Add responsive breakpoints following Lanyon's mobile-first approach:

```css
/* Mobile (default) */
.container {
  max-width: 28rem;
}

/* Tablet */
@media (min-width: 38em) {
  .container {
    max-width: 32rem;
  }
}

/* Desktop */
@media (min-width: 56em) {
  .container {
    max-width: 38rem;
  }
}
```

### Phase 5: Testing & Refinement

1. **Test theme persistence**: Reload page, theme should persist
2. **Test SSR**: Ensure no flash of unstyled content
3. **Test responsive**: Check all breakpoints
4. **Test accessibility**: Keyboard navigation, screen readers
5. **Test performance**: Check for layout shifts

---

## 4. Key Lanyon Design Principles to Follow

### Typography

- Use **PT Serif** for body text (already using PT Sans, add PT Serif)
- Use **PT Sans** for headings and UI elements
- Font size: **16px base** (1rem)
- Line height: **1.75** for body, **1.25** for headings
- Letter spacing: **-0.025rem** for headings

### Layout

- **Content-first**: Keep max-width narrow (38rem max)
- **Generous whitespace**: Use 4rem margins between sections
- **Centered content**: Container with auto margins
- **Mobile-first**: Start narrow, scale up

### Colors

- **Subtle backgrounds**: Nearly white (#f9f9f9) vs pure white
- **Readable text**: Good contrast (#313131 on white)
- **Muted secondaries**: Lighter gray for less important text
- **Accent color**: One primary link color (default blue)

### Interactive Elements

- **Smooth transitions**: 0.3s ease-in-out
- **Subtle hover states**: Slightly darker link color
- **No heavy shadows**: Light shadow (0.25rem offset)
- **Minimal borders**: Use sparingly, thin borders

---

## 5. Optional Enhancements

### Add Sidebar (Later)

If you want the full Lanyon experience:

- Toggleable sidebar with CSS-only hamburger menu
- Navigation links
- Slide-in animation
- Overlay when open

### Add Theme Color Picker (Advanced)

Allow users to choose from 8 Lanyon accent colors (red, orange, yellow, green, cyan, blue, magenta, brown):

- Create `lib/theme-config.ts` with color definitions
- Store preference in localStorage
- Update CSS variable `--link-color` dynamically
- Show color palette picker in settings or header

### Add Reading Time

- Calculate from post content
- Display next to date

### Add Table of Contents

- Parse markdown headings
- Sticky sidebar TOC for long posts

---

## 6. Implementation Checklist

### Core Theme System

- [ ] Create `components/ThemeProvider.tsx` component
- [ ] Create `components/ThemeToggle.tsx` component
- [ ] Update `app/globals.css` with `@theme` block and CSS variables (Tailwind v4)
- [ ] Install PT Serif font alongside PT Sans in `app/layout.tsx`
- [ ] Update `app/layout.tsx` with ThemeProvider wrapper

### Component Updates

- [ ] Update `components/Header.tsx` with ThemeToggle button
- [ ] Update `components/Footer.tsx` styling
- [ ] Update `components/PostList.tsx` styling
- [ ] Update `components/Pagination.tsx` styling
- [ ] Update `app/posts/[slug]/page.tsx` with `markdown-content` class wrapper

### Testing & Validation

- [ ] Test theme toggle functionality (click sun/moon icon)
- [ ] Test theme persistence (reload page, theme should persist)
- [ ] Test responsive design at all breakpoints (mobile, tablet, desktop)
- [ ] Test accessibility (keyboard navigation, ARIA labels, screen readers)
- [ ] Verify no FOUC (flash of unstyled content on page load)
- [ ] Test SSR compatibility (server-side rendering works correctly)
- [ ] Test markdown content styling (all elements render correctly)
- [ ] Test dark mode styling (all components look good in dark mode)

---

## 7. Resources

### Lanyon References

- [Lanyon GitHub Repository](https://github.com/poole/lanyon)
- [Lanyon Demo Site](https://lanyon.getpoole.com/)
- [Lanyon CSS File](https://github.com/poole/lanyon/blob/master/public/css/lanyon.css)

### Next.js Theme Resources

- [Next.js App Router Styling](https://nextjs.org/docs/app/building-your-application/styling)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next Themes Package](https://github.com/pacocoursey/next-themes)

---

## Final Notes

This plan provides a complete roadmap for implementing Lanyon-inspired theming with **Tailwind CSS v4**. The implementation is broken into phases so you can work incrementally. Focus on Phase 1-3 first for core functionality, then add refinements in Phase 4-5.

### Key Tailwind v4 Differences:

- ✅ **No `tailwind.config.ts` needed** - Everything configured in CSS via `@theme`
- ✅ **CSS-based configuration** - More intuitive and maintainable
- ✅ **Direct CSS variable access** - Use `bg-primary` instead of `bg-[var(--bg-primary)]`
- ✅ **Automatic dark mode** - Just add `.dark` class to `<html>`

The design maintains Lanyon's elegant simplicity while adding modern dark mode support. All spacing, colors, and typography values are extracted from the original Lanyon CSS for authenticity.

Good luck with implementation! 🚀
