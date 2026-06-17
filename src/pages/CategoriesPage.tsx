import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  listCategories,
} from '../api/categories';
import { listExpenses } from '../api/expenses';
import { useFetch } from '../hooks/useFetch';
import { getErrorMessage } from '../lib/error';
import { CATEGORY_PALETTE, DEFAULT_CATEGORY_COLOR } from '../lib/categoryColors';
import type { Category } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { IconButton } from '../components/ui/IconButton';
import { ConfirmModal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useToast } from '../components/ui/Toast';
import { labelClass } from '../components/ui/form';
import { PageBody, PageHeader } from '../components/layout/PageHeader';

interface CategoryForm {
  name: string;
}

export function CategoriesPage() {
  const { showToast } = useToast();
  const fetchCategories = useCallback(() => listCategories(), []);
  const fetchExpenses = useCallback(() => listExpenses(), []);
  const categoriesQuery = useFetch(fetchCategories);
  const expensesQuery = useFetch(fetchExpenses);

  const [formError, setFormError] = useState<string | null>(null);
  const [color, setColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({ defaultValues: { name: '' } });

  const orderedError = errors.name?.message ?? formError;

  async function onSubmit(values: CategoryForm) {
    setFormError(null);
    try {
      await createCategory({ name: values.name.trim(), color });
      reset({ name: '' });
      setColor(DEFAULT_CATEGORY_COLOR);
      await categoriesQuery.refetch();
      showToast('Category added');
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.id);
      await Promise.all([
        categoriesQuery.refetch(),
        expensesQuery.refetch(),
      ]);
      showToast('Category deleted');
      setPendingDelete(null);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const categories = categoriesQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];
  const countByCategory = expenses.reduce<Record<string, number>>(
    (counts, e) => {
      if (e.categoryId) counts[e.categoryId] = (counts[e.categoryId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const sorted = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );

  const loading = categoriesQuery.loading;
  const error = categoriesQuery.error;

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize spending into color-coded groups."
      />
      <PageBody>
        {loading ? (
          <>
            <SkeletonCard height="150px" />
            <div className="h-[18px]" />
            <SkeletonCard height="300px" />
          </>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => void categoriesQuery.refetch()}
          />
        ) : (
          <>
            {/* Add category */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mb-[18px] max-w-[560px] rounded-card border border-border bg-surface px-6 py-[22px] shadow-card"
            >
              <div className="mb-4 text-[15px] font-semibold text-ink">
                Add category
              </div>
              <div className="flex flex-wrap items-end gap-[13px]">
                <div className="min-w-[180px] flex-1">
                  <label htmlFor="name" className={labelClass}>
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Travel"
                    {...register('name', {
                      validate: (v) =>
                        v.trim().length > 0 || 'Enter a category name.',
                    })}
                  />
                </div>
                <Button type="submit" leadingPlus disabled={isSubmitting}>
                  Add category
                </Button>
              </div>
              <div className="mt-4">
                <span className="mb-2.5 block text-[12.5px] font-medium text-ink-muted">
                  Color
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORY_PALETTE.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      aria-label={`Select color ${swatch}`}
                      aria-pressed={color === swatch}
                      onClick={() => setColor(swatch)}
                      className="h-8 w-8 rounded-[9px] transition-shadow"
                      style={{
                        background: swatch,
                        boxShadow:
                          color === swatch
                            ? `0 0 0 2px #fff, 0 0 0 4px ${swatch}`
                            : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
              {orderedError && (
                <p role="alert" className="mt-3 text-[13px] text-danger">
                  {orderedError}
                </p>
              )}
            </form>

            {/* List */}
            <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
              <div className="border-b border-surface-muted px-[22px] py-4 text-sm font-semibold text-ink-secondary">
                {categories.length}{' '}
                {categories.length === 1 ? 'category' : 'categories'}
              </div>
              {sorted.length > 0 ? (
                <div>
                  {sorted.map((category) => {
                    const count = countByCategory[category.id] ?? 0;
                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-3.5 border-b border-border-faint px-[22px] py-3.5 transition-colors last:border-b-0 hover:bg-surface-hover"
                      >
                        <div
                          className="h-[38px] w-[38px] flex-shrink-0 rounded-[11px]"
                          style={{ background: category.color }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[14.5px] font-semibold text-ink">
                            {category.name}
                          </div>
                          <div className="mt-0.5 text-[12.5px] text-ink-faint">
                            {count} {count === 1 ? 'expense' : 'expenses'}
                          </div>
                        </div>
                        <IconButton
                          title="Delete"
                          aria-label={`Delete ${category.name}`}
                          size={34}
                          onClick={() => setPendingDelete(category)}
                        >
                          <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon="tag"
                  title="No categories yet"
                  message="Create a category above to start organizing expenses."
                />
              )}
            </div>
          </>
        )}
      </PageBody>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete category?"
        message={
          pendingDelete
            ? `This will remove “${pendingDelete.name}”. Expenses in it stay but become uncategorized.`
            : ''
        }
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
