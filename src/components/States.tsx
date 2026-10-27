"use client";

import { AlertTriangle, Plus, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useExpenseEditor } from "@/context/ExpenseEditorContext";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import { logger } from "@/lib/logger";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export function LoadError() {
  const { error, resetData } = useExpenses();
  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-slate-500">{error}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
          Try again
        </button>
        <button type="button" className="btn-danger" onClick={resetData}>
          Reset saved data
        </button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, message, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

/** Buttons shown when the user has no expenses yet. */
export function GetStartedActions() {
  const { openCreate } = useExpenseEditor();
  const { loadSampleData } = useExpenses();
  const toast = useToast();

  const handleSample = () => {
    try {
      const count = loadSampleData();
      toast({ title: "Sample data loaded", description: `${count} demo expenses added.` });
    } catch (err) {
      logger.error("Failed to load sample data", err);
      toast({ type: "error", title: "Couldn't load sample data", description: (err as Error).message });
    }
  };

  return (
    <>
      <button type="button" className="btn-primary" onClick={openCreate}>
        <Plus className="h-4 w-4" aria-hidden />
        Add your first expense
      </button>
      <button type="button" className="btn-secondary" onClick={handleSample}>
        <Sparkles className="h-4 w-4" aria-hidden />
        Load sample data
      </button>
    </>
  );
}
