import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
        <footer className="px-4 py-6 text-center text-xs text-slate-400 sm:px-6 lg:px-10">
          © {year} Personal Finance
        </footer>
      </main>
    </div>
  );
}
