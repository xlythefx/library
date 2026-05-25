import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, UserPlus, BookOpen } from "lucide-react";
import { useAuth } from "../auth/useAuth";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const { user } = await register(name, email, password);
      nav(user?.role === "super_admin" || user?.role === "librarian" ? "/dashboard" : "/dashboard", { replace: true });
    } catch (e: any) {
      if (e?.status === 422 && e?.body?.errors) {
        setErrors(e.body.errors);
      } else {
        setErrors({ _form: [e?.body?.message || e?.message || "Registration failed"] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-7 h-7 text-emerald-600" />
          <span className="font-bold text-xl text-slate-900 dark:text-slate-100">LibraryMS</span>
        </div>
        <form
          onSubmit={submit}
          className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
        >
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Join the library management system.</p>
          </div>

          {errors._form && (
            <div className="text-sm text-red-600 dark:text-red-400 p-2.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              {errors._form[0]}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Full name"
            />
            {fieldError("name") && <p className="text-xs text-red-600 mt-1">{fieldError("name")}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="you@example.com"
            />
            {fieldError("email") && <p className="text-xs text-red-600 mt-1">{fieldError("email")}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Min 8 characters"
            />
            {fieldError("password") && <p className="text-xs text-red-600 mt-1">{fieldError("password")}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {submitting ? "Creating…" : "Create account"}
          </button>

          <div className="text-sm text-slate-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
