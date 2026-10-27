import type { Category, ExpenseInput } from "@/types/expense";
import { addDays, todayISO } from "./dates";

const TEMPLATES: [Category, string, number, number][] = [
  ["Food", "Grocery run", 45, 140],
  ["Food", "Lunch with the team", 12, 35],
  ["Food", "Coffee & pastry", 4, 12],
  ["Food", "Dinner out", 30, 90],
  ["Transportation", "Gas refill", 35, 70],
  ["Transportation", "Rideshare", 9, 32],
  ["Transportation", "Monthly transit pass", 60, 90],
  ["Entertainment", "Movie tickets", 15, 40],
  ["Entertainment", "Streaming subscription", 10, 18],
  ["Entertainment", "Concert", 45, 120],
  ["Shopping", "New running shoes", 70, 140],
  ["Shopping", "Online order", 15, 90],
  ["Shopping", "Home supplies", 20, 60],
  ["Bills", "Electricity bill", 60, 130],
  ["Bills", "Internet service", 55, 80],
  ["Bills", "Phone plan", 35, 65],
  ["Other", "Birthday gift", 25, 80],
  ["Other", "Haircut", 20, 45],
];

/** Small deterministic PRNG so the demo data is stable. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSampleExpenses(count = 48): ExpenseInput[] {
  const random = mulberry32(42);
  const today = todayISO();
  return Array.from({ length: count }, () => {
    const [category, description, min, max] = TEMPLATES[Math.floor(random() * TEMPLATES.length)];
    return {
      category,
      description,
      date: addDays(today, -Math.floor(random() * 180)),
      amount: Math.round((min + random() * (max - min)) * 100) / 100,
    };
  });
}
