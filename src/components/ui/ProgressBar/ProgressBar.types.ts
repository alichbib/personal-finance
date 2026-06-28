export interface ProgressBarProps {
  /** Fill percentage 0–100 (will be clamped). */
  value: number;
  /** Fill color (overridden to danger red when `over`). */
  color: string;
  /** When true, render the fill in danger red. */
  over?: boolean;
  /** Minimum visible fill width % when value > 0 (e.g. 3 for category bars). */
  minWidth?: number;
  /** Track height in px (default 9). */
  height?: number;
}
