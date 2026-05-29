import { api } from '../lib/api';
import type { Budget } from '../types';

export interface BudgetInput {
  month: string;
  amount: number;
  categoryId: string;
}

export async function listBudgets(month?: string): Promise<Budget[]> {
  const { data } = await api.get<Budget[]>('/budgets', {
    params: month ? { month } : {},
  });
  
  return data;
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const { data } = await api.post<Budget>('/budgets', input);
  return data;
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/budgets/${id}`);
}
