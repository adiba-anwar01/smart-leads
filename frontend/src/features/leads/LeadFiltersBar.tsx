import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { useDebounce } from '../../hooks/useDebounce';
import type { LeadFilters } from '../../types';
import { LeadStatus } from '../../types';

interface LeadFiltersBarProps {
  onChange: (filters: LeadFilters) => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: LeadStatus.New, label: 'New' },
  { value: LeadStatus.Contacted, label: 'Contacted' },
  { value: LeadStatus.Qualified, label: 'Qualified' },
  { value: LeadStatus.Lost, label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const selectClass =
  'text-[13px] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 dark:hover:border-slate-500 transition-all';

export function LeadFiltersBar({ onChange }: LeadFiltersBarProps): React.JSX.Element {
  const [params, setParams] = useSearchParams();

  const rawSearch = params.get('search') ?? '';
  const status = params.get('status') ?? '';
  const source = params.get('source') ?? '';
  const sort = (params.get('sort') as 'latest' | 'oldest') ?? 'latest';
  const createdBy = params.get('createdBy') ?? '';

  const debouncedSearch = useDebounce(rawSearch, 300);

  React.useEffect(() => {
    const filters: LeadFilters = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (status) filters.status = status as LeadStatus;
    if (source) filters.source = source as LeadFilters['source'];
    if (sort) filters.sort = sort;
    if (createdBy) filters.createdBy = createdBy;
    onChange(filters);
  }, [debouncedSearch, status, source, sort, createdBy, onChange]);

  const set = (key: string, value: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete('page');
      return next;
    });
  };

  const reset = () => setParams({});

  const hasFilters = rawSearch || status || source || sort !== 'latest' || createdBy;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-1 min-w-[180px] max-w-xs">
        <Input
          id="leads-search"
          placeholder="Search by name or email…"
          value={rawSearch}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      <select
        id="leads-status-filter"
        className={selectClass}
        value={status}
        onChange={(e) => set('status', e.target.value)}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        id="leads-source-filter"
        className={selectClass}
        value={source}
        onChange={(e) => set('source', e.target.value)}
        aria-label="Filter by source"
      >
        {SOURCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
        {(['latest', 'oldest'] as const).map((s) => (
          <button
            key={s}
            id={`sort-${s}`}
            onClick={() => set('sort', s === 'latest' ? '' : s)}
            className={`px-3 py-2 text-[13px] font-medium transition-colors ${
              sort === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          id="reset-filters"
          onClick={reset}
          className="text-[13px] text-indigo-600 hover:text-indigo-800 font-medium px-2 py-2 transition-colors"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
