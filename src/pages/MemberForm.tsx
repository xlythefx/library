import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../api/client";

interface MemberFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  membership_number: string;
  membership_expiry: string;
  status: string;
}

const EMPTY: MemberFormData = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  membership_number: "",
  membership_expiry: "",
  status: "active",
};

export function MemberForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<MemberFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: MemberFormData }>(`/members/${id}`)
      .then((res) => setForm({
        full_name: res.data.full_name ?? "",
        email: res.data.email ?? "",
        phone: res.data.phone ?? "",
        address: res.data.address ?? "",
        membership_number: res.data.membership_number ?? "",
        membership_expiry: res.data.membership_expiry ?? "",
        status: res.data.status ?? "active",
      }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof MemberFormData>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) {
        await apiPut(`/members/${id}`, form);
      } else {
        await apiPost(`/members`, form);
      }
      nav(`/members`);
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
      <button type="button" onClick={() => nav(`/members`)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit" : "New"} Member</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-md bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={inputCls} />
          {fieldError("full_name") && <p className="text-xs text-red-600 mt-1">{fieldError("full_name")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          {fieldError("email") && <p className="text-xs text-red-600 mt-1">{fieldError("email")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
            {fieldError("phone") && <p className="text-xs text-red-600 mt-1">{fieldError("phone")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Membership Number</label>
            <input value={form.membership_number} onChange={(e) => set("membership_number", e.target.value)} className={inputCls} placeholder="Auto-generated if blank" />
            {fieldError("membership_number") && <p className="text-xs text-red-600 mt-1">{fieldError("membership_number")}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
          <textarea value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} className={inputCls} />
          {fieldError("address") && <p className="text-xs text-red-600 mt-1">{fieldError("address")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Membership Expiry <span className="text-red-500">*</span></label>
            <input type="date" required value={form.membership_expiry} onChange={(e) => set("membership_expiry", e.target.value)} className={inputCls} />
            {fieldError("membership_expiry") && <p className="text-xs text-red-600 mt-1">{fieldError("membership_expiry")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status <span className="text-red-500">*</span></label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
            {fieldError("status") && <p className="text-xs text-red-600 mt-1">{fieldError("status")}</p>}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium">
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create Member"}
          </button>
          <button type="button" onClick={() => nav(`/members`)} className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
