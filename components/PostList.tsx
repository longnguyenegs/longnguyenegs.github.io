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
                <h2 className="text-3xl font-bold">{post.title}</h2>
              </Link>
              <time
                className="mb-4 block text-sm text-[var(--text-muted)]"
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
