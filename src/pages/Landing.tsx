import { Link } from 'react-router-dom';
import { BookOpen, Users, CreditCard, BookMarked, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Book Catalogue', desc: 'Manage your entire collection with ISBN tracking, cover images, and availability counts.' },
  { icon: Users, title: 'Member Management', desc: 'Register members, track memberships, and manage suspensions with ease.' },
  { icon: BookMarked, title: 'Loans & Reservations', desc: 'Issue books, handle returns, and maintain a reservation queue automatically.' },
  { icon: CreditCard, title: 'Fines & Payments', desc: 'Auto-calculate overdue fines and track payment status per member.' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Nav */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-slate-900 dark:text-slate-100">LibraryMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-6">
          <CheckCircle className="w-3.5 h-3.5" />
          Library Management System
        </div>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6 max-md:text-3xl">
          Modern library management,<br />
          <span className="text-emerald-600">simplified.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Everything a librarian needs — books, members, loans, reservations, and fines — all in one clean interface.
        </p>
        <div className="flex items-center justify-center gap-4 max-sm:flex-col">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Sign in to your library
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Create an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} LibraryMS. All rights reserved.
      </footer>
    </div>
  );
}
