import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

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
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <div>
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
