import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { navItems } from './navItems';

/** Top bar shown below the 860px breakpoint. */
export function MobileTopBar() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <header className="sticky top-0 z-20 flex h-[58px] items-center justify-between border-b border-border bg-surface px-[18px] folio:hidden">
      <Logo size="sm" />
      <button
        type="button"
        onClick={clearSession}
        className="flex items-center gap-1.5 rounded-[9px] border border-border-strong bg-surface px-[11px] py-[7px] text-[13px] font-medium text-ink-muted transition-colors hover:bg-app"
      >
        <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
        Sign out
      </button>
    </header>
  );
}

/** Fixed bottom tab nav shown below the 860px breakpoint. */
export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-[62px] border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] folio:hidden">
      {navItems.map(({ to, mobileLabel, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-[3px] text-[10.5px] font-semibold transition-colors ${
              isActive ? 'text-primary' : 'text-ink-faint'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
          {mobileLabel}
        </NavLink>
      ))}
    </nav>
  );
}
