import BackButton from '@/components/BackButton';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { createMetadata } from '@/lib/seo-utils';
import { SITE_CONFIG } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

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

  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/posts/${slug}`,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      authors: [SITE_CONFIG.author],
    },
  });
}

// Lazy load react-markdown and remark-gfm together
const MarkdownRenderer = dynamic(
  async () => {
    const { default: Markdown } = await import('react-markdown');
    const { default: remarkGfm } = await import('remark-gfm');

    // Return a component that combines both
    return function MarkdownWithGfm({ children }: { children: string }) {
      return <Markdown rehypePlugins={[remarkGfm]}>{children}</Markdown>;
    };
  },
  { ssr: true }
);

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
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <article>
        <h2 className="text-3xl font-bold">{post.title}</h2>
        <time
          className="mb-4 block text-sm text-[var(--text-secondary)]"
          dateTime={post.date}
        >
          {formatDate(post.date)}
        </time>
        <div className="markdown-content">
          <MarkdownRenderer>{post.content}</MarkdownRenderer>
        </div>
        <BackButton />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
