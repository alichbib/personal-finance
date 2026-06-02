import { useCallback, useState } from 'react';
import { getDashboardSummary } from '../api/dashboard';
import { useFetch } from '../hooks/useFetch';
import {
  currentMonth,
  formatMoney,
  formatMonthLabel,
  shiftMonth,
} from '../lib/format';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </Card>
  );
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [month, setMonth] = useState(currentMonth());

  const fetchSummary = useCallback(() => getDashboardSummary(month), [month]);
  const { data, loading, error, refetch } = useFetch(fetchSummary);

  const greetingName = user?.email.split('@')[0] ?? '';

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Hello{greetingName ? `, ${greetingName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's how your money is moving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            aria-label="Previous month"
            onClick={() => setMonth((current) => shiftMonth(current, -1))}
          >
            ‹
          </Button>
          <span className="min-w-[8.5rem] text-center text-sm font-semibold text-slate-700">
            {formatMonthLabel(month)}
          </span>
          <Button
            variant="secondary"
            aria-label="Next month"
            onClick={() => setMonth((current) => shiftMonth(current, 1))}
          >
            ›
          </Button>
          {month !== currentMonth() ? (
            <Button
              variant="ghost"
              className="px-3 py-2"
              onClick={() => setMonth(currentMonth())}
            >
              This month
            </Button>
          ) : null}
        </div>
      </header>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refetch()} />
      ) : data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total spent"
              value={formatMoney(data.totalExpenses)}
              hint="All time"
            />
            <StatCard
              label="This month"
              value={formatMoney(data.monthlyExpenses)}
              hint={formatMonthLabel(month)}
            />
            <StatCard
              label="Top category"
              value={data.categoryBreakdown[0]?.name ?? '—'}
              hint={
                data.categoryBreakdown[0]
                  ? formatMoney(data.categoryBreakdown[0].total)
                  : 'No spend yet'
              }
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-sm font-semibold text-slate-900">
                Spending by category
              </h2>
              {data.categoryBreakdown.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No expenses recorded this month yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.categoryBreakdown.map((item) => {
                    const share =
                      data.monthlyExpenses > 0
                        ? Math.round((item.total / data.monthlyExpenses) * 100)
                        : 0;
                    return (
                      <div key={item.categoryId}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-slate-700">
                              {item.name}
                            </span>
                          </span>
                          <span className="text-slate-500">
                            {formatMoney(item.total)} · {share}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${share}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900">
                Budget usage
              </h2>
              {data.budgetUsage.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No budgets set for this month yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {data.budgetUsage.map((item) => {
                    const isOver = item.percentUsed > 100;
                    const barWidth = Math.min(item.percentUsed, 100);
                    return (
                      <div key={item.categoryId}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {item.name}
                          </span>
                          <span
                            className={
                              isOver ? 'text-rose-600' : 'text-slate-500'
                            }
                          >
                            {formatMoney(item.spent)} /{' '}
                            {formatMoney(item.budget)}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              isOver ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.percentUsed}% used ·{' '}
                          {formatMoney(Math.abs(item.remaining))}{' '}
                          {item.remaining >= 0 ? 'left' : 'over'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </section>
        </>
      ) : null}
    </div>
  );
}
