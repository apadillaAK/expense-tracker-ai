"use client";

import { Wallet } from "lucide-react";
import { useMemo } from "react";
import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { RecentExpenses } from "@/components/RecentExpenses";
import { EmptyState, GetStartedActions, LoadError, PageSkeleton } from "@/components/States";
import { SummaryCards } from "@/components/SummaryCards";
import { useExpenseEditor } from "@/context/ExpenseEditorContext";
import { useExpenses } from "@/context/ExpensesContext";
import { getDashboardStats, monthlyTotals } from "@/lib/analytics";
import { formatMonthKey, monthKey, todayISO } from "@/lib/dates";
import { sortByDateDesc } from "@/lib/filters";

export default function DashboardPage() {
  const { expenses, status } = useExpenses();
  const { openEdit } = useExpenseEditor();

  const stats = useMemo(() => getDashboardStats(expenses), [expenses]);
  const monthly = useMemo(() => monthlyTotals(expenses, 6), [expenses]);
  const recent = useMemo(() => [...expenses].sort(sortByDateDesc).slice(0, 6), [expenses]);

  if (status === "loading") return <PageSkeleton />;
  if (status === "error") return <LoadError />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your spending overview for {formatMonthKey(monthKey(todayISO()), "long")}.
        </p>
      </div>

      {expenses.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="Start tracking your spending"
            message="Add an expense to see your summaries and charts, or load sample data to explore the app."
          >
            <GetStartedActions />
          </EmptyState>
        </div>
      ) : (
        <>
          <SummaryCards stats={stats} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthlyChart data={monthly} />
            </div>
            <CategoryChart expenses={expenses} />
          </div>
          <RecentExpenses expenses={recent} onSelect={openEdit} />
        </>
      )}
    </div>
  );
}
