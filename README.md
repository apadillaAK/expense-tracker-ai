# Spendwise: Expense Tracker

A personal expense tracker built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Data is saved in your browser's `localStorage`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Other scripts: `npm run lint`, `npm run typecheck`.

## Features

- **Dashboard**: total, monthly (with month-over-month change), daily-average and top-category cards; a 6-month bar chart; a category donut (this month or all time); recent expenses.
- **Expenses**: searchable, filterable list (category, date range, quick ranges), sorting, and running totals. Shows a table on desktop and cards on mobile.
- **Add / edit**: a modal form with validation and a native date picker.
- **Delete**: asks for confirmation, then shows a toast with an **Undo** button.
- **CSV export**: exports the currently filtered expenses.
- **Sample data**: one click when the app is empty.
- Loading skeletons, error states, toasts, and syncing between open tabs.

## Project structure

```
src/
  app/            routes: dashboard (/), /expenses, error and 404 pages
  components/     UI components (form, list, charts, modal, ...)
  context/        React context: expenses store, toasts, add/edit modal
  lib/            pure helpers: validation, analytics, filters, csv, storage, dates, logger
  types/          shared types
```
