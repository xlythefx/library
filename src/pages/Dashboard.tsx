import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCopy, Users, CalendarClock, CreditCard, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { apiGet } from '../api/client';
import { useAuth } from '../auth/useAuth';

interface Stats {
  books?: number;
  members?: number;
  active_loans?: number;
  unpaid_fines?: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      apiGet<{ meta: { total: number } }>('/books?page=1&per_page=1'),
      apiGet<{ meta: { total: number } }>('/members?page=1&per_page=1'),
      apiGet<{ meta: { total: number } }>('/loans?page=1&per_page=1&status=active'),
      apiGet<{ meta: { total: number } }>('/fines?page=1&per_page=1&is_paid=false'),
    ]).then(([books, members, loans, fines]) => {
      setStats({
        books: books.status === 'fulfilled' ? books.value.meta?.total : undefined,
        members: members.status === 'fulfilled' ? members.value.meta?.total : undefined,
        active_loans: loans.status === 'fulfilled' ? loans.value.meta?.total : undefined,
        unpaid_fines: fines.status === 'fulfilled' ? fines.value.meta?.total : undefined,
      });
      setLoading(false);
    }).catch(() => {
      setError('Could not load stats');
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Books', value: stats.books, icon: BookCopy, to: '/books', color: 'text-emerald-600' },
    { label: 'Members', value: stats.members, icon: Users, to: '/members', color: 'text-blue-600' },
    { label: 'Active Loans', value: stats.active_loans, icon: CalendarClock, to: '/loans', color: 'text-amber-600' },
    { label: 'Unpaid Fines', value: stats.unpaid_fines, icon: CreditCard, to: '/fines', color: 'text-red-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 p-4 rounded-md bg-red-50 dark:bg-red-950/30">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
            </div>
            <div>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {value !== undefined ? value.toLocaleString() : '—'}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          <Link
            to="/loans/new"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
          >
            <CalendarClock className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Issue a Loan</span>
          </Link>
          <Link
            to="/members/new"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
          >
            <Users className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Register Member</span>
          </Link>
          <Link
            to="/books/new"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
          >
            <BookCopy className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Book</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
