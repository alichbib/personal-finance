import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  /** Optional right-aligned content (e.g. month selector). */
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="px-[18px] pb-1 pt-5 folio:px-8 folio:pb-2 folio:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-ink">
            {title}
          </h1>
          <p className="mt-[5px] text-sm text-ink-subtle">{subtitle}</p>
        </div>
        {actions}
      </div>
    </div>
  );
}

/** Screen body wrapper with the Folio content padding. */
export function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="px-[18px] pb-7 pt-3.5 folio:px-8 folio:pb-9 folio:pt-[18px]">
      {children}
    </div>
  );
}
