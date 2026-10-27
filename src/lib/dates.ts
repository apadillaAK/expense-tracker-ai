const pad = (n: number) => String(n).padStart(2, "0");

/** Format a Date as a local YYYY-MM-DD string. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Parse YYYY-MM-DD as a local date (avoids the UTC shift of `new Date("YYYY-MM-DD")`). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return toISODate(parseISODate(iso)) === iso;
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** YYYY-MM key for a YYYY-MM-DD date. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function shiftMonthKey(key: string, months: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + months, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function formatMonthKey(key: string, style: "short" | "long" = "short"): string {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: style,
    ...(style === "long" ? { year: "numeric" } : {}),
  }).format(new Date(y, m - 1, 1));
}

export function startOfMonthISO(d = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
}

export function startOfYearISO(d = new Date()): string {
  return `${d.getFullYear()}-01-01`;
}
