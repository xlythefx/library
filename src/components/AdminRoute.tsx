import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (!user || (user.role !== 'super_admin' && user.role !== 'librarian')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
