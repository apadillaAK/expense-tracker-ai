import { CATEGORIES, type Category, type Expense } from "@/types/expense";
import { formatMonthKey, monthKey, shiftMonthKey, todayISO } from "./dates";

const round2 = (n: number) => Math.round(n * 100) / 100;

export const sumAmounts = (expenses: Expense[]) =>
  round2(expenses.reduce((sum, e) => sum + e.amount, 0));

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
  /** Share of overall spending, 0–1. */
  share: number;
}

export function totalsByCategory(expenses: Expense[]): CategoryTotal[] {
  const overall = sumAmounts(expenses);
  return CATEGORIES.map((category) => {
    const items = expenses.filter((e) => e.category === category);
    const total = sumAmounts(items);
    return { category, total, count: items.length, share: overall > 0 ? total / overall : 0 };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);
}

export interface MonthTotal {
  key: string;
  label: string;
  total: number;
}

/** Totals for the last `months` calendar months, ending with the current month. */
export function monthlyTotals(expenses: Expense[], months = 6): MonthTotal[] {
  const endKey = monthKey(todayISO());
  const totals = new Map<string, number>();
  for (const e of expenses) {
    const key = monthKey(e.date);
    totals.set(key, (totals.get(key) ?? 0) + e.amount);
  }
  return Array.from({ length: months }, (_, i) => {
    const key = shiftMonthKey(endKey, i - (months - 1));
    return { key, label: formatMonthKey(key), total: round2(totals.get(key) ?? 0) };
  });
}

export const expensesInMonth = (expenses: Expense[], key: string) =>
  expenses.filter((e) => monthKey(e.date) === key);

export interface DashboardStats {
  total: number;
  count: number;
  thisMonth: number;
  thisMonthCount: number;
  lastMonth: number;
  /** Month-over-month change as a ratio, or null when last month had no spending. */
  monthChange: number | null;
  dailyAverage: number;
  topCategory: CategoryTotal | null;
  topCategoryScope: "month" | "all";
}

export function getDashboardStats(expenses: Expense[]): DashboardStats {
  const today = todayISO();
  const currentKey = monthKey(today);
  const thisMonthExpenses = expensesInMonth(expenses, currentKey);
  const thisMonth = sumAmounts(thisMonthExpenses);
  const lastMonth = sumAmounts(expensesInMonth(expenses, shiftMonthKey(currentKey, -1)));
  const dayOfMonth = Number(today.slice(8, 10));

  const monthTop = totalsByCategory(thisMonthExpenses)[0] ?? null;
  const allTop = totalsByCategory(expenses)[0] ?? null;

  return {
    total: sumAmounts(expenses),
    count: expenses.length,
    thisMonth,
    thisMonthCount: thisMonthExpenses.length,
    lastMonth,
    monthChange: lastMonth > 0 ? (thisMonth - lastMonth) / lastMonth : null,
    dailyAverage: round2(thisMonth / dayOfMonth),
    topCategory: monthTop ?? allTop,
    topCategoryScope: monthTop ? "month" : "all",
  };
}
