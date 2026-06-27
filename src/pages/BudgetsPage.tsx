import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBudget, deleteBudget, listBudgets } from '../api/budgets';
import { listCategories } from '../api/categories';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { currentMonth, formatMonthLabel, formatMoney } from '../lib/format';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { inputClass, labelClass, selectClass } from '../components/ui/form';

interface BudgetForm {
  categoryId: string;
  month: string;
  amount: number;
}

export function BudgetsPage() {
  const fetchBudgets = useCallback(() => listBudgets(), []); 
  const fetchCategories = useCallback(() => listCategories(), []);
  const budgetsQuery = useFetch(fetchBudgets);
  const categoriesQuery = useFetch(fetchCategories);
  const [actionError, setActionError] = useState<string | null>(null);

  const categories = categoriesQuery.data ?? [];
  const hasCategories = categories.length > 0;

  const sortedBudgets = [...(budgetsQuery.data ?? [])].sort((a, b) =>
    b.month.localeCompare(a.month),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetForm>({
    defaultValues: { categoryId: '', month: currentMonth(), amount: 0 },
  });

  async function onSubmit(values: BudgetForm) {
    setActionError(null);
    try {
      await createBudget({
        categoryId: values.categoryId,
        month: values.month,
        amount: Number(values.amount),
      });
      reset({ categoryId: values.categoryId, month: values.month, amount: 0 });
      await budgetsQuery.refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteBudget(id);
      await budgetsQuery.refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Budgets
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Set a monthly spending limit per category.
        </p>
      </header>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">New budget</h2>
        {!hasCategories && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
            Add a category first to set a budget.
          </p>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-3"
        >
          <div>
            <label htmlFor="budgetCategory" className={labelClass}>
              Category
            </label>
            <select
              id="budgetCategory"
              className={selectClass}
              disabled={!hasCategories}
              {...register('categoryId', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="month" className={labelClass}>
              Month
            </label>
            <input
              id="month"
              type="month"
              className={inputClass}
              {...register('month', { required: 'Month is required' })}
            />
            {errors.month && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.month.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="budgetAmount" className={labelClass}>
              Amount
            </label>
            <input
              id="budgetAmount"
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Amount must be 0 or more' },
              })}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <Button type="submit" disabled={isSubmitting || !hasCategories}>
              {isSubmitting ? 'Saving…' : 'Set budget'}
            </Button>
          </div>
        </form>
        {actionError && (
          <p role="alert" className="mt-3 text-sm text-rose-600">
            {actionError}
          </p>
        )}
      </Card>

      {budgetsQuery.loading ? (
        <div className="space-y-4">
          <SkeletonCard height="130px" />
          <SkeletonCard height="320px" />
        </div>
      ) : budgetsQuery.error ? (
        <ErrorState
          message={budgetsQuery.error}
          onRetry={() => void budgetsQuery.refetch()}
        />
      ) : !budgetsQuery.data || budgetsQuery.data.length === 0 ? (
        <EmptyState
          title="No budgets yet"
          message="Set a monthly budget above to track your spending against it."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-slate-100">
            {sortedBudgets.map((budget) => (
              <li
                key={budget.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium text-slate-800">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: budget.category?.color ?? '#94a3b8',
                      }}
                    />
                    {budget.category?.name ?? 'Uncategorized'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatMonthLabel(budget.month)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-900">
                    {formatMoney(budget.amount)}
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => void handleDelete(budget.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
