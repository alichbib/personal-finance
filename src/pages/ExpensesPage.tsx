import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createExpense,
  deleteExpense,
  listExpenses,
} from '../api/expenses';
import { listCategories } from '../api/categories';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { formatDate, formatMoney } from '../lib/format';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { inputClass, labelClass, selectClass } from '../components/ui/form';

interface ExpenseForm {
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  notes: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpensesPage() {
  const fetchExpenses = useCallback(() => listExpenses(), []);
  const fetchCategories = useCallback(() => listCategories(), []);
  const expensesQuery = useFetch(fetchExpenses);
  const categoriesQuery = useFetch(fetchCategories);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const categories = categoriesQuery.data ?? [];
  const hasCategories = categories.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseForm>({
    defaultValues: {
      title: '',
      amount: 0,
      date: todayIso(),
      categoryId: '',
      notes: '',
    },
  });

  async function onSubmit(values: ExpenseForm) {
    setActionError(null);
    try {
      await createExpense({
        title: values.title.trim(),
        amount: Number(values.amount),
        date: new Date(`${values.date}T00:00:00.000Z`).toISOString(),
        categoryId: values.categoryId,
        notes: values.notes.trim() || null,
      });
      reset({
        title: '',
        amount: 0,
        date: todayIso(),
        categoryId: values.categoryId,
        notes: '',
      });
      await expensesQuery.refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    try {
      await deleteExpense(id);
      await expensesQuery.refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function confirmDelete(id: string) {
    setDeletingId(id);
    try {
      await handleDelete(id);
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  }

  const allExpenses = expensesQuery.data ?? [];
  const hasActiveFilters = search.trim() !== '' || categoryFilter !== '';

  function clearFilters() {
    setSearch('');
    setCategoryFilter('');
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredExpenses = allExpenses.filter((expense) => {
    const matchesSearch =
      normalizedSearch === '' ||
      expense.title.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      categoryFilter === '' || expense.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return a.date.localeCompare(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'date-desc':
      default:
        return b.date.localeCompare(a.date);
    }
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Expenses
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Record what you spend and where it goes.
        </p>
      </header>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">New expense</h2>
        {!hasCategories && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
            Add a category first to start recording expenses.
          </p>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              className={inputClass}
              placeholder="e.g. Weekly groceries"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className={labelClass}>
              Amount
            </label>
            <input
              id="amount"
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

          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <input
              id="date"
              type="date"
              className={inputClass}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="categoryId" className={labelClass}>
              Category
            </label>
            <select
              id="categoryId"
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
            <label htmlFor="notes" className={labelClass}>
              Notes <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="notes"
              className={inputClass}
              placeholder="Anything to remember"
              {...register('notes')}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSubmitting || !hasCategories}>
              {isSubmitting ? 'Adding…' : 'Add expense'}
            </Button>
          </div>
        </form>
        {actionError && (
          <p role="alert" className="mt-3 text-sm text-rose-600">
            {actionError}
          </p>
        )}
      </Card>

      {expensesQuery.loading ? (
        <div className="space-y-4">
          <SkeletonCard height="150px" />
          <SkeletonCard height="360px" />
        </div>
      ) : expensesQuery.error ? (
        <ErrorState
          message={expensesQuery.error}
          onRetry={() => void expensesQuery.refetch()}
        />
      ) : allExpenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          message="Add your first expense above to see it here."
        />
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="search" className={labelClass}>
                  Search
                </label>
                <input
                  id="search"
                  className={inputClass}
                  placeholder="Search by title"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="categoryFilter" className={labelClass}>
                  Category
                </label>
                <select
                  id="categoryFilter"
                  className={selectClass}
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sortBy" className={labelClass}>
                  Sort by
                </label>
                <select
                  id="sortBy"
                  className={selectClass}
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="amount-desc">Highest amount</option>
                  <option value="amount-asc">Lowest amount</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </Card>

          {filteredExpenses.length > 0 && (
            <div className="flex items-center justify-between px-1 text-sm">
              <span className="text-slate-500">
                {filteredExpenses.length}{' '}
                {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
              </span>
              <span className="font-semibold text-slate-900">
                {formatMoney(filteredTotal)} total
              </span>
            </div>
          )}

          {filteredExpenses.length === 0 ? (
            <EmptyState
              title="No matching expenses"
              message="Try a different search term or category."
            />
          ) : (
            <Card className="p-0">
              <ul className="divide-y divide-slate-100">
                {sortedExpenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {expense.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              expense.category?.color ?? '#94a3b8',
                          }}
                        />
                        {expense.category?.name ?? 'Uncategorized'} ·{' '}
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900">
                        {formatMoney(expense.amount)}
                      </span>
                      {pendingDeleteId === expense.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="danger"
                            disabled={deletingId === expense.id}
                            onClick={() => void confirmDelete(expense.id)}
                          >
                            {deletingId === expense.id ? 'Deleting…' : 'Confirm'}
                          </Button>
                          <Button
                            variant="ghost"
                            disabled={deletingId === expense.id}
                            onClick={() => setPendingDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={() => setPendingDeleteId(expense.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
