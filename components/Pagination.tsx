import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPage: number;
}

export default function Pagination({
  currentPage,
  totalPage,
}: PaginationProps) {
  //  Don't show pagination if only 1 page
  if (totalPage <= 1) {
    return null;
  }

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPage;

  return (
    <nav className="flex items-center justify-between border-t border-[var(--border-color)] py-4">
      {/* Previous link */}
      <div>
        {hasPrev ? (
          <Link
            href={prevPage === 1 ? '/' : `/page/${prevPage}`}
            className="text-lg"
          >
            Newer
          </Link>
        ) : (
          <span className="text-lg text-[var(--text-secondary)]">Newer</span>
        )}
      </div>

      {/* Page indicator */}
      <span className="text-base text-[var(--text-muted)]">
        {currentPage}/{totalPage}
      </span>

      {/* Next link */}
      <div>
        {hasNext ? (
          <Link href={`/page/${nextPage}`} className="text-lg">
            Older
          </Link>
        ) : (
          <span className="text-lg text-[var(--text-secondary)]">Older</span>
        )}
      </div>
    </nav>
  );
}
