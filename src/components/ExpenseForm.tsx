"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { CATEGORY_META } from "@/lib/categories";
import { todayISO } from "@/lib/dates";
import {
  AMOUNT_INPUT_PATTERN,
  DESCRIPTION_MAX,
  toExpenseInput,
  validateExpense,
  type ExpenseFormValues,
} from "@/lib/validation";
import { CATEGORIES, type Expense, type ExpenseInput } from "@/types/expense";

interface ExpenseFormProps {
  initial?: Expense;
  submitLabel?: string;
  onSubmit: (input: ExpenseInput) => void | Promise<void>;
  onCancel: () => void;
}

type Field = keyof ExpenseFormValues;
const FIELD_ORDER: Field[] = ["amount", "date", "category", "description"];

export function ExpenseForm({ initial, submitLabel = "Save", onSubmit, onCancel }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(() => ({
    amount: initial ? initial.amount.toFixed(2) : "",
    date: initial?.date ?? todayISO(),
    category: initial?.category ?? "",
    description: initial?.description ?? "",
  }));
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => validateExpense(values), [values]);
  const visibleError = (field: Field) => (touched[field] || submitted ? errors[field] : undefined);

  const set = <K extends Field>(field: K, value: ExpenseFormValues[K]) =>
    setValues((v) => ({ ...v, [field]: value }));
  const blur = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      document.getElementById(`expense-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(toExpenseInput(values));
    } finally {
      setSubmitting(false);
    }
  };

  const amountError = visibleError("amount");
  const dateError = visibleError("date");
  const categoryError = visibleError("category");
  const descriptionError = visibleError("description");

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="expense-amount" className="label">
            Amount
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">$</span>
            <input
              id="expense-amount"
              data-autofocus
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              className={`input pl-7 tabular-nums ${amountError ? "input-error" : ""}`}
              value={values.amount}
              onChange={(e) => {
                const next = e.target.value.replace(/,/g, "");
                if (AMOUNT_INPUT_PATTERN.test(next)) set("amount", next);
              }}
              onBlur={() => blur("amount")}
              aria-invalid={!!amountError}
              aria-describedby={amountError ? "expense-amount-error" : undefined}
            />
          </div>
          <FieldError id="expense-amount-error" message={amountError} />
        </div>

        <div>
          <label htmlFor="expense-date" className="label">
            Date
          </label>
          <input
            id="expense-date"
            type="date"
            max={todayISO()}
            className={`input mt-1.5 ${dateError ? "input-error" : ""}`}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            onBlur={() => blur("date")}
            aria-invalid={!!dateError}
            aria-describedby={dateError ? "expense-date-error" : undefined}
          />
          <FieldError id="expense-date-error" message={dateError} />
        </div>
      </div>

      <fieldset>
        <legend className="label">Category</legend>
        <div
          id="expense-category"
          role="radiogroup"
          tabIndex={-1}
          aria-invalid={!!categoryError}
          aria-describedby={categoryError ? "expense-category-error" : undefined}
          className="mt-1.5 grid grid-cols-2 gap-2 outline-none sm:grid-cols-3"
        >
          {CATEGORIES.map((category) => {
            const { icon: Icon, tile } = CATEGORY_META[category];
            const selected = values.category === category;
            return (
              <button
                key={category}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  set("category", category);
                  blur("category");
                }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tile}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="truncate">{category}</span>
              </button>
            );
          })}
        </div>
        <FieldError id="expense-category-error" message={categoryError} />
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="expense-description" className="label">
            Description
          </label>
          <span
            className={`text-xs tabular-nums ${
              values.description.length > DESCRIPTION_MAX ? "text-rose-600" : "text-slate-400"
            }`}
          >
            {values.description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <input
          id="expense-description"
          type="text"
          placeholder="e.g. Weekly groceries"
          className={`input mt-1.5 ${descriptionError ? "input-error" : ""}`}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          onBlur={() => blur("description")}
          aria-invalid={!!descriptionError}
          aria-describedby={descriptionError ? "expense-description-error" : undefined}
        />
        <FieldError id="expense-description-error" message={descriptionError} />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
