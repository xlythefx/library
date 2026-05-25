import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiDelete } from "../api/client";

type Loan = {
  id: number;
  book_id: number;
  member_id: number;
  issued_by: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: 'active' | 'returned' | 'overdue';
};

type Paginated<T> = { data: T[]; meta: { current_page: number; last_page: number; total: number } };

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${map[status] ?? ''}`}>{status}</span>;
};

export function LoanList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Loan[]>([]);
  const [meta, setMeta] = useState<Paginated<Loan>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true); setError(null);
    try {
      const res = await apiGet<Paginated<Loan>>(`/loans?page=${p}`);
      setRows(res.data); setMeta(res.meta);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const remove = async (id: number) => {
    if (!confirm("Delete this loan?")) return;
    await apiDelete(`/loans/${id}`);
    load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Loans</h1>
        <Link to="/loans/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">
          <Plus className="w-4 h-4" /> New Loan
        </Link>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-slate-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-md bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Book ID</th>
                <th className="text-left px-4 py-3 font-medium">Member ID</th>
                <th className="text-left px-4 py-3 font-medium">Issue Date</th>
                <th className="text-left px-4 py-3 font-medium">Due Date</th>
                <th className="text-left px-4 py-3 font-medium">Return Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={8} className="text-center px-4 py-10 text-slate-500">No loans yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.id}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.book_id}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.member_id}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.issue_date}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.due_date}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.return_date ?? '—'}</td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/loans/${row.id}`)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(row.id)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Page {meta.current_page} of {meta.last_page} · {meta.total} total</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">Prev</button>
            <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page} className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
