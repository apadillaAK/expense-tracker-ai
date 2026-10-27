export const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  /** Calendar date in YYYY-MM-DD (local, no timezone). */
  date: string;
  /** Amount in dollars, rounded to 2 decimals. */
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInput = Pick<Expense, "date" | "amount" | "category" | "description">;

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
