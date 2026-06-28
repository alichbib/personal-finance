import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileBottomNav, MobileTopBar } from './MobileNav';

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-[62px] folio:pb-0">
        <MobileTopBar />
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}
