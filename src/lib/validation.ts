import { isCategory, type Category, type ExpenseInput } from "@/types/expense";
import { isValidISODate, todayISO } from "./dates";

export interface ExpenseFormValues {
  date: string;
  amount: string;
  category: Category | "";
  description: string;
}

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

export const MAX_AMOUNT = 1_000_000;
export const DESCRIPTION_MAX = 100;

/** Accepts partial input while typing: digits with an optional dot and up to 2 decimals. */
export const AMOUNT_INPUT_PATTERN = /^\d*\.?\d{0,2}$/;

export function validateExpense(values: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  if (!values.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (!/^\d+(\.\d{1,2})?$|^\.\d{1,2}$/.test(values.amount.trim())) {
    errors.amount = "Enter a valid amount, e.g. 12.50.";
  } else {
    const amount = Number(values.amount);
    if (amount <= 0) errors.amount = "Amount must be greater than zero.";
    else if (amount > MAX_AMOUNT) errors.amount = "Amount must be $1,000,000 or less.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  } else if (!isValidISODate(values.date)) {
    errors.date = "Enter a valid date.";
  } else if (values.date > todayISO()) {
    errors.date = "Date can't be in the future.";
  } else if (values.date < "1900-01-01") {
    errors.date = "Date is too far in the past.";
  }

  if (!isCategory(values.category)) {
    errors.category = "Choose a category.";
  }

  const description = values.description.trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 2) {
    errors.description = "Description must be at least 2 characters.";
  } else if (description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or less.`;
  }

  return errors;
}

/** Convert validated form values into a normalized expense payload. */
export function toExpenseInput(values: ExpenseFormValues): ExpenseInput {
  if (!isCategory(values.category)) throw new Error("Invalid category");
  return {
    date: values.date,
    amount: Math.round(Number(values.amount) * 100) / 100,
    category: values.category,
    description: values.description.trim().replace(/\s+/g, " "),
  };
}
