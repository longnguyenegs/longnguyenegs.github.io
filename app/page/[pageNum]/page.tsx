import PostList from '@/components/PostList';
import { getPaginatedPosts } from '@/lib/posts';
import { createMetadata } from '@/lib/seo-utils';
import { SITE_CONFIG } from '@/lib/site-config';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ pageNum: string }>;
}

export default async function PaginatedPage({ params }: PageProps) {
  const { pageNum } = await params;

  const page = parseInt(pageNum, 10);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const data = getPaginatedPosts(page);

  if (page > data.totalPage) {
    notFound();
  }

  return <PostList {...data} />;
}

export function generateStaticParams() {
  const { totalPage } = getPaginatedPosts(1);

  // Always generate page 2, even if it doesn't exist yet
  // This allows the build to succeed with 1 post
  // Page 2 will just 404 until you add more posts
  const minPages = Math.max(totalPage - 1, 1);

  return Array.from({ length: minPages }, (_, i) => ({
    pageNum: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pageNum } = await params;
  const page = parseInt(pageNum, 10);

  if (isNaN(page) || page < 1) {
    return {};
  }

  return createMetadata({
    title: `Page ${page}`,
    description: `${SITE_CONFIG.description} - Page ${page}`,
    path: `/page/${page}`,
  });
}
