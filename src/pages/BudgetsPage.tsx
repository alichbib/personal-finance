import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { createBudget, deleteBudget, listBudgets } from '../api/budgets';
import { listExpenses } from '../api/expenses';
import { listCategories } from '../api/categories';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { currentMonth, formatMonthShort, formatMoney } from '../lib/format';
import { UNCATEGORIZED_COLOR } from '../lib/categoryColors';
import type { Budget } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { ColorDot } from '../components/ui/ColorDot';
import { ProgressBar } from '../components/ui/ProgressBar';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmModal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useToast } from '../components/ui/Toast';
import { labelClass } from '../components/ui/form';
import { PageBody, PageHeader } from '../components/layout/PageHeader';

interface BudgetForm {
  categoryId: string;
  month: string;
  amount: number;
}

interface BudgetRow {
  budget: Budget;
  name: string;
  color: string;
  spent: number;
  over: boolean;
  percentUsed: number;
  remaining: number;
}

export function BudgetsPage() {
  const { showToast } = useToast();
  const fetchBudgets = useCallback(() => listBudgets(), []);
  const fetchExpenses = useCallback(() => listExpenses(), []);
  const fetchCategories = useCallback(() => listCategories(), []);
  const budgetsQuery = useFetch(fetchBudgets);
  const expensesQuery = useFetch(fetchExpenses);
  const categoriesQuery = useFetch(fetchCategories);

  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BudgetRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = categoriesQuery.data ?? [];
  const hasCategories = categories.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetForm>({
    defaultValues: { categoryId: '', month: currentMonth(), amount: undefined },
  });

  const orderedError =
    errors.categoryId?.message ?? errors.amount?.message ?? formError;

  async function onSubmit(values: BudgetForm) {
    setFormError(null);
    try {
      await createBudget({
        categoryId: values.categoryId,
        month: values.month,
        amount: Number(values.amount),
      });
      reset({ categoryId: '', month: values.month, amount: undefined });
      await budgetsQuery.refetch();
      showToast('Budget added');
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBudget(pendingDelete.budget.id);
      await budgetsQuery.refetch();
      showToast('Budget deleted');
      setPendingDelete(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const budgets = budgetsQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];

  const rows: BudgetRow[] = [...budgets]
    .sort((a, b) => b.month.localeCompare(a.month))
    .map((budget) => {
      const spent = expenses
        .filter(
          (e) =>
            e.categoryId === budget.categoryId &&
            e.date.startsWith(budget.month),
        )
        .reduce((sum, e) => sum + e.amount, 0);
      const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return {
        budget,
        name: budget.category?.name ?? 'Uncategorized',
        color: budget.category?.color ?? UNCATEGORIZED_COLOR,
        spent,
        over: spent > budget.amount,
        percentUsed,
        remaining: budget.amount - spent,
      };
    });

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);

  const loading = budgetsQuery.loading || categoriesQuery.loading;
  const error = budgetsQuery.error;

  return (
    <>
      <PageHeader
        title="Budgets"
        subtitle="Set limits and watch your progress."
      />
      <PageBody>
        {loading ? (
          <>
            <SkeletonCard height="130px" />
            <div className="h-[18px]" />
            <SkeletonCard height="320px" />
          </>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => void budgetsQuery.refetch()}
          />
        ) : (
          <>
            {/* Summary */}
            <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-surface px-6 py-[22px] shadow-card">
              <div>
                <div className="text-[13px] font-medium text-ink-subtle">
                  Total budgeted
                </div>
                <div className="mt-1.5 font-mono text-[27px] font-semibold tracking-[-0.02em] tnum">
                  {formatMoney(totalBudgeted)}
                </div>
              </div>
              <div className="rounded-full bg-surface-muted px-3.5 py-[7px] text-[13px] font-medium text-ink-faint">
                {budgets.length} {budgets.length === 1 ? 'budget' : 'budgets'}
              </div>
            </div>

            {/* Add budget */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mb-[18px] rounded-card border border-border bg-surface px-6 py-[22px] shadow-card"
            >
              <div className="mb-4 text-[15px] font-semibold text-ink">
                Add budget
              </div>
              {!hasCategories && (
                <p className="mb-4 rounded-md bg-warning-bg px-3.5 py-2.5 text-[13px] text-warning-text">
                  Add a category first to set a budget.
                </p>
              )}
              <div className="flex flex-wrap items-end gap-[13px]">
                <div className="min-w-[160px] flex-1">
                  <label htmlFor="budgetCategory" className={labelClass}>
                    Category
                  </label>
                  <Select
                    id="budgetCategory"
                    disabled={!hasCategories}
                    {...register('categoryId', {
                      required: 'Choose a category.',
                    })}
                  >
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="min-w-[130px] flex-1">
                  <label htmlFor="budgetAmount" className={labelClass}>
                    Monthly limit
                  </label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    mono
                    placeholder="0.00"
                    {...register('amount', {
                      valueAsNumber: true,
                      validate: (v) =>
                        (typeof v === 'number' && !Number.isNaN(v) && v > 0) ||
                        'Enter an amount greater than 0.',
                    })}
                  />
                </div>
                <div className="min-w-[130px] flex-1">
                  <label htmlFor="budgetMonth" className={labelClass}>
                    Month
                  </label>
                  <Input
                    id="budgetMonth"
                    type="month"
                    {...register('month', { required: true })}
                  />
                </div>
                <Button
                  type="submit"
                  leadingPlus
                  disabled={isSubmitting || !hasCategories}
                >
                  Add budget
                </Button>
              </div>
              {orderedError && (
                <p role="alert" className="mt-3 text-[13px] text-danger">
                  {orderedError}
                </p>
              )}
            </form>

            {/* Budget cards */}
            {rows.length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {rows.map((row) => (
                  <div
                    key={row.budget.id}
                    className="rounded-card-sm border border-border bg-surface px-[22px] py-[18px] shadow-card"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <ColorDot color={row.color} size={10} />
                        <span className="text-[15px] font-semibold text-ink">
                          {row.name}
                        </span>
                        <Badge tone="muted" className="text-xs font-medium">
                          {formatMonthShort(row.budget.month)}
                        </Badge>
                        {row.over && <Badge tone="danger">Over budget</Badge>}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-3.5">
                        <div className="font-mono text-sm font-semibold tnum">
                          {formatMoney(row.spent)}{' '}
                          <span className="font-normal text-ink-faint">
                            / {formatMoney(row.budget.amount)}
                          </span>
                        </div>
                        <IconButton
                          title="Delete"
                          aria-label={`Delete ${row.name} budget`}
                          onClick={() => setPendingDelete(row)}
                        >
                          <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                        </IconButton>
                      </div>
                    </div>
                    <ProgressBar
                      value={row.percentUsed}
                      color={row.color}
                      over={row.over}
                      height={10}
                    />
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[12.5px] text-ink-faint tnum">
                        {Math.round(row.percentUsed)}% used
                      </span>
                      <span
                        className={`text-[12.5px] font-medium ${
                          row.remaining >= 0 ? 'text-ink-subtle' : 'text-danger-hover'
                        }`}
                      >
                        {row.remaining >= 0
                          ? `${formatMoney(row.remaining)} left`
                          : `${formatMoney(-row.remaining)} over`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface shadow-card">
                <EmptyState
                  icon="target"
                  title="No budgets yet"
                  message="Add a budget above to start tracking spending against a limit."
                />
              </div>
            )}
          </>
        )}
      </PageBody>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete budget?"
        message={
          pendingDelete
            ? `This will remove the ${pendingDelete.name} budget. Your expenses are not affected.`
            : ''
        }
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
