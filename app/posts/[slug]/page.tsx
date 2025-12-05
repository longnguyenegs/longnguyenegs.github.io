import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';

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
    <div className="container mx-auto max-w-3xl py-12">
      <article>
        <h1 className="mb-4 text-2xl">{post.title}</h1>
        <time dateTime={post.date}>{post.date}</time>
        <pre className="whitespace-pre-wrap">{post.content}</pre>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
