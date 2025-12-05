import { PaginatedPosts, Post } from '@/types/post';
import { SITE_CONFIG } from './site-config';

function getAllPosts(): Post[] {
  return [];
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

export function getPostBySlug(slug: string): Post | null {
  return null;
}
