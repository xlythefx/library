import { Link } from 'react-router-dom';
import {
  BookOpen, ArrowRight, CheckCircle,
  Library, BarChart3, Bell, Shield, Clock, Star, ChevronRight, Sparkles,
  BookCopy, UserCheck, CalendarDays, DollarSign,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── tiny hook: fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const features = [
  {
    icon: BookCopy,
    title: 'Book Catalogue',
    desc: 'Manage your entire collection with ISBN tracking, cover images, and real-time availability counts.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  {
    icon: UserCheck,
    title: 'Member Management',
    desc: 'Register members, track membership expiry, and manage suspensions with a single click.',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-800/50',
  },
  {
    icon: CalendarDays,
    title: 'Loans & Reservations',
    desc: 'Issue books, handle returns, and maintain an automatic reservation queue — no spreadsheets needed.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800/50',
  },
  {
    icon: DollarSign,
    title: 'Fines & Payments',
    desc: 'Auto-calculate overdue fines at your configured daily rate and track payment status per member.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/50',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    desc: 'Overdue loan lists, most-borrowed books, monthly volume charts, and unpaid fines at a glance.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800/50',
  },
  {
    icon: Shield,
    title: 'Audit Logging',
    desc: 'Every create, update, and delete action is logged with user, timestamp, and before/after values.',
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-100 dark:bg-slate-800/30',
    border: 'border-slate-200 dark:border-slate-700/50',
  },
];

const stats = [
  { value: '10+', label: 'Resource types', icon: Library },
  { value: '∞', label: 'Books trackable', icon: BookOpen },
  { value: '100%', label: 'Audit coverage', icon: CheckCircle },
  { value: '24/7', label: 'Availability', icon: Clock },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Head Librarian', text: 'Finally a system that doesn\'t feel like it was built in 2003. Clean, fast, and everything in one place.', stars: 5 },
  { name: 'Marcus L.', role: 'Library Manager', text: 'The fine calculation and overdue reminders alone saved us hours every week.', stars: 5 },
  { name: 'Priya N.', role: 'Senior Librarian', text: 'Dark mode, responsive design, and a sidebar that actually makes sense. Highly recommend.', stars: 5 },
];

function FeatureCard({ icon: Icon, title, desc, color, bg, border, delay }: {
  icon: React.ElementType; title: string; desc: string;
  color: string; bg: string; border: string; delay: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative rounded-2xl border ${border} ${bg} p-6 shadow-sm hover:shadow-md transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-base">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${color} rounded-b-2xl transition-all duration-500`} />
    </div>
  );
}

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const statsSection = useFadeIn();
  const ctaSection = useFadeIn();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <BookOpen className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">LibraryMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Features</a>
            <a href="#stats" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Overview</a>
            <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium shadow-sm hover:shadow-emerald-500/25 hover:shadow-md transition-all duration-200">
              Get started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" ref={heroRef}>
        {/* gradient orbs */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Full-featured library management
          </div>

          {/* heading */}
          <h1 className="text-6xl font-extrabold leading-tight mb-6 max-md:text-4xl max-sm:text-3xl tracking-tight">
            <span className="bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Modern library<br />management,
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              simplified.
            </span>
          </h1>

          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything a librarian needs — books, members, loans, reservations, and fines — all in one{' '}
            <span className="text-slate-700 dark:text-slate-300 font-medium">clean, fast interface</span>.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 max-sm:flex-col mb-14">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign in to your library
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              Create free account
            </Link>
          </div>

          {/* floating mock UI card */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl" />
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200 dark:shadow-slate-950 overflow-hidden">
              {/* fake toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-slate-400 dark:text-slate-500">LibraryMS — Books</span>
              </div>
              {/* fake table rows */}
              <div className="p-4 space-y-2.5">
                {['The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Brave New World', 'The Catcher in the Rye'].map((title, i) => (
                  <div key={title} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 text-left">{title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 2 ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'}`}>
                      {i === 2 ? 'Checked out' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* glow beneath */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-emerald-500/20 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-14">
        <div
          ref={statsSection.ref}
          className={`max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8 max-md:grid-cols-2 transition-all duration-700 ${statsSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 mb-3">
                <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-1">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Everything you need
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 max-md:text-2xl">
            A complete toolkit for librarians
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Every workflow from cataloguing to overdue fines is covered. No plugins, no add-ons.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Trusted by librarians</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">What staff are saying</p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            {testimonials.map(({ name, role, text, stars }, i) => (
              <div
                key={name}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div
          ref={ctaSection.ref}
          className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${ctaSection.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          {/* decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

          <div className="relative px-12 py-16 text-center max-sm:px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-medium mb-6">
              <Bell className="w-3 h-3" />
              Get started today — it's free
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4 max-md:text-2xl">
              Ready to modernise your library?
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto mb-8 text-lg">
              Join librarians who've replaced messy spreadsheets with a proper management system.
            </p>
            <div className="flex items-center justify-center gap-4 max-sm:flex-col">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Create your account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">LibraryMS</span>
          </div>
          <span>© {new Date().getFullYear()} LibraryMS. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
