import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../api/client";

type Publisher = { id: number; name: string };
type Author = { id: number; first_name: string; last_name: string };
type Category = { id: number; name: string };

interface BookFormData {
  title: string;
  isbn: string;
  description: string;
  cover_image: string;
  published_year: string;
  copies_total: number;
  copies_available: number;
  publisher_id: string;
  author_ids: number[];
  category_ids: number[];
}

const EMPTY: BookFormData = {
  title: "",
  isbn: "",
  description: "",
  cover_image: "",
  published_year: "",
  copies_total: 1,
  copies_available: 1,
  publisher_id: "",
  author_ids: [],
  category_ids: [],
};

export function BookForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<BookFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      apiGet<{ data: Publisher[] }>('/publishers?per_page=200').then(r => setPublishers(r.data)).catch(() => {}),
      apiGet<{ data: Author[] }>('/authors?per_page=200').then(r => setAuthors(r.data)).catch(() => {}),
      apiGet<{ data: Category[] }>('/categories?per_page=200').then(r => setCategories(r.data)).catch(() => {}),
    ]);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: BookFormData & { authors?: Author[]; categories?: Category[] } }>(`/books/${id}`)
      .then((res) => {
        const d = res.data;
        setForm({
          title: d.title ?? "",
          isbn: d.isbn ?? "",
          description: d.description ?? "",
          cover_image: d.cover_image ?? "",
          published_year: d.published_year ? String(d.published_year) : "",
          copies_total: d.copies_total ?? 1,
          copies_available: d.copies_available ?? 1,
          publisher_id: d.publisher_id ? String(d.publisher_id) : "",
          author_ids: (d.authors ?? []).map((a: Author) => a.id),
          category_ids: (d.categories ?? []).map((c: Category) => c.id),
        });
      })
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof BookFormData>(key: K, value: BookFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string): string | undefined => errors[k]?.[0];

  const toggleId = (key: 'author_ids' | 'category_ids', id: number) => {
    setForm(f => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        published_year: form.published_year ? Number(form.published_year) : null,
        publisher_id: form.publisher_id ? Number(form.publisher_id) : null,
      };
      if (isEdit) {
        await apiPut(`/books/${id}`, payload);
      } else {
        await apiPost(`/books`, payload);
      }
      nav(`/books`);
    } catch (e: any) {
      if (e?.status === 422 && e?.body?.errors) {
        setErrors(e.body.errors);
      } else {
        setErrors({ _form: [String(e?.message ?? e)] });
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  if (loading) return (
    <div className="p-6 flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
    </div>
  );
  if (loadError) return (
    <div className="p-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4" /> {loadError}
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <button type="button" onClick={() => nav(`/books`)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
        <ArrowLeft className="w-4 h-4" /> Back to Books
      </button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? "Edit" : "New"} Book</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        {errors._form && (
          <div className="text-sm text-red-600 dark:text-red-400 p-3 rounded-md bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          {fieldError("title") && <p className="text-xs text-red-600 mt-1">{fieldError("title")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ISBN <span className="text-red-500">*</span></label>
          <input required value={form.isbn} onChange={(e) => set("isbn", e.target.value)} className={inputCls} placeholder="978-..." />
          {fieldError("isbn") && <p className="text-xs text-red-600 mt-1">{fieldError("isbn")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
          {fieldError("description") && <p className="text-xs text-red-600 mt-1">{fieldError("description")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Published Year</label>
            <input type="number" value={form.published_year} onChange={(e) => set("published_year", e.target.value)} className={inputCls} placeholder="2024" min="1000" max="2099" />
            {fieldError("published_year") && <p className="text-xs text-red-600 mt-1">{fieldError("published_year")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Publisher</label>
            <select value={form.publisher_id} onChange={(e) => set("publisher_id", e.target.value)} className={inputCls}>
              <option value="">— None —</option>
              {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {fieldError("publisher_id") && <p className="text-xs text-red-600 mt-1">{fieldError("publisher_id")}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Copies Total <span className="text-red-500">*</span></label>
            <input type="number" required min={0} value={form.copies_total} onChange={(e) => set("copies_total", Number(e.target.value))} className={inputCls} />
            {fieldError("copies_total") && <p className="text-xs text-red-600 mt-1">{fieldError("copies_total")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Copies Available <span className="text-red-500">*</span></label>
            <input type="number" required min={0} value={form.copies_available} onChange={(e) => set("copies_available", Number(e.target.value))} className={inputCls} />
            {fieldError("copies_available") && <p className="text-xs text-red-600 mt-1">{fieldError("copies_available")}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
          <input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} className={inputCls} placeholder="https://..." />
          {fieldError("cover_image") && <p className="text-xs text-red-600 mt-1">{fieldError("cover_image")}</p>}
        </div>

        {authors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Authors</label>
            <div className="flex flex-wrap gap-2">
              {authors.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleId('author_ids', a.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.author_ids.includes(a.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                  }`}
                >
                  {a.first_name} {a.last_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleId('category_ids', c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.category_ids.includes(c.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 text-sm font-medium">
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create Book"}
          </button>
          <button type="button" onClick={() => nav(`/books`)} className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
