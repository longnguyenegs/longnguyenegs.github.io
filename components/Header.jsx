import { SITE_CONFIG } from '@/lib/site-config';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 py-5">
      <Link href="/">
        <div className="container mx-auto flex max-w-3xl items-end gap-2">
          <h1 className="text-2xl text-gray-600">{SITE_CONFIG.title}</h1>
          <p className="text-lg text-gray-400">{SITE_CONFIG.description}</p>
        </div>
      </Link>
    </header>
  );
}
