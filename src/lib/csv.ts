import type { Expense } from "@/types/expense";

function escapeCell(value: string): string {
  // Neutralize spreadsheet formula injection (cells starting with = + - @).
  let cell = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\r\n]/.test(cell)) cell = `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

export function expensesToCsv(expenses: Expense[]): string {
  const header = ["Date", "Description", "Category", "Amount"];
  const rows = expenses.map((e) => [e.date, e.description, e.category, e.amount.toFixed(2)]);
  return [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  // BOM so Excel detects UTF-8.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
