export const SITE_CONFIG = {
  // Basic information
  title: 'Long Nguyen blog',
  description: 'Personal blog by Long Nguyen',
  author: 'Long Nguyen',

  // Blog settings
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  postsPerPage: 10,
} as const;
