import { SITE_CONFIG } from '@/lib/site-config';

export default function Footer() {
  return (
    <div className="border-t border-gray-200 py-4">
      <div className="container mx-auto max-w-3xl items-center">
        <p className="text-center text-lg text-gray-400">
          {SITE_CONFIG.author}
        </p>
      </div>
    </div>
  );
}
