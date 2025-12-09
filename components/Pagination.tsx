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
    <nav className="flex items-center justify-between border-t border-gray-100 px-12 py-4">
      {/* Previous link */}
      <div>
        {hasPrev ? (
          <Link
            href={prevPage === 1 ? '/' : `/page/${prevPage}`}
            className="text-lg text-gray-600 transition-colors hover:text-gray-900"
          >
            Newer
          </Link>
        ) : (
          <span className="text-lg text-gray-300">Newer</span>
        )}
      </div>

      {/* Page indicator */}
      <span className="text-base text-gray-500">
        {currentPage}/{totalPage}
      </span>

      {/* Next link */}
      <div>
        {hasNext ? (
          <Link
            href={`/page/${nextPage}`}
            className="text-lg text-gray-600 transition-colors hover:text-gray-900"
          >
            Older
          </Link>
        ) : (
          <span className="text-lg text-gray-300">Older</span>
        )}
      </div>
    </nav>
  );
}
