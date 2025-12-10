import { Metadata } from 'next';
import { SITE_CONFIG } from './site-config';

export function getCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pathWithSlash = normalizedPath.endsWith('/')
    ? normalizedPath
    : `${normalizedPath}/`;

  return `${SITE_CONFIG.url}${pathWithSlash}`;
}

export function createMetadata(options: {
  title: string;
  description: string;
  path: string;
  openGraph?: {
    images?: string[];
    type?: 'website' | 'article';
    publishedTime?: string;
    authors?: string[];
  };
}): Metadata {
  const { title, description, path, openGraph } = options;
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: openGraph
      ? {
          title,
          description,
          url: canonical,
          siteName: SITE_CONFIG.title,
          locale: 'vi_VN',
          type: openGraph.type || 'website',
          ...(openGraph.images && { images: openGraph.images }),
          ...(openGraph.publishedTime && {
            publishedTime: openGraph.publishedTime,
          }),
          ...(openGraph.authors && { authors: openGraph.authors }),
        }
      : undefined,
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
