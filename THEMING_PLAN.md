# Implementation Plan: Hybrid Tailwind + Lanyon Base Styles with Dark/Light Mode

## Goal

Implement a Lanyon-inspired design system with:

- ✅ Dark/light mode support
- ✅ Merriweather font (as configured in `layout.tsx`)
- ✅ Hybrid approach: Tailwind utilities + CSS base styles
- ✅ Clean, maintainable component code

## Current State

- **Font:** Merriweather (400, 700) in `layout.tsx`
- **CSS:** 25 lines in `globals.css` with 6 basic CSS variables
- **Styling:** Pure Tailwind utility classes
- **Theme:** Light mode only

## Target State

- **Fonts:** Merriweather via Next.js optimization (applied to body, inherited everywhere)
- **CSS:** ~170 total lines split into two files:
  - `globals.css`: ~100 lines (base styles, variables, no font declarations)
  - `markdown.css`: ~70 lines (markdown content styling, easy to replace)
- **Styling:** Hybrid (base styles + Tailwind utilities)
- **Theme:** Dark/light mode with theme toggle

---

## Implementation Steps

### Phase 1: Create Theme Infrastructure

#### Step 1.1: Create ThemeProvider Component

**File:** `components/ThemeProvider.tsx` (NEW FILE)

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

#### Step 1.2: Create ThemeToggle Component

**File:** `components/ThemeToggle.tsx` (NEW FILE)

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

---

### Phase 2: Create CSS Files

#### Step 2.1: Replace globals.css Content

**File:** `app/globals.css` (REPLACE ENTIRE FILE)

```css
@import 'tailwindcss';

/* ============================================
   CSS VARIABLES - DESIGN TOKENS
   ============================================ */

:root {
  /* Colors - Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f9f9f9;

  --text-primary: #313131;
  --text-secondary: #515151;
  --text-muted: #9a9a9a;

  --border-color: #e5e5e5;
  --link-color: #268bd2;
  --link-hover: #1e6fa8;

  /* Layout */
  --container-max: 38rem;

  /* Effects */
  --transition: 0.3s ease-in-out;
  --shadow: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.1);
}

/* Dark Mode Variables */
.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #202020;

  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #707070;

  --border-color: #2a2a2a;
  --link-color: #6a9fb5;
  --link-hover: #8bb9d0;

  --shadow: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.3);
}

/* ============================================
   BASE STYLES
   ============================================ */

html {
  overflow-y: scroll;
  scrollbar-gutter: stable;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition:
    background-color var(--transition),
    color var(--transition);
  font-size: 16px;
  line-height: 1.75;
}

/* Headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.25;
  letter-spacing: -0.025rem;
}

/* Links */
a {
  color: var(--link-color);
  text-decoration: none;
  transition: color var(--transition);
}

a:hover {
  color: var(--link-hover);
}
```

**Key Points:**

- Font handled by Next.js optimization (merriweather.className on body)
- Comprehensive dark/light mode support via `.dark` class
- All design tokens in CSS variables
- Clean base element styling
- ~100 lines (reduced due to markdown separation and no font declarations)

#### Step 2.2: Create markdown.css

**File:** `app/markdown.css` (NEW FILE)

```css
/* ============================================
   MARKDOWN CONTENT STYLING
   ============================================ */

.markdown-content {
  color: var(--text-primary);
  line-height: 1.75;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  color: var(--text-primary);
  font-weight: 700;
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
}
```

**Key Points:**

- Self-contained markdown styling
- Uses CSS variables from globals.css
- Font inherited from body (Next.js optimization)
- Easy to replace when switching markdown libraries
- ~70 lines of focused content styling

---

### Phase 3: Update Components

#### Step 3.1: Update layout.tsx

**File:** `app/layout.tsx`

**Changes:**

1. Import `ThemeProvider`
2. Import both CSS files (globals.css and markdown.css)
3. Wrap children with `ThemeProvider`

```typescript
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';  // ADD THIS
import { SITE_CONFIG } from '@/lib/site-config';
import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import './markdown.css';  // ADD THIS

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="en">
      <body
        className={`${merriweather.className} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider>  {/* ADD THIS WRAPPER */}
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Step 3.2: Update Header.tsx

**File:** `components/Header.tsx`

**Changes:**

1. Import `ThemeToggle`
2. Add theme toggle button
3. Simplify typography classes (rely on base styles)
4. Use CSS variables for colors

```typescript
import { SITE_CONFIG } from '@/lib/site-config';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';  // ADD THIS

export default function Header() {
  return (
    <header className="border-b border-[var(--border-color)]">
      <div className="container mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
        <Link href="/">
          <div className="flex items-end gap-2">
            <h1 className="text-2xl text-[var(--text-secondary)]">
              {SITE_CONFIG.title}
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              {SITE_CONFIG.description}
            </p>
          </div>
        </Link>
        <ThemeToggle />  {/* ADD THIS */}
      </div>
    </header>
  );
}
```

**Note:** Removed `text-gray-200`, `text-gray-600`, `text-gray-400` → replaced with CSS variables

#### Step 3.3: Update PostList.tsx (Optional Simplification)

**File:** `components/PostList.tsx`

**Optional changes to use base styles:**

```typescript
import { formatDate } from '@/lib/utils';
import { Post } from '@/types/post';
import Link from 'next/link';
import Pagination from './Pagination';

interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPage: number;
}

export default function PostList({
  posts,
  currentPage,
  totalPage,
}: PostListProps) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-12">
        {posts.map((post) => {
          return (
            <article className="mb-12" key={post.slug}>
              <Link href={`/posts/${post.slug}`}>
                {/* Simplified: h1 gets base styles automatically */}
                <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
              </Link>
              <time
                className="mb-4 block text-base text-[var(--text-muted)]"  {/* Changed to CSS variable */}
                dateTime={post.date}
              >
                {formatDate(post.date)}
              </time>
              <p>{post.description}</p>
            </article>
          );
        })}
      </div>
      <Pagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
```

**Changes:**

- `text-[var(--text-secondary)]` → `text-[var(--text-muted)]` for date
- Headings automatically get base styles (font-family, color, letter-spacing)

#### Step 3.4: Update Post Page for Markdown

**File:** `app/posts/[slug]/page.tsx`

**IMPORTANT:** Add `.markdown-content` class wrapper

```typescript
// ... existing imports ...

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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <article>
        <h1 className="mb-2 text-4xl font-normal">{post.title}</h1>
        <time
          dateTime={post.date}
          className="mb-8 block text-sm text-[var(--text-secondary)]"
        >
          {formatDate(post.date)}
        </time>

        {/* ADD markdown-content CLASS */}
        <div className="markdown-content">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
}

// ... rest of the file ...
```

**Key change:** Wrap `<Markdown>` with `<div className="markdown-content">`

---

### Phase 4: Testing & Verification

#### Test Checklist

1. **Theme Toggle**
   - [ ] Click theme toggle button (sun/moon icon)
   - [ ] Page switches between light and dark mode
   - [ ] Colors change smoothly (transitions work)

2. **Theme Persistence**
   - [ ] Switch to dark mode
   - [ ] Refresh page (Ctrl+R or Cmd+R)
   - [ ] Dark mode persists after reload

3. **Markdown Styling**
   - [ ] Open a blog post
   - [ ] Verify headings are styled correctly
   - [ ] Verify links are blue and underline on hover
   - [ ] Verify lists, blockquotes, images render well

4. **Dark Mode Appearance**
   - [ ] Switch to dark mode
   - [ ] Check all pages (home, post list, individual post)
   - [ ] Verify text is readable
   - [ ] Verify links are visible
   - [ ] Verify borders/backgrounds look good

5. **Responsive Design**
   - [ ] Test on mobile viewport (resize browser)
   - [ ] Verify layout doesn't break
   - [ ] Verify theme toggle is accessible

6. **Typography**
   - [ ] All text uses Merriweather (body and headings)
   - [ ] Font sizes are appropriate
   - [ ] Line heights are comfortable to read

---

## File Summary

### Files to CREATE

1. `components/ThemeProvider.tsx` - Theme context and state management
2. `components/ThemeToggle.tsx` - Sun/moon toggle button
3. `app/markdown.css` - Markdown content styling (~70 lines)

### Files to MODIFY

1. `app/globals.css` - Replace entire file with base styles (~100 lines, no font declarations)
2. `app/layout.tsx` - Add ThemeProvider wrapper and import markdown.css
3. `components/Header.tsx` - Add ThemeToggle button, use CSS variables
4. `components/PostList.tsx` - (Optional) Use CSS variables for colors
5. `app/posts/[slug]/page.tsx` - Add `.markdown-content` class wrapper

---

## Why This Approach?

### Pros

1. **Clean Component Code** - Less utility class repetition
2. **Automatic Markdown Styling** - Blog posts look professional by default
3. **Easy Theme Switching** - CSS variables handle all color changes
4. **Consistent Typography** - Headings/links/paragraphs styled automatically
5. **Maintainable** - Design tokens centralized in `globals.css`
6. **Modular Architecture** - Markdown styles separate, easy to replace
7. **Keeps Tailwind** - Still use utilities for layout/spacing

### Cons Mitigated

1. **Two paradigms** - Clear rule: Base styles for elements, utilities for layout
2. **CSS complexity** - Well-organized with comments
3. **Learning curve** - Plan provides complete implementation

---

## Quick Reference: When to Use CSS vs Tailwind

**Use Base CSS for:**

- HTML elements (h1-h6, a, p)
- Theme-dependent colors (use CSS variables)
- Typography consistency

**Use Tailwind Utilities for:**

- Layout & positioning (flex, grid, mx-auto)
- Spacing (px-4, py-6, mb-4)
- Component-specific styles

---

## Expected Outcome

After implementation, you'll have:

- ✅ Dark/light mode with theme toggle in header
- ✅ Clean Merriweather typography throughout
- ✅ Professional markdown rendering
- ✅ Modular CSS architecture (easy to swap markdown library)
- ✅ Reduced JSX class verbosity
- ✅ Easy theme maintenance via CSS variables
- ✅ Hybrid approach: Base styles + Tailwind flexibility

**Total Changes:**

- 3 new files (ThemeProvider, ThemeToggle, markdown.css)
- 5 modified files (globals.css, layout.tsx, Header.tsx, PostList.tsx, post page)
- ~170 lines of CSS split across 2 files (globals: ~100, markdown: ~70)
- Font handled by Next.js optimization (no CSS font declarations needed)
