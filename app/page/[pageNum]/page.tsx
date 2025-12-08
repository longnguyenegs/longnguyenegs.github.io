import PostList from '@/components/PostList';
import { getPaginatedPosts } from '@/lib/posts';
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

export async function generateStaticParams() {
  const { totalPage } = getPaginatedPosts(1);

  return Array.from({ length: totalPage - 1 }, (_, i) => ({
    pageNum: String(i + 2),
  }));
}
