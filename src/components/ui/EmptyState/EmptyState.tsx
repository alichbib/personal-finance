import { BarChart3, List, Tag, Target } from 'lucide-react';
import type { EmptyStateIcon, EmptyStateProps } from './EmptyState.types';

const iconMap: Record<EmptyStateIcon, typeof List> = {
  chart: BarChart3,
  target: Target,
  list: List,
  tag: Tag,
};

export function EmptyState({
  title,
  message,
  icon = 'list',
  action,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center px-[18px] py-[30px] text-center">
      <div className="mb-[15px] flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-surface-muted">
        <Icon size={23} strokeWidth={1.8} className="text-ink-faint" aria-hidden="true" />
      </div>
      <div className="text-[15px] font-semibold text-ink-secondary">{title}</div>
      <div className="mt-1.5 max-w-[300px] text-[13.5px] leading-relaxed text-ink-faint">
        {message}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
