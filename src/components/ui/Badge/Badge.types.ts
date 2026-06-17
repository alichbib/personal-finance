import type { ReactNode } from 'react';

export type BadgeTone = 'muted' | 'danger' | 'warning' | 'success';

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}
