import type { ReactNode } from 'react';

export type EmptyStateIcon = 'chart' | 'target' | 'list' | 'tag';

export interface EmptyStateProps {
  title: string;
  message: string;
  /** Folio glyph in the muted rounded square. Defaults to `list`. */
  icon?: EmptyStateIcon;
  action?: ReactNode;
}
