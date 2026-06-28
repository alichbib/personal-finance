import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDashboardSummary } from '../api/dashboard';
import { listExpenses } from '../api/expenses';
import { useFetch } from '../hooks/useFetch';
import {
  currentMonth,
  firstNameFromEmail,
  formatMoney,
  formatMonthLabel,
  greeting,
  shiftMonth,
} from '../lib/format';
import type { DashboardSummary } from '../types';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ColorDot } from '../components/ui/ColorDot';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { PageBody, PageHeader } from '../components/layout/PageHeader';

interface DashboardData {
  summary: DashboardSummary;
  prevMonthTotal: number;
  allTimeCount: number;
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [month, setMonth] = useState(currentMonth());

  const fetchAll = useCallback(async (): Promise<DashboardData> => {
    const [summary, prevSummary, expenses] = await Promise.all([
      getDashboardSummary(month),
      getDashboardSummary(shiftMonth(month, -1)),
      listExpenses(),
    ]);
    return {
      summary,
      prevMonthTotal: prevSummary.monthlyExpenses,
      allTimeCount: expenses.length,
    };
  }, [month]);

  const { data, loading, error, refetch } = useFetch(fetchAll);

  const firstName = firstNameFromEmail(user?.email);
  const monthLabel = formatMonthLabel(month);
  const isThisMonth = month === currentMonth();

  const monthSelector = (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => setMonth((m) => shiftMonth(m, -1))}
        className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-border-strong bg-surface text-ink-muted transition-colors hover:bg-app"
      >
        <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="min-w-[148px] text-center text-[15px] font-semibold text-ink">
        {monthLabel}
      </div>
      <button
        type="button"
        aria-label="Next month"
        onClick={() => setMonth((m) => shiftMonth(m, 1))}
        className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-border-strong bg-surface text-ink-muted transition-colors hover:bg-app"
      >
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setMonth(currentMonth())}
        disabled={isThisMonth}
        className="h-9 rounded-[9px] border border-border-strong bg-surface px-3.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-app disabled:cursor-not-allowed disabled:opacity-50"
      >
        This month
      </button>
    </div>
  );

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle="Here's how your money is moving this month."
      />
      <PageBody>
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void refetch()} />
        ) : data ? (
          <DashboardContent
            data={data}
            monthLabel={monthLabel}
            monthSelector={monthSelector}
          />
        ) : null}
      </PageBody>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-[18px] folio:grid-cols-3">
        <SkeletonCard height="118px" />
        <SkeletonCard height="118px" />
        <SkeletonCard height="118px" />
      </div>
      <div className="grid grid-cols-1 gap-[18px] folio:grid-cols-2">
        <SkeletonCard height="320px" />
        <SkeletonCard height="320px" />
      </div>
    </>
  );
}

function DashboardContent({
  data,
  monthLabel,
  monthSelector,
}: {
  data: DashboardData;
  monthLabel: string;
  monthSelector: React.ReactNode;
}) {
  const { summary, prevMonthTotal, allTimeCount } = data;
  const breakdown = [...summary.categoryBreakdown].sort(
    (a, b) => b.total - a.total,
  );
  const topCategory = breakdown[0];
  const maxCategory = topCategory ? topCategory.total : 0;
  const monthTotal = summary.monthlyExpenses;

  // Trend vs previous month.
  let trend: { label: string; tone: 'muted' | 'warning' | 'success' };
  if (prevMonthTotal > 0) {
    const diff = ((monthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    const up = diff >= 0;
    trend = {
      label: `${up ? '↑' : '↓'} ${Math.abs(Math.round(diff))}%`,
      tone: up ? 'warning' : 'success',
    };
  } else {
    trend = { label: 'No prior data', tone: 'muted' };
  }

  const hasMonthData = breakdown.length > 0;
  const hasBudgets = summary.budgetUsage.length > 0;

  return (
    <>
      <div className="mb-5">{monthSelector}</div>

      {/* Stat cards */}
      <div className="mb-[18px] grid grid-cols-1 gap-[18px] folio:grid-cols-3">
        <Card>
          <div className="text-[13px] font-medium text-ink-subtle">
            Total spent
          </div>
          <div className="mt-2.5 font-mono text-[29px] font-semibold tracking-[-0.02em] tnum">
            {formatMoney(summary.totalExpenses)}
          </div>
          <div className="mt-[7px] text-[12.5px] text-ink-faint">
            All time · {allTimeCount}{' '}
            {allTimeCount === 1 ? 'expense' : 'expenses'}
          </div>
        </Card>

        <Card>
          <div className="text-[13px] font-medium text-ink-subtle">
            This month
          </div>
          <div className="mt-2.5 font-mono text-[29px] font-semibold tracking-[-0.02em] tnum">
            {formatMoney(monthTotal)}
          </div>
          <div className="mt-[7px] flex items-center gap-1.5">
            <Badge tone={trend.tone} className="text-xs">
              {trend.label}
            </Badge>
            <span className="text-[12.5px] text-ink-faint">vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="text-[13px] font-medium text-ink-subtle">
            Top category
          </div>
          {topCategory ? (
            <>
              <div className="mt-3 flex items-center gap-2.5">
                <ColorDot color={topCategory.color} size={11} />
                <span className="text-xl font-semibold tracking-[-0.02em] text-ink">
                  {topCategory.name}
                </span>
              </div>
              <div className="mt-2 text-[12.5px] text-ink-faint">
                {formatMoney(topCategory.total)} ·{' '}
                {monthTotal > 0
                  ? Math.round((topCategory.total / monthTotal) * 100)
                  : 0}
                % of spending
              </div>
            </>
          ) : (
            <div className="mt-3.5 text-[15px] text-ink-faint">
              No spending yet
            </div>
          )}
        </Card>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 items-start gap-[18px] folio:grid-cols-2">
        {/* Spending by category */}
        <Card className="!p-6">
          <div className="mb-0.5 text-[15px] font-semibold text-ink">
            Spending by category
          </div>
          <div className="mb-5 text-[13px] text-ink-faint">{monthLabel}</div>
          {hasMonthData ? (
            <div className="flex flex-col gap-[17px]">
              {breakdown.map((item) => {
                const pct =
                  monthTotal > 0
                    ? Math.round((item.total / monthTotal) * 100)
                    : 0;
                const barValue =
                  maxCategory > 0 ? (item.total / maxCategory) * 100 : 0;
                return (
                  <div key={item.categoryId}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ColorDot color={item.color} size={10} />
                        <span className="text-[13.5px] font-medium text-ink">
                          {item.name}
                        </span>
                      </div>
                      <div className="font-mono text-[13px] text-ink-secondary tnum">
                        {formatMoney(item.total)}{' '}
                        <span className="text-ink-faint">· {pct}%</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={barValue}
                      color={item.color}
                      minWidth={3}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="chart"
              title="No spending this month"
              message="Add an expense to see your category breakdown."
            />
          )}
        </Card>

        {/* Budget usage */}
        <Card className="!p-6">
          <div className="mb-0.5 text-[15px] font-semibold text-ink">
            Budget usage
          </div>
          <div className="mb-5 text-[13px] text-ink-faint">{monthLabel}</div>
          {hasBudgets ? (
            <div className="flex flex-col gap-[18px]">
              {summary.budgetUsage.map((item) => {
                const over = item.spent > item.budget;
                return (
                  <div key={item.categoryId}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ColorDot color={item.color} size={10} />
                        <span className="text-[13.5px] font-medium text-ink">
                          {item.name}
                        </span>
                        {over && <Badge tone="danger">Over</Badge>}
                      </div>
                      <div className="font-mono text-[13px] text-ink-secondary tnum">
                        {formatMoney(item.spent)}{' '}
                        <span className="text-ink-faint">
                          / {formatMoney(item.budget)}
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      value={
                        item.budget > 0
                          ? (item.spent / item.budget) * 100
                          : 0
                      }
                      color={item.color}
                      over={over}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="target"
              title="No budgets set"
              message="Create a budget to track your spending against a limit."
            />
          )}
        </Card>
      </div>
    </>
  );
}
