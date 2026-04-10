import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  loading = false
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  if (totalPages <= 1 && totalCount > 0) {
     return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary bg-surface-secondary/30">
          <p className="text-sm text-text-tertiary">
            Showing <span className="font-semibold text-text-primary">{totalCount === 0 ? 0 : 1}</span> to <span className="font-semibold text-text-primary">{totalCount}</span> of <span className="font-semibold text-text-primary">{totalCount}</span> results
          </p>
        </div>
     );
  }

  if (totalCount === 0) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border-primary bg-surface-secondary/30">
      <p className="text-sm text-text-tertiary order-2 sm:order-1">
        Showing <span className="font-semibold text-text-primary">{startIndex + 1}</span> to <span className="font-semibold text-text-primary">{endIndex}</span> of <span className="font-semibold text-text-primary">{totalCount}</span> results
      </p>
      
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="h-9 px-3"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>
        
        <div className="hidden md:flex items-center gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-surface-tertiary text-text-secondary"
              >
                1
              </button>
              {startPage > 2 && <span className="text-text-muted px-1">...</span>}
            </>
          )}
          
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-text-muted px-1">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-surface-tertiary text-text-secondary"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center px-4 font-medium text-sm text-text-primary">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="h-9 px-3"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
