import { api } from '../lib/api';
import type { Category } from '../types';

export interface CategoryInput {
  name: string;
  color: string;
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data } = await api.post<Category>('/categories', input);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
