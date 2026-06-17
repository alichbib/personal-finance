import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { ErrorStateProps } from './ErrorState.types';

const DEFAULT_BODY =
  'Something went wrong while fetching this. Check your connection and try again.';

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-card border border-border bg-surface px-6 py-12 text-center shadow-card"
    >
      <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-danger-tint">
        <AlertTriangle size={25} strokeWidth={1.8} className="text-danger" aria-hidden="true" />
      </div>
      <div className="text-base font-semibold text-ink">
        Couldn't load your data
      </div>
      <div className="mt-1.5 max-w-[340px] text-[13.5px] leading-relaxed text-ink-faint">
        {message || DEFAULT_BODY}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-ink px-[18px] text-sm font-semibold text-white transition-colors hover:bg-ink-secondary focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/30"
        >
          <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
