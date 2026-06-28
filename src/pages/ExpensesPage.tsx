import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Trash2 } from 'lucide-react';
import { createExpense, deleteExpense, listExpenses } from '../api/expenses';
import { listCategories } from '../api/categories';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { formatDate, formatMoney, todayIso } from '../lib/format';
import { UNCATEGORIZED_COLOR } from '../lib/categoryColors';
import type { Expense } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ColorDot } from '../components/ui/ColorDot';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmModal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useToast } from '../components/ui/Toast';
import { labelClass } from '../components/ui/form';
import { PageBody, PageHeader } from '../components/layout/PageHeader';

interface ExpenseForm {
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  notes: string;
}

type SortMode = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export function ExpensesPage() {
  const { showToast } = useToast();
  const fetchExpenses = useCallback(() => listExpenses(), []);
  const fetchCategories = useCallback(() => listCategories(), []);
  const expensesQuery = useFetch(fetchExpenses);
  const categoriesQuery = useFetch(fetchCategories);

  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState<SortMode>('date-desc');

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
      amount: undefined,
      date: todayIso(),
      categoryId: '',
      notes: '',
    },
  });

  // Single ordered validation message (title → amount → category).
  const orderedError =
    errors.title?.message ??
    errors.amount?.message ??
    errors.categoryId?.message ??
    formError;

  async function onSubmit(values: ExpenseForm) {
    setFormError(null);
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
        amount: undefined,
        date: todayIso(),
        categoryId: '',
        notes: '',
      });
      await expensesQuery.refetch();
      showToast('Expense added');
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteExpense(pendingDelete.id);
      await expensesQuery.refetch();
      showToast('Expense deleted');
      setPendingDelete(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const allExpenses = expensesQuery.data ?? [];
  const normalizedSearch = search.trim().toLowerCase();
  const filtersActive =
    normalizedSearch !== '' || categoryFilter !== 'all' || sort !== 'date-desc';

  function clearFilters() {
    setSearch('');
    setCategoryFilter('all');
    setSort('date-desc');
  }

  const filtered = allExpenses.filter((e) => {
    const matchesSearch =
      normalizedSearch === '' ||
      e.title.toLowerCase().includes(normalizedSearch) ||
      (e.notes ?? '').toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      categoryFilter === 'all' || e.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0);
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
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

  const loading = expensesQuery.loading || categoriesQuery.loading;
  const error = expensesQuery.error;

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Track and search everything you've spent."
      />
      <PageBody>
        {loading ? (
          <>
            <SkeletonCard height="150px" />
            <div className="h-[18px]" />
            <SkeletonCard height="360px" />
          </>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => void expensesQuery.refetch()}
          />
        ) : (
          <>
            {/* Add expense */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mb-[18px] rounded-card border border-border bg-surface px-6 py-[22px] shadow-card"
            >
              <div className="mb-4 text-[15px] font-semibold text-ink">
                Add expense
              </div>
              {!hasCategories && (
                <p className="mb-4 rounded-md bg-warning-bg px-3.5 py-2.5 text-[13px] text-warning-text">
                  Add a category first to start recording expenses.
                </p>
              )}
              <div className="mb-[13px] grid grid-cols-1 gap-[13px] folio:grid-cols-[1.7fr_1fr_1.1fr_1.3fr]">
                <div>
                  <label htmlFor="title" className={labelClass}>
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g. Groceries"
                    {...register('title', {
                      validate: (v) =>
                        v.trim().length > 0 || 'Please enter a title.',
                    })}
                  />
                </div>
                <div>
                  <label htmlFor="amount" className={labelClass}>
                    Amount
                  </label>
                  <Input
                    id="amount"
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
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Date
                  </label>
                  <Input id="date" type="date" {...register('date')} />
                </div>
                <div>
                  <label htmlFor="categoryId" className={labelClass}>
                    Category
                  </label>
                  <Select
                    id="categoryId"
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
              </div>
              <div className="flex flex-wrap items-end gap-[13px]">
                <div className="min-w-[200px] flex-1">
                  <label htmlFor="notes" className={labelClass}>
                    Notes{' '}
                    <span className="font-normal text-ink-faint">
                      (optional)
                    </span>
                  </label>
                  <Input
                    id="notes"
                    placeholder="Add a note"
                    {...register('notes')}
                  />
                </div>
                <Button
                  type="submit"
                  leadingPlus
                  disabled={isSubmitting || !hasCategories}
                >
                  Add expense
                </Button>
              </div>
              {orderedError && (
                <p role="alert" className="mt-3 text-[13px] text-danger">
                  {orderedError}
                </p>
              )}
            </form>

            {/* List */}
            <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3.5 border-b border-surface-muted px-[22px] py-[18px]">
                <div className="text-sm font-semibold text-ink-secondary">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'expense' : 'expenses'} ·{' '}
                  {formatMoney(filteredTotal)}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative flex items-center">
                    <Search
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[11px] text-ink-faint"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                      aria-label="Search expenses"
                      className="h-[38px] w-[180px] rounded-[9px] border border-border-strong bg-surface pl-8 pr-3 text-[13.5px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-primary focus:ring-[3px] focus:ring-primary/[.12]"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by category"
                    className="h-[38px] cursor-pointer appearance-none rounded-[9px] border border-border-strong bg-surface px-2.5 text-[13.5px] text-ink-secondary outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/[.12]"
                  >
                    <option value="all">All categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortMode)}
                    aria-label="Sort expenses"
                    className="h-[38px] cursor-pointer appearance-none rounded-[9px] border border-border-strong bg-surface px-2.5 text-[13.5px] text-ink-secondary outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/[.12]"
                  >
                    <option value="date-desc">Newest first</option>
                    <option value="date-asc">Oldest first</option>
                    <option value="amount-desc">Amount: high to low</option>
                    <option value="amount-asc">Amount: low to high</option>
                  </select>
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-[38px] rounded-[9px] px-3 text-[13px] font-medium text-primary transition-colors hover:bg-primary-tint"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {sorted.length > 0 ? (
                <div>
                  {sorted.map((expense) => {
                    const color = expense.category?.color ?? UNCATEGORIZED_COLOR;
                    const catName = expense.category?.name ?? 'Uncategorized';
                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-3.5 border-b border-border-faint px-[22px] py-3.5 transition-colors last:border-b-0 hover:bg-surface-hover"
                      >
                        <ColorDot color={color} size={9} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-ink">
                            {expense.title}
                          </div>
                          <div className="mt-0.5 text-[12.5px] text-ink-faint">
                            {catName}
                            {expense.notes ? ` · ${expense.notes}` : ''}
                          </div>
                        </div>
                        <div className="min-w-[64px] whitespace-nowrap text-right text-[13px] text-ink-faint">
                          {formatDate(expense.date)}
                        </div>
                        <div className="min-w-[96px] text-right font-mono text-sm font-semibold tnum">
                          {formatMoney(expense.amount)}
                        </div>
                        <IconButton
                          title="Delete"
                          aria-label={`Delete ${expense.title}`}
                          onClick={() => setPendingDelete(expense)}
                        >
                          <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>
              ) : filtersActive ? (
                <div className="px-0 pb-4 pt-2">
                  <EmptyState
                    icon="list"
                    title="No matching expenses"
                    message="Try a different search or clear your filters."
                  />
                  <div className="text-center">
                    <Button variant="secondary" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="list"
                  title="No expenses yet"
                  message="Add your first expense using the form above."
                />
              )}
            </div>
          </>
        )}
      </PageBody>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete expense?"
        message={
          pendingDelete
            ? `This will permanently remove “${pendingDelete.title}” from your expenses.`
            : ''
        }
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
