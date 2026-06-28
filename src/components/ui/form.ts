// Shared Folio form-control class recipes.
// Inputs: 42px tall, 1px border-strong, 10px radius, 14px text, emerald focus ring.

const fieldBase =
  'w-full h-[42px] px-3 rounded-md bg-surface border border-border-strong text-sm text-ink outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-[3px] focus:ring-primary/[.12] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-faint';

export const inputClass = `${fieldBase} placeholder:text-ink-faint`;

// Mono amount inputs (currency / numeric).
export const moneyInputClass = `${inputClass} font-mono tabular-nums`;

// Selects strip the native chevron (appearance-none) to match the design.
export const selectClass = `${fieldBase} appearance-none cursor-pointer`;

export const labelClass =
  'mb-1.5 block text-[12.5px] font-medium text-ink-muted';

export const fieldErrorClass = 'mt-1.5 text-[13px] text-danger';
