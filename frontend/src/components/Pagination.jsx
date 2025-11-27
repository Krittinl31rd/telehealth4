import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ items = [], itemsPerPage = 8, onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(items.length / itemsPerPage));
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sliced = items.slice(startIndex, endIndex);

    onChange?.(sliced);
  }, [currentPage, items, itemsPerPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-base-300 flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-base-600 hover:bg-gray-100 rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Back</span>
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-gray-800 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-base-600 hover:bg-gray-100 rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
