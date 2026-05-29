export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes: string | null;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  month: string;
  amount: number;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface BudgetUsageItem {
  categoryId: string;
  name: string;
  color: string;
  month: string;
  budget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export interface DashboardSummary {
  month: string;
  totalExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: CategoryBreakdownItem[];
  budgetUsage: BudgetUsageItem[];
}
