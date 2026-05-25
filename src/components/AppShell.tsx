import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen, Users, UserCheck, Tags, Building2, BookCopy,
  CreditCard, CalendarClock, Settings, ClipboardList,
  LogOut, Moon, Sun, Menu, X,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: BookOpen },
  { label: 'Books', to: '/books', icon: BookCopy },
  { label: 'Members', to: '/members', icon: UserCheck },
  { label: 'Loans', to: '/loans', icon: CalendarClock },
  { label: 'Reservations', to: '/reservations', icon: CalendarClock },
  { label: 'Fines', to: '/fines', icon: CreditCard },
  { label: 'Authors', to: '/authors', icon: Users },
  { label: 'Publishers', to: '/publishers', icon: Building2 },
  { label: 'Categories', to: '/categories', icon: Tags },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Audit Logs', to: '/audit-logs', icon: ClipboardList },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? saved === 'true' : true; // default dark
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', String(dark));
  }, [dark]);

  return [dark, setDark] as const;
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <BookOpen className="w-6 h-6 text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">LibraryMS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setSidebarOpen(false)}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{user?.role?.replace('_', ' ')}</p>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 rounded text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:pl-60 min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded text-slate-500 hover:text-slate-700">
            <Menu className="w-5 h-5" />
          </button>
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">LibraryMS</span>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
