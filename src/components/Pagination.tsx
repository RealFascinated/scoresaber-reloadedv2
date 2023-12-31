import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  useHref?: boolean;
  onPageChange?: (pageNumber: number) => void;
};

export default function Pagination(props: PaginationProps) {
  const { currentPage, totalPages, useHref, onPageChange } = props;

  // Calculate the range of page numbers to display
  const rangeStart = Math.max(1, currentPage - 2);
  const rangeEnd = Math.min(totalPages, currentPage + 2);

  // Generate an array of page numbers to display
  const pageNumbers = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center text-primary">
      <nav>
        <ul className="flex items-center gap-2">
          {currentPage > 1 && (
            <li className="rounded-md bg-neutral-700 hover:opacity-80">
              {useHref ? (
                <Link href={`${currentPage - 1}`}>
                  <p
                    className="px-3 py-1"
                    aria-label={`Page ${currentPage - 1} (previous page)`}
                  >
                    <ArrowUturnLeftIcon width={20} height={20} />
                  </p>
                </Link>
              ) : (
                <button
                  className="px-3 py-1"
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  aria-label={`Page ${currentPage - 1} (previous page)`}
                >
                  <ArrowUturnLeftIcon width={20} height={20} />
                </button>
              )}
            </li>
          )}

          {currentPage !== 1 && currentPage - 2 > 1 && (
            <>
              <li>
                {useHref ? (
                  <Link href={`${1}`}>
                    <p
                      className="rounded-md bg-neutral-700 px-3 py-1 hover:opacity-80"
                      aria-label="Page 1 (first page)"
                    >
                      1
                    </p>
                  </Link>
                ) : (
                  <button
                    className="rounded-md bg-neutral-700 px-3 py-1 hover:opacity-80"
                    onClick={() => onPageChange && onPageChange(1)}
                    aria-label="Page 1 (first page)"
                  >
                    1
                  </button>
                )}
              </li>
              <li>
                <p>...</p>
              </li>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <li key={pageNumber}>
              {useHref ? (
                <Link href={`${pageNumber}`}>
                  <p
                    className={`rounded-md px-3 py-1 ${
                      pageNumber === currentPage
                        ? "bg-blue-500 text-primary"
                        : "bg-neutral-700 hover:opacity-80"
                    }`}
                    aria-label={`Page ${pageNumber}`}
                  >
                    {pageNumber}
                  </p>
                </Link>
              ) : (
                <button
                  className={`rounded-md px-3 py-1 ${
                    pageNumber === currentPage
                      ? "bg-blue-500 text-primary"
                      : "bg-neutral-700 hover:opacity-80"
                  }`}
                  onClick={() => onPageChange && onPageChange(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              )}
            </li>
          ))}

          {currentPage !== totalPages && currentPage + 2 < totalPages && (
            <>
              <li>
                <p>...</p>
              </li>

              <li>
                {useHref ? (
                  <Link href={`${totalPages}`}>
                    <p
                      className="rounded-md bg-neutral-700 px-3 py-1 hover:opacity-80"
                      aria-label={`Page ${totalPages} (last page)`}
                    >
                      {totalPages}
                    </p>
                  </Link>
                ) : (
                  <button
                    className="rounded-md bg-neutral-700 px-3 py-1 hover:opacity-80"
                    onClick={() => onPageChange && onPageChange(totalPages)}
                    aria-label={`Page ${totalPages} (last page)`}
                  >
                    {totalPages}
                  </button>
                )}
              </li>
            </>
          )}

          {currentPage < totalPages && (
            <li className="rounded-md bg-neutral-700 hover:opacity-80">
              {useHref ? (
                <Link href={`${currentPage + 1}`}>
                  <p
                    className="px-3 py-1"
                    aria-label={`Page ${currentPage + 1} (next page)`}
                  >
                    <ArrowUturnRightIcon width={20} height={20} />
                  </p>
                </Link>
              ) : (
                <button
                  className="px-3 py-1"
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  aria-label={`Page ${currentPage + 1} (next page)`}
                >
                  <ArrowUturnRightIcon width={20} height={20} />
                </button>
              )}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
