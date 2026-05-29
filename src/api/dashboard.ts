import { api } from '../lib/api';
import type { DashboardSummary } from '../types';

export async function getDashboardSummary(
  month?: string,
): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/dashboard/summary', {
    params: month ? { month } : {},
  });
  return data;
}
