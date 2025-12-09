import { SITE_CONFIG } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] py-4">
      <div className="container mx-auto max-w-3xl items-center">
        <p className="text-center text-lg text-[var(--text-muted)]">
          {SITE_CONFIG.author}
        </p>
      </div>
    </footer>
  );
}
