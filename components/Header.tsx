import { SITE_CONFIG } from '@/lib/site-config';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-[var(--border-color)]">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 py-4">
        <Link href="/">
          <span className="block text-3xl text-[var(--text-primary)]">
            {SITE_CONFIG.title}
          </span>
        </Link>
        <span className="block text-base text-[var(--text-secondary)]">
          {SITE_CONFIG.description}
        </span>
      </div>
    </header>
  );
}
