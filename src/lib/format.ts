export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1, 1));
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export function currentMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

export function shiftMonth(month: string, monthsToAdd: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, monthNumber - 1 + monthsToAdd, 1));
  const paddedMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  return `${shifted.getUTCFullYear()}-${paddedMonth}`;
}

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Short month + year, e.g. "Jun 2026" — used for budget month chips. */
export function formatMonthShort(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return `${SHORT_MONTHS[monthNumber - 1]} ${year}`;
}

/** Today's date as YYYY-MM-DD (local), for date-input defaults. */
export function todayIso(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/** Time-of-day greeting by local hour. */
export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** First name derived from an email local-part, capitalized. */
export function firstNameFromEmail(email: string | undefined): string {
  if (!email) return 'there';
  const local = email.split('@')[0]?.split('.')[0] ?? '';
  if (!local) return 'there';
  return local.charAt(0).toUpperCase() + local.slice(1);
}
