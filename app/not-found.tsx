import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Page not found</h1>
      <Link href="/">
        <span className="mt-4 block">Back to home</span>
      </Link>
    </div>
  );
}
