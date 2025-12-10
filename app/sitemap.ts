import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/site-config';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = SITE_CONFIG.url;

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // All blog posts
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...routes, ...postRoutes];
}
