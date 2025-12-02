# Next.js Personal Blog Implementation Plan

## Overview

Build a static Next.js blog with Markdown content, Lanyon-inspired theme, pagination, categories, and full SEO support.

## User Preferences

- **Sample Content**: Create 3-5 example posts
- **Sidebar Behavior**: Visible on desktop, toggleable on mobile
- **Features**: Minimal (no search, reading time, or TOC)

---

## Phase 1: Dependencies & Foundation

### 1.1 Install Required Packages

```bash
pnpm add gray-matter remark remark-html remark-gfm rehype-highlight rehype-stringify feed date-fns
```

**Packages:**

- `gray-matter`: Parse frontmatter from markdown
- `remark/rehype`: Markdown processing pipeline
- `feed`: RSS feed generation
- `date-fns`: Date formatting

### 1.2 Create Type Definitions

**File:** `types/post.ts`

- `Frontmatter` interface (title, description, date, category, slug)
- `Post` interface (frontmatter + content)
- `PaginatedPosts` interface (posts[], totalPages, currentPage)

### 1.3 Create Constants

**File:** `lib/constants.ts`

- Site metadata (SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR)
- POSTS_PER_PAGE = 10
- Categories list

---

## Phase 2: Core Utilities

### 2.1 Markdown Processing

**File:** `lib/markdown.ts`

- `markdownToHtml(markdown: string): Promise<string>`
- Configure remark with plugins: remark-gfm, rehype-highlight

### 2.2 Post Management

**File:** `lib/posts.ts`
Critical utility powering all pages:

- `getAllPosts(): Post[]` - Read all markdown files from /posts
- `getPostBySlug(slug: string): Post | null` - Get single post
- `getPostsByCategory(category: string): Post[]` - Filter by category
- `getAllCategories(): string[]` - Extract unique categories
- `getSortedPosts(): Post[]` - Sort by date descending
- Use `gray-matter` to parse frontmatter
- Use Node.js `fs` and `path` for file operations

### 2.3 Pagination Logic

**File:** `lib/pagination.ts`

- `paginatePosts(posts: Post[], page: number, perPage: number): PaginatedPosts`
- Calculate total pages
- Slice posts array for current page

### 2.4 RSS Feed Generation

**File:** `lib/rss.ts`

- `generateRSSFeed(): string` - Generate RSS XML using `feed` package
- Include all posts with full content

---

## Phase 3: UI Components

### 3.1 Theme Toggle

**File:** `components/ThemeToggle.tsx`

- Client component (`'use client'`)
- Toggle between light/dark modes
- Persist preference in localStorage
- Sun/Moon icon button
- Handle initial load from localStorage or system preference

### 3.2 Sidebar

**File:** `components/Sidebar.tsx`

- **Desktop**: Always visible (user preference)
- **Mobile**: Toggleable with hamburger button
- Contains:
  - Site title/logo
  - Navigation links (Home)
  - Category list with counts
  - ThemeToggle integration
- Lanyon-inspired styling with Tailwind

### 3.3 Post Display Components

**File:** `components/PostCard.tsx`

- Display post preview (title, date, description, category badge)
- Link to full post
- Format date with date-fns

**File:** `components/PostList.tsx`

- Render array of PostCard components
- Handle empty state

**File:** `components/CategoryBadge.tsx`

- Small badge with category name
- Link to category page

### 3.4 Pagination

**File:** `components/Pagination.tsx`

- Previous/Next buttons
- Page number display (e.g., "Page 2 of 5")
- Link to `/page/[n]` routes
- Disabled states for first/last pages

### 3.5 Markdown Renderer

**File:** `components/MarkdownContent.tsx`

- Styled container for rendered HTML
- Typography classes (prose-like with Tailwind)
- Code block styling with syntax highlighting
- Responsive image styling
- Dark mode support

---

## Phase 4: Page Routes

### 4.1 Root Layout

**File:** `app/layout.tsx` (MODIFY)

- Integrate Sidebar component
- Lanyon-inspired layout structure:
  - Sidebar (visible on desktop, toggleable on mobile)
  - Main content area (centered, max-width)
- Add theme initialization script to prevent FOUC
- Update site metadata
- Add `suppressHydrationWarning` to `<html>` for theme

### 4.2 Homepage

**File:** `app/page.tsx` (MODIFY)

- Fetch all posts (sorted by date, page 1)
- Use `getSortedPosts()` and `paginatePosts()`
- Render PostList component
- Add Pagination component
- Generate metadata for SEO

### 4.3 Paginated Homepage

**File:** `app/page/[page]/page.tsx`

- Dynamic route for pagination
- `generateStaticParams()` to pre-render all page numbers
- Fetch posts for specific page
- Render PostList + Pagination
- Handle 404 for invalid page numbers
- Generate metadata

### 4.4 Individual Post Pages

**File:** `app/posts/[slug]/page.tsx`

- `generateStaticParams()` for all post slugs
- Fetch post by slug using `getPostBySlug()`
- Convert markdown to HTML using `markdownToHtml()`
- Render:
  - Post title (h1)
  - Date and category
  - MarkdownContent component
- Generate rich metadata:
  - Title, description
  - Open Graph tags
  - Canonical URL
  - JSON-LD structured data
- Handle 404 for invalid slugs

### 4.5 Category Pages

**File:** `app/category/[category]/page.tsx`

- `generateStaticParams()` for all categories
- Fetch posts by category using `getPostsByCategory()`
- Render PostList component
- Show category title
- Generate metadata
- Optional: Add pagination if categories have many posts

---

## Phase 5: SEO & Feeds

### 5.1 RSS Feed

**File:** `app/rss.xml/route.ts`

- Route handler returning RSS XML
- Call `generateRSSFeed()` from lib/rss.ts
- Set proper headers (`Content-Type: application/xml`)
- Make static: `export const dynamic = 'force-static'`

### 5.2 Sitemap

**File:** `app/sitemap.ts`

- Export sitemap function per Next.js convention
- Return array of all URLs:
  - Homepage + paginated pages
  - All post pages
  - All category pages
- Include lastModified dates
- Next.js auto-generates sitemap.xml

### 5.3 Robots.txt

**File:** `app/robots.ts`

- Export robots function
- Allow all crawlers
- Reference sitemap URL

---

## Phase 6: Styling (Lanyon Theme)

### 6.1 Update Global Styles

**File:** `app/globals.css` (MODIFY)

- Define Lanyon-inspired color palette
- Enhance dark mode CSS variables
- Typography scale (rem-based)
- Prose styling for markdown content
- Code block styles with syntax highlighting
- Sidebar styling (visible on desktop, slide-in on mobile)

### 6.2 Tailwind Implementation

Use Tailwind utility classes throughout for:

- Layout (flexbox, grid)
- Spacing (padding, margins)
- Typography (sizes, weights, line heights)
- Colors (bg, text, borders)
- Dark mode variants (`dark:`)
- Responsive breakpoints (`sm:`, `md:`, `lg:`)

### 6.3 Lanyon Visual Design

- **Color Scheme**: Use Lanyon's default theme colors
- **Typography**: System fonts for fast loading
- **Layout**: Centered content with max-width (similar to Lanyon)
- **Sidebar**:
  - Desktop: Fixed visible sidebar on left (18-20rem width)
  - Mobile: Hidden by default, slide-in with overlay backdrop
- **Minimalism**: Clean design, adequate whitespace

---

## Phase 7: Static Export Configuration

### 7.1 Update Next.js Config

**File:** `next.config.ts` (MODIFY)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Optional: clean URLs
};

export default nextConfig;
```

### 7.2 Build & Verify

```bash
# Build static site
pnpm build

# Preview locally
npx serve out
```

Verify output in `/out` directory:

- index.html (homepage)
- page/2/index.html, page/3/index.html (pagination)
- posts/[slug]/index.html (all posts)
- category/[category]/index.html (all categories)
- sitemap.xml
- rss.xml

---

## Phase 8: Sample Content

### 8.1 Create Sample Posts

Create 3-5 markdown files in `/posts` directory with varied content:

**Example:** `posts/welcome-to-my-blog.md`

```markdown
---
title: 'Welcome to My Blog'
description: 'Introduction to my personal blog and what to expect'
date: '2024-12-01'
category: 'personal'
---

# Welcome!

This is my first blog post...
```

**Posts to create:**

1. `welcome-to-my-blog.md` (category: personal)
2. `getting-started-with-nextjs.md` (category: tech)
3. `my-favorite-books-2024.md` (category: personal)
4. `css-grid-vs-flexbox.md` (category: tech)
5. `travel-photography-tips.md` (category: travel)

### 8.2 Add Sample Images

- Create `/public/images/posts/` directory
- Add 2-3 sample images
- Reference in markdown posts using:
  ```markdown
  ![Alt text](/images/posts/image-name.jpg)
  ```

---

## Phase 9: Testing & Verification

### 9.1 Testing Checklist

- [ ] Homepage displays posts correctly
- [ ] Pagination works (navigate between pages)
- [ ] Individual post pages render markdown properly
- [ ] Images display correctly in posts
- [ ] Category pages filter posts correctly
- [ ] Theme toggle persists preference (check localStorage)
- [ ] Sidebar visible on desktop, toggleable on mobile
- [ ] RSS feed validates (use feedvalidator.org)
- [ ] Sitemap includes all URLs
- [ ] Dark mode styling works
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Static build completes successfully
- [ ] All routes pre-rendered in `/out` directory
- [ ] Lighthouse audit (performance, accessibility, SEO)

### 9.2 Static Export Verification

```bash
pnpm build
ls -R out/  # Check all routes generated
npx serve out  # Test locally
```

---

## Critical Files Summary

### Must Create (Priority Order)

1. `types/post.ts` - Type definitions
2. `lib/constants.ts` - Site configuration
3. `lib/markdown.ts` - Markdown processing
4. `lib/posts.ts` - **CRITICAL** - Post data layer
5. `lib/pagination.ts` - Pagination logic
6. `lib/rss.ts` - RSS generation
7. `components/ThemeToggle.tsx` - Theme switcher
8. `components/Sidebar.tsx` - **CRITICAL** - Main navigation
9. `components/PostCard.tsx` - Post preview
10. `components/PostList.tsx` - Post listing
11. `components/CategoryBadge.tsx` - Category display
12. `components/Pagination.tsx` - Page navigation
13. `components/MarkdownContent.tsx` - Content renderer
14. `app/posts/[slug]/page.tsx` - **CRITICAL** - Post pages
15. `app/category/[category]/page.tsx` - Category pages
16. `app/page/[page]/page.tsx` - Paginated homepage
17. `app/sitemap.ts` - Sitemap generation
18. `app/robots.ts` - Robots.txt
19. `app/rss.xml/route.ts` - RSS feed endpoint
20. `posts/*.md` - Sample markdown posts (3-5 files)

### Must Modify

1. `app/layout.tsx` - **CRITICAL** - Root layout with sidebar
2. `app/page.tsx` - Homepage with post list
3. `app/globals.css` - Lanyon theme styling
4. `next.config.ts` - Static export configuration

---

## Key Implementation Notes

### Static Generation

- All pages use SSG (no runtime API calls)
- `generateStaticParams()` required for all dynamic routes
- `output: 'export'` in next.config.ts
- Images must be unoptimized for static export

### Theme System

- Light/dark mode using CSS classes on `<html>` element
- localStorage key: `theme` (values: 'light' | 'dark')
- Prevent FOUC with inline script in layout.tsx
- Tailwind `dark:` variants for styling

### Sidebar Behavior

- **Desktop (≥1024px)**: Always visible, fixed position
- **Mobile (<1024px)**: Hidden by default, hamburger button, slide-in overlay
- Contains: site title, navigation, category links, theme toggle

### Content Structure

- Markdown files in `/posts` directory
- Frontmatter: title, description, date (YYYY-MM-DD), category
- Images in `/public/images/posts/`
- Slug derived from filename (kebab-case)

### Performance

- Tailwind CSS for minimal CSS
- No heavy JavaScript libraries
- Syntax highlighting only where needed
- Pre-optimized images
- Static HTML for fastest loading

### SEO Features

- Unique metadata per page
- Open Graph tags for social sharing
- Canonical URLs
- Sitemap with all pages
- RSS feed with full content
- JSON-LD structured data for posts
- Semantic HTML

---

## Build Commands

```bash
# Development
pnpm dev

# Production build (generates /out directory)
pnpm build

# Preview static build
npx serve out
```

---

## Deployment

Upload `/out` directory to any static hosting:

- Vercel (automatic with Git integration)
- Netlify (drag & drop)
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

---

## Estimated Implementation Order

1. **Setup** (Phase 1): Install dependencies, create types & constants
2. **Utilities** (Phase 2): Markdown processing, post management, pagination
3. **Components** (Phase 3): Build all UI components
4. **Routes** (Phase 4): Implement all page routes
5. **SEO** (Phase 5): Add sitemap, RSS, robots.txt
6. **Styling** (Phase 6): Apply Lanyon theme with Tailwind
7. **Config** (Phase 7): Configure static export
8. **Content** (Phase 8): Create sample posts and images
9. **Testing** (Phase 9): Verify everything works, build static site

Each phase builds on the previous, making implementation systematic and testable.
