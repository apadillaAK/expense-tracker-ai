import { isCategory, type Expense } from "@/types/expense";
import { isValidISODate } from "./dates";

export const STORAGE_KEY = "expense-tracker:expenses:v1";

function isExpense(value: unknown): value is Expense {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.date === "string" &&
    isValidISODate(e.date) &&
    typeof e.amount === "number" &&
    Number.isFinite(e.amount) &&
    isCategory(e.category) &&
    typeof e.description === "string" &&
    typeof e.createdAt === "string" &&
    typeof e.updatedAt === "string"
  );
}

/** Reads expenses from localStorage. Throws if the stored data is unreadable. */
export function loadExpenses(): Expense[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Stored expenses are not an array");
  return parsed.filter(isExpense);
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    throw new Error("Couldn't save to browser storage. It may be full or disabled.", { cause: err });
  }
}

export function clearExpenses(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
