import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiDelete } from "../api/client";

type Author = { id: number; first_name: string; last_name: string; bio: string | null };
type Paginated<T> = { data: T[]; meta: { current_page: number; last_page: number; total: number } };

export function AuthorList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Author[]>([]);
  const [meta, setMeta] = useState<Paginated<Author>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true); setError(null);
    try { const res = await apiGet<Paginated<Author>>(`/authors?page=${p}`); setRows(res.data); setMeta(res.meta); }
    catch (e) { setError(String(e)); } finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const remove = async (id: number) => {
    if (!confirm("Delete this author?")) return;
    await apiDelete(`/authors/${id}`); load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Authors</h1>
        <Link to="/authors/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"><Plus className="w-4 h-4" /> New Author</Link>
      </div>
      {loading && <div className="flex items-center gap-2 text-sm text-slate-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-md bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}
      {!loading && !error && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">First Name</th>
                <th className="text-left px-4 py-3 font-medium">Last Name</th>
                <th className="text-left px-4 py-3 font-medium">Bio</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={4} className="text-center px-4 py-10 text-slate-500">No authors yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{row.first_name}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{row.last_name}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{row.bio ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/authors/${row.id}`)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
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
