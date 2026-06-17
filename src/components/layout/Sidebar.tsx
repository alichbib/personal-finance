import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { firstNameFromEmail } from '../../lib/format';
import { Logo } from '../ui/Logo';
import { navItems } from './navItems';

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const firstName = firstNameFromEmail(user?.email);
  const initials = `${(firstName[0] ?? 'A').toUpperCase()}M`;

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] flex-shrink-0 flex-col border-r border-border bg-surface folio:flex">
      <div className="px-5 pb-[18px] pt-[22px]">
        <Logo size="md" />
      </div>

      <nav className="flex flex-col gap-[3px] px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/[.18] ${
                isActive
                  ? 'bg-primary-tint font-semibold text-primary-text'
                  : 'font-medium text-ink-muted hover:bg-app'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className={isActive ? 'text-primary' : 'text-ink-faint'}
                  aria-hidden="true"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-surface-muted px-3 py-3.5">
        <div className="flex items-center gap-[11px] rounded-md px-2.5 py-2">
          <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-primary-tint text-[13px] font-semibold text-primary-text">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold leading-tight text-ink">
              {firstName} Morgan
            </div>
            <div className="truncate text-xs text-ink-faint">{user?.email}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={clearSession}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-md bg-transparent px-3 py-2.5 text-[13px] font-medium text-ink-subtle transition-colors hover:bg-app hover:text-ink focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/[.18]"
        >
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
