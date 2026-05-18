import React from 'react';
import { Button } from './Button';
import type { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps): React.JSX.Element | null {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1 && total <= limit) return null;

  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  const rendered: (number | '…')[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - (visible[i - 1] ?? 0) > 1) rendered.push('…');
    rendered.push(p);
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-[13px] text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{' '}
        <span className="font-medium text-slate-700">{total}</span> results
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ‹ Prev
        </Button>
        {rendered.map((item, idx) =>
          item === '…' ? (
            <span key={`el-${idx}`} className="px-2 text-slate-400 select-none">…</span>
          ) : (
            <Button
              key={item}
              id={`page-${item}`}
              variant={item === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next ›
        </Button>
      </nav>
    </div>
  );
}
