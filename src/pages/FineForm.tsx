import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../api/client";

type Loan = { id: number; issue_date: string; due_date: string };
type Member = { id: number; full_name: string };

interface FineFormData { loan_id: string; member_id: string; amount: string; reason: string; is_paid: boolean; paid_at: string; }
const EMPTY: FineFormData = { loan_id: "", member_id: "", amount: "", reason: "overdue", is_paid: false, paid_at: "" };

export function FineForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<FineFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    apiGet<{ data: Loan[] }>('/loans?per_page=200').then(r => setLoans(r.data)).catch(() => {});
    apiGet<{ data: Member[] }>('/members?per_page=200').then(r => setMembers(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: FineFormData }>(`/fines/${id}`)
      .then((res) => setForm({
        loan_id: String(res.data.loan_id ?? ""),
        member_id: String(res.data.member_id ?? ""),
        amount: String(res.data.amount ?? ""),
        reason: res.data.reason ?? "overdue",
        is_paid: Boolean(res.data.is_paid),
        paid_at: res.data.paid_at ?? "",
      }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof FineFormData>(key: K, value: FineFormData[K]) => setForm((f) => ({ ...f, [key]: value }));
  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setErrors({});
    try {
      const payload = { ...form, loan_id: Number(form.loan_id), member_id: Number(form.member_id), amount: Number(form.amount), paid_at: form.paid_at || null };
      if (isEdit) await apiPut(`/fines/${id}`, payload);
      else await apiPost(`/fines`, payload);
      nav(`/fines`);
    } catch (e: any) {
      if (e?.status === 422 && e?.body?.errors) setErrors(e.body.errors);
      else setErrors({ _form: [String(e?.message ?? e)] });
    } finally { setSaving(false); }
  };

  const inputCls = "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  if (loading) return <div className="p-6 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;
  if (loadError) return <div className="p-6 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {loadError}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <button type="button" onClick={() => nav(`/fines`)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"><ArrowLeft className="w-4 h-4" /> Back to Fines</button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit" : "New"} Fine</h1>
      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-md bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loan <span className="text-red-500">*</span></label>
          <select required value={form.loan_id} onChange={(e) => set("loan_id", e.target.value)} className={inputCls}>
            <option value="">— Select Loan —</option>
            {loans.map(l => <option key={l.id} value={l.id}>Loan #{l.id} (due: {l.due_date})</option>)}
          </select>
          {fieldError("loan_id") && <p className="text-xs text-red-600 mt-1">{fieldError("loan_id")}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Member <span className="text-red-500">*</span></label>
          <select required value={form.member_id} onChange={(e) => set("member_id", e.target.value)} className={inputCls}>
            <option value="">— Select Member —</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
          {fieldError("member_id") && <p className="text-xs text-red-600 mt-1">{fieldError("member_id")}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($) <span className="text-red-500">*</span></label>
            <input type="number" required min={0} step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} className={inputCls} placeholder="0.00" />
            {fieldError("amount") && <p className="text-xs text-red-600 mt-1">{fieldError("amount")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason <span className="text-red-500">*</span></label>
            <input required value={form.reason} onChange={(e) => set("reason", e.target.value)} className={inputCls} />
            {fieldError("reason") && <p className="text-xs text-red-600 mt-1">{fieldError("reason")}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_paid" checked={form.is_paid} onChange={(e) => set("is_paid", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-emerald-600" />
          <label htmlFor="is_paid" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Paid</label>
        </div>
        {form.is_paid && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paid At</label>
            <input type="datetime-local" value={form.paid_at} onChange={(e) => set("paid_at", e.target.value)} className={inputCls} />
            {fieldError("paid_at") && <p className="text-xs text-red-600 mt-1">{fieldError("paid_at")}</p>}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium">
            <Save className="w-4 h-4" />{saving ? "Saving…" : isEdit ? "Save changes" : "Create Fine"}
          </button>
          <button type="button" onClick={() => nav(`/fines`)} className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
