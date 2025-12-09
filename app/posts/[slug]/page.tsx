import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <article>
        <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
        <time
          className="mb-4 block text-base text-[var(--text-secondary)]"
          dateTime={post.date}
        >
          {formatDate(post.date)}
        </time>
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
