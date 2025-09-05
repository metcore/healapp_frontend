"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

type PaginationProps = {
  page: number;
  total: number;
  perPage: number;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  page,
  total,
  perPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  // hitung pages maksimum 5 nomor
  const getVisiblePages = () => {
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    // jaga-jaga kalau jumlahnya kurang dari 5
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(totalPages - 4, 1);
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
      <span>
        Showing {start} to {end} of {total} entries
      </span>
      <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
        {/* Prev */}
        <li className="page-item">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1 && onPageChange) onPageChange(page - 1);
            }}
            className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
          >
            <Icon icon="ep:d-arrow-left" className="text-xl" />
          </Link>
        </li>

        {/* Page Numbers */}
        {pages.map((p) => (
          <li className="page-item" key={p}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onPageChange) onPageChange(p);
              }}
              className={`page-link fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px ${
                p === page
                  ? "bg-primary-600 text-white"
                  : "bg-primary-50 text-secondary-light"
              }`}
            >
              {p}
            </Link>
          </li>
        ))}

        {/* Next */}
        <li className="page-item">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages && onPageChange) onPageChange(page + 1);
            }}
            className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
          >
            <Icon icon="ep:d-arrow-right" className="text-xl" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
