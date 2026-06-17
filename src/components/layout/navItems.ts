import { LayoutGrid, List, PieChart, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  /** Sidebar label. */
  label: string;
  /** Shorter label used in the mobile bottom tab bar. */
  mobileLabel: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', mobileLabel: 'Home', icon: LayoutGrid },
  { to: '/expenses', label: 'Expenses', mobileLabel: 'Expenses', icon: List },
  { to: '/budgets', label: 'Budgets', mobileLabel: 'Budgets', icon: PieChart },
  { to: '/categories', label: 'Categories', mobileLabel: 'Categories', icon: Tag },
];
