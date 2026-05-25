import { NavLink } from 'react-router-dom';
import {
  BookCopy, Users, UserCheck, Tags, Building2,
  CalendarClock, CreditCard, Settings, ClipboardList,
} from 'lucide-react';

const adminLinks = [
  { label: 'Books', to: '/books', icon: BookCopy },
  { label: 'Authors', to: '/authors', icon: Users },
  { label: 'Publishers', to: '/publishers', icon: Building2 },
  { label: 'Categories', to: '/categories', icon: Tags },
  { label: 'Members', to: '/members', icon: UserCheck },
  { label: 'Loans', to: '/loans', icon: CalendarClock },
  { label: 'Reservations', to: '/reservations', icon: CalendarClock },
  { label: 'Fines', to: '/fines', icon: CreditCard },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Audit Logs', to: '/audit-logs', icon: ClipboardList },
];

export function Admin() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
        <p className="text-sm text-slate-500 mt-1">Manage all library resources</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {adminLinks.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                {label}
              </p>
              <p className="text-xs text-slate-500">Manage {label.toLowerCase()}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
