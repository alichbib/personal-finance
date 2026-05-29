import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}
