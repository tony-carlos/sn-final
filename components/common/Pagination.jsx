"use client";

import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Generate page numbers with 2 pages on each side of the current page
  const pageNumbers = [];

  // Always show the first page
  pageNumbers.push(1);

  // Show dots if currentPage > 4
  if (currentPage > 4) {
    pageNumbers.push("...");
  }

  // Show pages around the currentPage (2 on each side)
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) {
      pageNumbers.push(i);
    }
  }

  // Show dots if currentPage < totalPages - 3
  if (currentPage < totalPages - 3) {
    pageNumbers.push("...");
  }

  // Show the last page if totalPages > 1
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <div className="pagination justify-center">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
        disabled={currentPage === 1}
      >
        <i className="icon-arrow-left text-15"></i>
      </button>

      <div className="pagination__count">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return <span key={index}>...</span>;
          }
          return (
            <div
              key={page}
              style={{ cursor: "pointer" }}
              onClick={() => onPageChange(page)}
              className={page === currentPage ? "is-active" : ""}
            >
              {page}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
        disabled={currentPage === totalPages}
      >
        <i className="icon-arrow-right text-15"></i>
      </button>
    </div>
  );
}
