import { addDays, parseISODate, todayISO } from "./dates";

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compactFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatCurrency = (amount: number) => currencyFormatter.format(amount);

export const formatCompactCurrency = (amount: number) =>
  amount < 1000 ? currencyFormatter.format(Math.round(amount)) : compactFormatter.format(amount);

export const formatDate = (iso: string) => dateFormatter.format(parseISODate(iso));

export function formatRelativeDate(iso: string): string {
  const today = todayISO();
  if (iso === today) return "Today";
  if (iso === addDays(today, -1)) return "Yesterday";
  return formatDate(iso);
}

export const formatPercent = (ratio: number) => `${Math.round(ratio * 100)}%`;
