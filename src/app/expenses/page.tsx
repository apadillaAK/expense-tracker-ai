"use client";

import { Download, Plus, Receipt, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseList } from "@/components/ExpenseList";
import { EmptyState, GetStartedActions, LoadError, PageSkeleton } from "@/components/States";
import { useExpenseEditor } from "@/context/ExpenseEditorContext";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import { sumAmounts } from "@/lib/analytics";
import { downloadCsv, expensesToCsv } from "@/lib/csv";
import { todayISO } from "@/lib/dates";
import { applyFilters, DEFAULT_FILTERS, type ExpenseFilters as Filters, type SortKey } from "@/lib/filters";
import { formatCurrency } from "@/lib/format";
import { logger } from "@/lib/logger";
import type { Expense } from "@/types/expense";

export default function ExpensesPage() {
  const { expenses, status, deleteExpense, restoreExpense } = useExpenses();
  const { openCreate, openEdit } = useExpenseEditor();
  const toast = useToast();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const visible = useMemo(() => applyFilters(expenses, filters, sort), [expenses, filters, sort]);
  const visibleTotal = sumAmounts(visible);

  const handleDelete = () => {
    if (!pendingDelete) return;
    try {
      const removed = deleteExpense(pendingDelete.id);
      toast({
        title: "Expense deleted",
        description: removed.description,
        action: {
          label: "Undo",
          onClick: () => {
            try {
              restoreExpense(removed);
            } catch (err) {
              logger.error("Failed to restore expense", err, { expenseId: removed.id });
              toast({ type: "error", title: "Couldn't restore expense" });
            }
          },
        },
      });
    } catch (err) {
      logger.error("Failed to delete expense", err, { expenseId: pendingDelete.id });
      toast({ type: "error", title: "Couldn't delete expense", description: (err as Error).message });
    } finally {
      setPendingDelete(null);
    }
  };

  const handleExport = () => {
    if (visible.length === 0) {
      toast({ type: "info", title: "Nothing to export", description: "No expenses match the current filters." });
      return;
    }
    try {
      downloadCsv(`expenses-${todayISO()}.csv`, expensesToCsv(visible));
      toast({ title: "Export ready", description: `${visible.length} expenses exported to CSV.` });
    } catch (err) {
      logger.error("CSV export failed", err);
      toast({ type: "error", title: "Export failed", description: "Please try again." });
    }
  };

  if (status === "loading") return <PageSkeleton />;
  if (status === "error") return <LoadError />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">Search, filter, and manage all your expenses.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={handleExport} disabled={expenses.length === 0}>
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
          <button type="button" className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Add expense
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="card">
          <EmptyState icon={Receipt} title="No expenses yet" message="Expenses you add will show up here.">
            <GetStartedActions />
          </EmptyState>
        </div>
      ) : (
        <>
          <ExpenseFilters filters={filters} sort={sort} onChange={setFilters} onSortChange={setSort} />

          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 text-sm">
              <span className="text-slate-500">
                Showing <span className="font-medium text-slate-900">{visible.length}</span> of {expenses.length}{" "}
                expenses
              </span>
              <span className="text-slate-500">
                Total <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(visibleTotal)}</span>
              </span>
            </div>

            {visible.length === 0 ? (
              <EmptyState icon={SearchX} title="No matching expenses" message="Try adjusting your search or filters.">
                <button type="button" className="btn-secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Clear filters
                </button>
              </EmptyState>
            ) : (
              <ExpenseList expenses={visible} onEdit={openEdit} onDelete={setPendingDelete} />
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete expense?"
        message={
          pendingDelete
            ? `"${pendingDelete.description}" (${formatCurrency(pendingDelete.amount)}) will be removed. You can undo this right after.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
