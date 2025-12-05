import { getPaginatedPosts } from '@/lib/posts';

export default function Home() {
  const { posts, currentPage, totalPage } = getPaginatedPosts(1);
  return (
    <div className="container mx-auto max-w-3xl">
      {posts.map((post) => {
        return (
          <div className="my-8" key={post.slug}>
            <h1 className="text-2xl" key={post.title}>
              {post.title}
            </h1>
            <p>{post.description}</p>
          </div>
        );
      })}
    </div>
  );
}
