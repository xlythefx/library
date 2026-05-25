import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../api/client";

interface CategoryFormData { name: string; slug: string; description: string; }
const EMPTY: CategoryFormData = { name: "", slug: "", description: "" };

export function CategoryForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<CategoryFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: CategoryFormData }>(`/categories/${id}`)
      .then((res) => setForm({ name: res.data.name ?? "", slug: res.data.slug ?? "", description: res.data.description ?? "" }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof CategoryFormData>(key: K, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setForm(f => ({ ...f, name: val, slug: f.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setErrors({});
    try {
      if (isEdit) await apiPut(`/categories/${id}`, form);
      else await apiPost(`/categories`, form);
      nav(`/categories`);
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
      <button type="button" onClick={() => nav(`/categories`)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"><ArrowLeft className="w-4 h-4" /> Back to Categories</button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit" : "New"} Category</h1>
      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-md bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name <span className="text-red-500">*</span></label>
          <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} />
          {fieldError("name") && <p className="text-xs text-red-600 mt-1">{fieldError("name")}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug <span className="text-red-500">*</span></label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="auto-generated-from-name" />
          {fieldError("slug") && <p className="text-xs text-red-600 mt-1">{fieldError("slug")}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
          {fieldError("description") && <p className="text-xs text-red-600 mt-1">{fieldError("description")}</p>}
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium">
            <Save className="w-4 h-4" />{saving ? "Saving…" : isEdit ? "Save changes" : "Create Category"}
          </button>
          <button type="button" onClick={() => nav(`/categories`)} className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
