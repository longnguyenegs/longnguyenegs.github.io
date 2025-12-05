import { Category } from '@/lib/site-config';

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: Category;
  content: string;
}

export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPage: number;
}
