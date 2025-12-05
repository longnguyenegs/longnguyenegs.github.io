import { PaginatedPosts, Post } from '@/types/post';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { SITE_CONFIG } from './site-config';

const postsDirectory = path.join(process.cwd(), '_posts');
let cachedPosts: Post[] | null = null;

function getAllPosts(): Post[] {
  // Check cached posts first
  if (cachedPosts) {
    return cachedPosts;
  }
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`);
    return [];
  }

  // Only read .md files
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'));
  const allPostsData = fileNames
    .map((fileName) => {
      // Parse filename: YYYY-MM-DD_slug.md
      const parts = fileName.split('_');
      if (parts.length !== 2) {
        console.warn(`Skipping invalid filename: ${fileName}`);
        return null;
      }
      const [, slugPart] = parts;
      const slug = slugPart.replace(/\.md$/, '');

      // Read file
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf-8');

      // Parse frontmatter
      const { data, content } = matter(fileContents);

      // Validate required fields
      if (!data.title || !data.date || !data.description) {
        console.warn(
          `Skipping ${fileName}: missing title, date, or description`
        );
        return null;
      }

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        category: data.category,
        content,
      } as Post;
    })
    .filter((post): post is Post => post !== null);

  // Sort by date (newest first)
  const sortedPosts = allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Cache the result
  cachedPosts = sortedPosts;
  return sortedPosts;
}

export function getPaginatedPosts(page: number = 1): PaginatedPosts {
  const allPosts = getAllPosts();
  const postsPerPage = SITE_CONFIG.postsPerPage;

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;

  const posts = allPosts.slice(startIndex, startIndex + postsPerPage);

  return {
    posts,
    currentPage: page,
    totalPage: totalPages,
  };
}

export function getAllPostSlugs(): string[] {
  const allPosts = getAllPosts();
  return allPosts.map((post) => post.slug);
}

export function getPostBySlug(slug: string): Post | null {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}
