import type { Category, Expense } from "@/types/expense";
import { addDays, startOfMonthISO, startOfYearISO, todayISO } from "./dates";

export interface ExpenseFilters {
  search: string;
  category: Category | "All";
  from: string;
  to: string;
}

export type SortKey = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export const DEFAULT_FILTERS: ExpenseFilters = { search: "", category: "All", from: "", to: "" };

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

export type QuickRange = "this-month" | "last-30" | "this-year";

export function quickRange(range: QuickRange): Pick<ExpenseFilters, "from" | "to"> {
  const to = todayISO();
  switch (range) {
    case "this-month":
      return { from: startOfMonthISO(), to };
    case "last-30":
      return { from: addDays(to, -29), to };
    case "this-year":
      return { from: startOfYearISO(), to };
  }
}

export function hasActiveFilters(f: ExpenseFilters): boolean {
  return f.search.trim() !== "" || f.category !== "All" || f.from !== "" || f.to !== "";
}

export function sortByDateDesc(a: Expense, b: Expense): number {
  return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
}

export function applyFilters(expenses: Expense[], f: ExpenseFilters, sort: SortKey): Expense[] {
  const query = f.search.trim().toLowerCase();

  const filtered = expenses.filter((e) => {
    if (f.category !== "All" && e.category !== f.category) return false;
    // YYYY-MM-DD strings compare correctly as plain strings.
    if (f.from && e.date < f.from) return false;
    if (f.to && e.date > f.to) return false;
    if (query) {
      const haystack = `${e.description} ${e.category} ${e.amount.toFixed(2)}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case "date-desc":
        return sortByDateDesc(a, b);
      case "date-asc":
        return -sortByDateDesc(a, b);
      case "amount-desc":
        return b.amount - a.amount || sortByDateDesc(a, b);
      case "amount-asc":
        return a.amount - b.amount || sortByDateDesc(a, b);
    }
  });
}
