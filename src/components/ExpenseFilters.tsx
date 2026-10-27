"use client";

import { Search, X } from "lucide-react";
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
  quickRange,
  SORT_OPTIONS,
  type ExpenseFilters as Filters,
  type QuickRange,
  type SortKey,
} from "@/lib/filters";
import { CATEGORIES, type Category } from "@/types/expense";

interface ExpenseFiltersProps {
  filters: Filters;
  sort: SortKey;
  onChange: (filters: Filters) => void;
  onSortChange: (sort: SortKey) => void;
}

const QUICK_RANGES: { value: QuickRange; label: string }[] = [
  { value: "this-month", label: "This month" },
  { value: "last-30", label: "Last 30 days" },
  { value: "this-year", label: "This year" },
];

export function ExpenseFilters({ filters, sort, onChange, onSortChange }: ExpenseFiltersProps) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const isRange = (r: QuickRange) => {
    const { from, to } = quickRange(r);
    return filters.from === from && filters.to === to;
  };
  const rangeInvalid = filters.from && filters.to && filters.from > filters.to;

  return (
    <div className="card space-y-4 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            placeholder="Search description, category, or amount…"
            className="input pl-9"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            aria-label="Search expenses"
          />
        </div>
        <select
          className="input lg:w-44"
          value={filters.category}
          onChange={(e) => update({ category: e.target.value as Category | "All" })}
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="input lg:w-44"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          aria-label="Sort expenses"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-md">
          <label className="block">
            <span className="text-xs font-medium text-slate-500">From</span>
            <input
              type="date"
              className={`input mt-1 ${rangeInvalid ? "input-error" : ""}`}
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => update({ from: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">To</span>
            <input
              type="date"
              className={`input mt-1 ${rangeInvalid ? "input-error" : ""}`}
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => update({ to: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {QUICK_RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => update(quickRange(r.value))}
              aria-pressed={isRange(r.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
                isRange(r.value)
                  ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                  : "text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {r.label}
            </button>
          ))}
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear filters
            </button>
          )}
        </div>
      </div>
      {rangeInvalid && <p className="text-sm text-rose-600">The start date must be before the end date.</p>}
    </div>
  );
}
