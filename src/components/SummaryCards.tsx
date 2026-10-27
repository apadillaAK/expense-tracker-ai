import { CalendarDays, CircleDollarSign, Crown, TrendingDown, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { DashboardStats } from "@/lib/analytics";
import { CATEGORY_META } from "@/lib/categories";
import { formatCurrency, formatPercent } from "@/lib/format";

export function SummaryCards({ stats }: { stats: DashboardStats }) {
  const top = stats.topCategory;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Wallet}
        tone="bg-indigo-100 text-indigo-600"
        label="Total spending"
        value={formatCurrency(stats.total)}
        footer={`${stats.count} expense${stats.count === 1 ? "" : "s"} recorded`}
      />
      <StatCard
        icon={CalendarDays}
        tone="bg-sky-100 text-sky-600"
        label="This month"
        value={formatCurrency(stats.thisMonth)}
        footer={<MonthChange change={stats.monthChange} />}
      />
      <StatCard
        icon={CircleDollarSign}
        tone="bg-emerald-100 text-emerald-600"
        label="Daily average"
        value={formatCurrency(stats.dailyAverage)}
        footer={`Across ${stats.thisMonthCount} expense${stats.thisMonthCount === 1 ? "" : "s"} this month`}
      />
      <StatCard
        icon={top ? CATEGORY_META[top.category].icon : Crown}
        tone={top ? CATEGORY_META[top.category].tile : "bg-amber-100 text-amber-600"}
        label="Top category"
        value={top ? top.category : "—"}
        footer={
          top
            ? `${formatCurrency(top.total)} · ${formatPercent(top.share)} of ${
                stats.topCategoryScope === "month" ? "this month" : "all time"
              }`
            : "No spending yet"
        }
      />
    </div>
  );
}

function MonthChange({ change }: { change: number | null }) {
  if (change === null) return <span>No spending last month</span>;
  if (Math.abs(change) < 0.005) return <span>Same as last month</span>;
  const up = change > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-flex items-center gap-0.5 font-medium ${up ? "text-rose-600" : "text-emerald-600"}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {formatPercent(Math.abs(change))}
      </span>
      {up ? "more" : "less"} than last month
    </span>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  tone: string;
  label: string;
  value: string;
  footer: ReactNode;
}

function StatCard({ icon: Icon, tone, label, value, footer }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      <p className="mt-1 truncate text-xs text-slate-500">{footer}</p>
    </div>
  );
}
