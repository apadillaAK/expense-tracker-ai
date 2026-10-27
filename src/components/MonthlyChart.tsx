import type { MonthTotal } from "@/lib/analytics";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

export function MonthlyChart({ data }: { data: MonthTotal[] }) {
  const max = Math.max(...data.map((d) => d.total), 0);
  // Round the axis top to a friendly number.
  const step = max > 0 ? 10 ** Math.floor(Math.log10(max)) : 1;
  const axisMax = max > 0 ? Math.ceil(max / step) * step : 100;
  const ticks = [1, 0.5, 0].map((r) => axisMax * r);
  const average = data.reduce((s, d) => s + d.total, 0) / (data.length || 1);

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Monthly spending</h2>
          <p className="text-sm text-slate-500">Last {data.length} months</p>
        </div>
        <p className="text-sm text-slate-500">
          Avg <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(average)}</span>/mo
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex h-56 flex-col justify-between pb-6 text-right text-xs text-slate-400 tabular-nums">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {formatCompactCurrency(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className="border-t border-dashed border-slate-200" />
            ))}
          </div>

          <ul className="relative flex h-56 items-end gap-2 sm:gap-4">
            {data.map((d, i) => {
              const isCurrent = i === data.length - 1;
              const pct = axisMax > 0 ? (d.total / axisMax) * 100 : 0;
              return (
                <li key={d.key} className="group flex h-full flex-1 flex-col items-center justify-end">
                  <div className="relative flex h-[calc(100%-1.5rem)] w-full items-end justify-center">
                    <span className="pointer-events-none absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                      {formatCurrency(d.total)}
                    </span>
                    <div
                      className={`w-full max-w-12 rounded-t-md transition-all duration-500 ${
                        isCurrent ? "bg-indigo-600" : "bg-indigo-200 group-hover:bg-indigo-300"
                      }`}
                      style={{ height: `${d.total > 0 ? Math.max(pct, 1.5) : 0}%` }}
                      role="img"
                      aria-label={`${d.label}: ${formatCurrency(d.total)}`}
                    />
                  </div>
                  <span
                    className={`mt-2 h-4 text-xs ${isCurrent ? "font-semibold text-slate-900" : "text-slate-500"}`}
                  >
                    {d.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
