"use client";

import { PieChart } from "lucide-react";
import { useMemo, useState } from "react";
import { expensesInMonth, sumAmounts, totalsByCategory } from "@/lib/analytics";
import { CATEGORY_META } from "@/lib/categories";
import { monthKey, todayISO } from "@/lib/dates";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/format";
import type { Expense } from "@/types/expense";

type Period = "month" | "all";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CategoryChart({ expenses }: { expenses: Expense[] }) {
  const [period, setPeriod] = useState<Period>("month");

  const scoped = useMemo(
    () => (period === "month" ? expensesInMonth(expenses, monthKey(todayISO())) : expenses),
    [expenses, period],
  );
  const totals = useMemo(() => totalsByCategory(scoped), [scoped]);
  const overall = sumAmounts(scoped);

  let offset = 0;
  const segments = totals.map((t) => {
    const length = t.share * CIRCUMFERENCE;
    const segment = { ...t, length, offset };
    offset += length;
    return segment;
  });

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">By category</h2>
          <p className="text-sm text-slate-500">Where your money goes</p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium" role="group" aria-label="Period">
          {(["month", "all"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`rounded-md px-2.5 py-1 transition ${
                period === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p === "month" ? "This month" : "All time"}
            </button>
          ))}
        </div>
      </div>

      {totals.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center text-sm text-slate-500">
          <PieChart className="mb-2 h-8 w-8 text-slate-300" aria-hidden />
          No spending {period === "month" ? "this month" : "recorded"} yet.
        </div>
      ) : (
        <>
          <div className="relative mx-auto mt-4 h-44 w-44">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label="Spending by category">
              <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth="12" />
              {segments.map((s) => (
                <circle
                  key={s.category}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={CATEGORY_META[s.category].color}
                  strokeWidth="12"
                  strokeDasharray={`${s.length} ${CIRCUMFERENCE - s.length}`}
                  strokeDashoffset={-s.offset}
                >
                  <title>{`${s.category}: ${formatCurrency(s.total)}`}</title>
                </circle>
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500">Total</span>
              <span className="text-lg font-semibold text-slate-900 tabular-nums">{formatCompactCurrency(overall)}</span>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {totals.map((t) => (
              <li key={t.category} className="flex items-center gap-3 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_META[t.category].color }} />
                <span className="flex-1 text-slate-700">{t.category}</span>
                <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(t.total)}</span>
                <span className="w-10 text-right text-xs text-slate-500 tabular-nums">{formatPercent(t.share)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
