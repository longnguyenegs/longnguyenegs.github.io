import PostList from '@/components/PostList';
import { getPaginatedPosts } from '@/lib/posts';
import { createMetadata } from '@/lib/seo-utils';
import { SITE_CONFIG } from '@/lib/site-config';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = createMetadata({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    path: '/',
  });

  return {
    ...metadata,
    title: {
      absolute: SITE_CONFIG.title,
    },
  };
}

export default function Home() {
  const data = getPaginatedPosts(1);
  return <PostList {...data} />;
}
