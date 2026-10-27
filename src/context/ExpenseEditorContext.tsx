"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { Modal } from "@/components/Modal";
import { formatCurrency } from "@/lib/format";
import { logger } from "@/lib/logger";
import type { Expense, ExpenseInput } from "@/types/expense";
import { useExpenses } from "./ExpensesContext";
import { useToast } from "./ToastContext";

interface ExpenseEditorContextValue {
  openCreate: () => void;
  openEdit: (expense: Expense) => void;
}

const ExpenseEditorContext = createContext<ExpenseEditorContextValue | null>(null);

type EditorState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; expense: Expense };

/** Owns the add/edit expense modal so any page or the navbar can open it. */
export function ExpenseEditorProvider({ children }: { children: ReactNode }) {
  const { addExpense, updateExpense } = useExpenses();
  const toast = useToast();
  const [state, setState] = useState<EditorState>({ mode: "closed" });

  const close = useCallback(() => setState({ mode: "closed" }), []);
  const openCreate = useCallback(() => setState({ mode: "create" }), []);
  const openEdit = useCallback((expense: Expense) => setState({ mode: "edit", expense }), []);

  const handleSubmit = (input: ExpenseInput) => {
    try {
      if (state.mode === "edit") {
        updateExpense(state.expense.id, input);
        toast({ title: "Expense updated", description: `${input.description} · ${formatCurrency(input.amount)}` });
      } else {
        addExpense(input);
        toast({ title: "Expense added", description: `${input.description} · ${formatCurrency(input.amount)}` });
      }
      close();
    } catch (err) {
      logger.error("Failed to save expense", err, { mode: state.mode });
      toast({
        type: "error",
        title: "Couldn't save expense",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  return (
    <ExpenseEditorContext.Provider value={value}>
      {children}
      <Modal
        open={state.mode !== "closed"}
        onClose={close}
        title={state.mode === "edit" ? "Edit expense" : "Add expense"}
        description={state.mode === "edit" ? "Update the details of this expense." : "Record a new expense."}
      >
        {state.mode !== "closed" && (
          <ExpenseForm
            key={state.mode === "edit" ? state.expense.id : "new"}
            initial={state.mode === "edit" ? state.expense : undefined}
            submitLabel={state.mode === "edit" ? "Save changes" : "Add expense"}
            onSubmit={handleSubmit}
            onCancel={close}
          />
        )}
      </Modal>
    </ExpenseEditorContext.Provider>
  );
}

export function useExpenseEditor() {
  const ctx = useContext(ExpenseEditorContext);
  if (!ctx) throw new Error("useExpenseEditor must be used within ExpenseEditorProvider");
  return ctx;
}
