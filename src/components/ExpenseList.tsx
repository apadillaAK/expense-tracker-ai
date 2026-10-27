"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/types/expense";
import { CategoryBadge, CategoryIcon } from "./CategoryBadge";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <th scope="col" className="px-5 py-3">Date</th>
              <th scope="col" className="px-5 py-3">Description</th>
              <th scope="col" className="px-5 py-3">Category</th>
              <th scope="col" className="px-5 py-3 text-right">Amount</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e.id} className="group transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 tabular-nums">{formatDate(e.date)}</td>
                <td className="max-w-xs truncate px-5 py-3.5 font-medium text-slate-900">{e.description}</td>
                <td className="px-5 py-3.5">
                  <CategoryBadge category={e.category} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(e.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <RowActions expense={e} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center gap-3 px-4 py-3">
            <CategoryIcon category={e.category} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{e.description}</p>
              <p className="text-xs text-slate-500">
                {e.category} · {formatDate(e.date)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(e.amount)}</span>
              <RowActions expense={e} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function RowActions({ expense, onEdit, onDelete }: { expense: Expense } & Omit<ExpenseListProps, "expenses">) {
  return (
    <div className="flex justify-end gap-1 md:opacity-0 md:transition md:focus-within:opacity-100 md:group-hover:opacity-100">
      <button
        type="button"
        onClick={() => onEdit(expense)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
        aria-label={`Edit ${expense.description}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(expense)}
        className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        aria-label={`Delete ${expense.description}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
