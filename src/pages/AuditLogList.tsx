import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { apiGet } from "../api/client";

type AuditLog = { id: number; user_id: number | null; action: string; model_type: string; model_id: number; ip_address: string | null; created_at: string };
type Paginated<T> = { data: T[]; meta: { current_page: number; last_page: number; total: number } };

export function AuditLogList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<Paginated<AuditLog>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (p: number) => {
    setLoading(true); setError(null);
    try { const res = await apiGet<Paginated<AuditLog>>(`/audit-logs?page=${p}`); setRows(res.data); setMeta(res.meta); }
    catch (e) { setError(String(e)); } finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const actionBadge = (action: string) => {
    const map: Record<string, string> = {
      created: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
      updated: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
      deleted: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    };
    const cls = map[action.toLowerCase()] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{action}</span>;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Audit Logs</h1>
        <span className="text-xs text-slate-500">Read-only — system-generated</span>
      </div>
      {loading && <div className="flex items-center gap-2 text-sm text-slate-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-md bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}
      {!loading && !error && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Action</th>
                <th className="text-left px-4 py-3 font-medium">Model</th>
                <th className="text-left px-4 py-3 font-medium">Model ID</th>
                <th className="text-left px-4 py-3 font-medium">User ID</th>
                <th className="text-left px-4 py-3 font-medium">IP</th>
                <th className="text-left px-4 py-3 font-medium">At</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="text-center px-4 py-10 text-slate-500">No audit logs yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">{actionBadge(row.action)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">{row.model_type?.split('\\').pop()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.model_id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.user_id ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.ip_address ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(row.created_at).toLocaleString()}</td>
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
