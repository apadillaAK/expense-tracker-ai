"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { logger } from "@/lib/logger";
import { generateSampleExpenses } from "@/lib/sample-data";
import { clearExpenses, createId, loadExpenses, saveExpenses, STORAGE_KEY } from "@/lib/storage";
import type { Expense, ExpenseInput } from "@/types/expense";

type Status = "loading" | "ready" | "error";

interface ExpensesContextValue {
  expenses: Expense[];
  status: Status;
  error: string | null;
  addExpense: (input: ExpenseInput) => Expense;
  updateExpense: (id: string, input: ExpenseInput) => Expense;
  deleteExpense: (id: string) => Expense;
  restoreExpense: (expense: Expense) => void;
  loadSampleData: () => number;
  resetData: () => void;
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

/**
 * Holds all expenses and persists them to localStorage.
 * Mutations throw on storage failure so callers can surface the error to the user.
 */
export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  // Mirrors `expenses` so mutations always build on the latest list.
  const expensesRef = useRef<Expense[]>([]);

  const replaceState = useCallback((next: Expense[]) => {
    expensesRef.current = next;
    setExpenses(next);
  }, []);

  const commit = useCallback(
    (next: Expense[]) => {
      saveExpenses(next);
      replaceState(next);
    },
    [replaceState],
  );

  useEffect(() => {
    try {
      replaceState(loadExpenses());
      setStatus("ready");
    } catch (err) {
      logger.error("Failed to load expenses from storage", err);
      setError("We couldn't read your saved expenses. The stored data may be corrupted.");
      setStatus("error");
    }

    // Keep multiple open tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        replaceState(loadExpenses());
      } catch (err) {
        logger.error("Failed to sync expenses from another tab", err);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [replaceState]);

  const addExpense = useCallback(
    (input: ExpenseInput) => {
      const now = new Date().toISOString();
      const expense: Expense = { ...input, id: createId(), createdAt: now, updatedAt: now };
      commit([expense, ...expensesRef.current]);
      return expense;
    },
    [commit],
  );

  const updateExpense = useCallback(
    (id: string, input: ExpenseInput) => {
      const existing = expensesRef.current.find((e) => e.id === id);
      if (!existing) throw new Error("This expense no longer exists.");
      const updated: Expense = { ...existing, ...input, updatedAt: new Date().toISOString() };
      commit(expensesRef.current.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    [commit],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const existing = expensesRef.current.find((e) => e.id === id);
      if (!existing) throw new Error("This expense no longer exists.");
      commit(expensesRef.current.filter((e) => e.id !== id));
      return existing;
    },
    [commit],
  );

  const restoreExpense = useCallback(
    (expense: Expense) => {
      if (expensesRef.current.some((e) => e.id === expense.id)) return;
      commit([expense, ...expensesRef.current]);
    },
    [commit],
  );

  const loadSampleData = useCallback(() => {
    const now = new Date().toISOString();
    const samples = generateSampleExpenses().map<Expense>((input) => ({
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    }));
    commit([...samples, ...expensesRef.current]);
    return samples.length;
  }, [commit]);

  const resetData = useCallback(() => {
    clearExpenses();
    replaceState([]);
    setError(null);
    setStatus("ready");
  }, [replaceState]);

  const value = useMemo(
    () => ({
      expenses,
      status,
      error,
      addExpense,
      updateExpense,
      deleteExpense,
      restoreExpense,
      loadSampleData,
      resetData,
    }),
    [expenses, status, error, addExpense, updateExpense, deleteExpense, restoreExpense, loadSampleData, resetData],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}
