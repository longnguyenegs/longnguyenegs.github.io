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
    <div className="container mx-auto max-w-3xl">
      {posts.map((post) => {
        return (
          <article className="mt-8" key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <h2 className="mb-2 text-2xl text-gray-900">{post.title}</h2>
            </Link>
            <time dateTime={post.date}>{post.date}</time>
            <p className="mt-4 text-gray-700">{post.description}</p>
          </article>
        );
      })}
      <Pagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
