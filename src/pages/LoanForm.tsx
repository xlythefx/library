import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../api/client";

type Book = { id: number; title: string };
type Member = { id: number; full_name: string };
type User = { id: number; name: string };

interface LoanFormData {
  book_id: string;
  member_id: string;
  issued_by: string;
  issue_date: string;
  due_date: string;
  return_date: string;
  status: string;
}

const EMPTY: LoanFormData = {
  book_id: "",
  member_id: "",
  issued_by: "",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
  return_date: "",
  status: "active",
};

export function LoanForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<LoanFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiGet<{ data: Book[] }>('/books?per_page=200').then(r => setBooks(r.data)).catch(() => {});
    apiGet<{ data: Member[] }>('/members?per_page=200').then(r => setMembers(r.data)).catch(() => {});
    apiGet<{ data: User[] }>('/users?per_page=200').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: LoanFormData }>(`/loans/${id}`)
      .then((res) => setForm({
        book_id: String(res.data.book_id ?? ""),
        member_id: String(res.data.member_id ?? ""),
        issued_by: String(res.data.issued_by ?? ""),
        issue_date: res.data.issue_date ?? "",
        due_date: res.data.due_date ?? "",
        return_date: res.data.return_date ?? "",
        status: res.data.status ?? "active",
      }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof LoanFormData>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        book_id: Number(form.book_id),
        member_id: Number(form.member_id),
        issued_by: Number(form.issued_by),
        return_date: form.return_date || null,
      };
      if (isEdit) await apiPut(`/loans/${id}`, payload);
      else await apiPost(`/loans`, payload);
      nav(`/loans`);
    } catch (e: any) {
      if (e?.status === 422 && e?.body?.errors) setErrors(e.body.errors);
      else setErrors({ _form: [String(e?.message ?? e)] });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  if (loading) return <div className="p-6 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;
  if (loadError) return <div className="p-6 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {loadError}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <button type="button" onClick={() => nav(`/loans`)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
        <ArrowLeft className="w-4 h-4" /> Back to Loans
      </button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit" : "New"} Loan</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-md bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Book <span className="text-red-500">*</span></label>
          <select required value={form.book_id} onChange={(e) => set("book_id", e.target.value)} className={inputCls}>
            <option value="">— Select Book —</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
          {fieldError("book_id") && <p className="text-xs text-red-600 mt-1">{fieldError("book_id")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Member <span className="text-red-500">*</span></label>
          <select required value={form.member_id} onChange={(e) => set("member_id", e.target.value)} className={inputCls}>
            <option value="">— Select Member —</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
          {fieldError("member_id") && <p className="text-xs text-red-600 mt-1">{fieldError("member_id")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issued By <span className="text-red-500">*</span></label>
          <select required value={form.issued_by} onChange={(e) => set("issued_by", e.target.value)} className={inputCls}>
            <option value="">— Select User —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {fieldError("issued_by") && <p className="text-xs text-red-600 mt-1">{fieldError("issued_by")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Date <span className="text-red-500">*</span></label>
            <input type="date" required value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)} className={inputCls} />
            {fieldError("issue_date") && <p className="text-xs text-red-600 mt-1">{fieldError("issue_date")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date <span className="text-red-500">*</span></label>
            <input type="date" required value={form.due_date} onChange={(e) => set("due_date", e.target.value)} className={inputCls} />
            {fieldError("due_date") && <p className="text-xs text-red-600 mt-1">{fieldError("due_date")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Return Date</label>
            <input type="date" value={form.return_date} onChange={(e) => set("return_date", e.target.value)} className={inputCls} />
            {fieldError("return_date") && <p className="text-xs text-red-600 mt-1">{fieldError("return_date")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status <span className="text-red-500">*</span></label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
            {fieldError("status") && <p className="text-xs text-red-600 mt-1">{fieldError("status")}</p>}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium">
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create Loan"}
          </button>
          <button type="button" onClick={() => nav(`/loans`)} className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
