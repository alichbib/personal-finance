export interface ErrorStateProps {
  /** Body line; the fixed "Couldn't load your data" title sits above it. */
  message?: string;
  onRetry?: () => void;
}
