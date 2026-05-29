import { api } from '../lib/api';
import type { Expense } from '../types';

export interface ExpenseInput {
  title: string;
  amount: number;
  date: string;
  notes?: string | null;
  categoryId: string;
}

export interface ExpenseFilters {
  categoryId?: string;
  month?: string;
}

export async function listExpenses(
  filters: ExpenseFilters = {},
): Promise<Expense[]> {
  const { data } = await api.get<Expense[]>('/expenses', { params: filters });
  return data;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const { data } = await api.post<Expense>('/expenses', input);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
