import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createCategory,
  deleteCategory,
  listCategories,
} from '../api/categories';
import { listExpenses } from '../api/expenses';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { inputClass, labelClass } from '../components/ui/form';

interface CategoryForm {
  name: string;
  color: string;
}

const DEFAULT_COLOR = '#10b981';

export function CategoriesPage() {
  const fetchCategories = useCallback(() => listCategories(), []);
  const fetchExpenses = useCallback(() => listExpenses(), []);
  const { data, loading, error, refetch } = useFetch(fetchCategories);
  const expensesQuery = useFetch(fetchExpenses);
  const [actionError, setActionError] = useState<string | null>(null);

  const hasExpenseCounts = !expensesQuery.loading && !expensesQuery.error;
  const expenseCountByCategoryId = (expensesQuery.data ?? []).reduce<
    Record<string, number>
  >((counts, expense) => {
    counts[expense.categoryId] = (counts[expense.categoryId] ?? 0) + 1;
    return counts;
  }, {});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    defaultValues: { name: '', color: DEFAULT_COLOR },
  });

  async function onSubmit(values: CategoryForm) {
    setActionError(null);
    try {
      await createCategory({ name: values.name.trim(), color: values.color });
      reset({ name: '', color: DEFAULT_COLOR });
      await refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteCategory(id);
      await refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Organize your spending with colored categories.
        </p>
      </header>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">New category</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
          <div className="min-w-[12rem] flex-1">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              className={inputClass}
              placeholder="e.g. Groceries"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="color" className={labelClass}>
              Color
            </label>
            <input
              id="color"
              type="color"
              className="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              {...register('color')}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add category'}
          </Button>
        </form>
        {actionError && (
          <p role="alert" className="mt-3 text-sm text-rose-600">
            {actionError}
          </p>
        )}
      </Card>

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard height="150px" />
          <SkeletonCard height="300px" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Add your first category above to start tracking expenses."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-slate-100">
            {[...data]
              .sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
              )
              .map((category) => {
                const expenseCount = expenseCountByCategoryId[category.id] ?? 0;
                const countLabel = `${expenseCount} ${
                  expenseCount === 1 ? 'expense' : 'expenses'
                }`;
                return (
                  <li
                    key={category.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-slate-800">
                        {category.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">
                        {hasExpenseCounts ? countLabel : '—'}
                      </span>
                      <Button
                        variant="danger"
                        onClick={() => void handleDelete(category.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                );
              })}
          </ul>
        </Card>
      )}
    </div>
  );
}
