// Folio category color-picker swatches (README §Color — Category palette).
export const CATEGORY_PALETTE = [
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#06B6D4',
  '#F43F5E',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#6366F1',
] as const;

export const DEFAULT_CATEGORY_COLOR = CATEGORY_PALETTE[0];

/** Fallback color for uncategorized / missing-category items. */
export const UNCATEGORIZED_COLOR = '#A1A1AA';
