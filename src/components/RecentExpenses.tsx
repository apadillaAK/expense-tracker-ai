import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import type { Expense } from "@/types/expense";
import { CategoryIcon } from "./CategoryBadge";

export function RecentExpenses({ expenses, onSelect }: { expenses: Expense[]; onSelect: (e: Expense) => void }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent expenses</h2>
          <p className="text-sm text-slate-500">Your latest transactions</p>
        </div>
        <Link href="/expenses" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <ul className="mt-3 divide-y divide-slate-100">
        {expenses.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => onSelect(e)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50"
              aria-label={`Edit ${e.description}`}
            >
              <CategoryIcon category={e.category} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{e.description}</p>
                <p className="text-xs text-slate-500">
                  {e.category} · {formatRelativeDate(e.date)}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-900 tabular-nums">-{formatCurrency(e.amount)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
