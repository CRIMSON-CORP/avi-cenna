"use client";

import { type DateFilter } from "@/lib/events";
import { cn } from "@/lib/utils";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

interface EventsFilterBarProps {
  activeFilter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

const FILTER_PILLS: { id: DateFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "this-year", label: "This Year" },
];

export function EventsFilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
}: EventsFilterBarProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Date Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter events by date"
        className="no-scrollbar flex items-center gap-2.5 overflow-x-auto py-2"
      >
        {FILTER_PILLS.map((pill) => {
          const isActive = activeFilter === pill.id;
          return (
            <button
              key={pill.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onFilterChange(pill.id)}
              className={cn(
                "focus-ring inline-flex h-11 shrink-0 items-center justify-center rounded-pill px-5 text-[0.88rem] font-semibold",
                "transition-[background-color,border-color,color,box-shadow,transform] duration-base ease-out-expo",
                isActive
                  ? "bg-surface-deep text-white shadow-soft"
                  : "border border-brand-200 bg-surface text-ink hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/50 hover:shadow-soft",
              )}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Search Input & Total Counter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <label htmlFor="events-search" className="sr-only">
            Search events
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            id="events-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events, venue, host..."
            className={cn(
              "focus-ring h-11 w-full rounded-pill border border-brand-200 bg-surface pl-10 pr-9 text-[0.88rem] text-ink",
              "placeholder:text-ink-muted transition-[border-color,box-shadow] duration-base ease-out-expo",
              "hover:border-brand-300 focus:border-brand-500 focus:bg-surface",
            )}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="focus-ring absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:text-ink"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <span className="text-[0.82rem] font-medium text-ink-muted sm:pl-1">
          {totalCount} {totalCount === 1 ? "event" : "events"}
        </span>
      </div>
    </div>
  );
}
