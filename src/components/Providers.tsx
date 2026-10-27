"use client";

import type { ReactNode } from "react";
import { ExpenseEditorProvider } from "@/context/ExpenseEditorContext";
import { ExpensesProvider } from "@/context/ExpensesContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ExpensesProvider>
        <ExpenseEditorProvider>{children}</ExpenseEditorProvider>
      </ExpensesProvider>
    </ToastProvider>
  );
}
