import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { Loading, ErrorState } from "../../components/UI";

const CATEGORIES = ["Freedom Ideas", "Campus Activism", "Education", "Leadership", "Policy", "Student Voices"];

const empty = {
  title: "",
  category: CATEGORIES[0],
  author: "",
  author_role: "",
  excerpt: "",
  content: "",
  image_url: "",
  featured: false,
  published: true,
};

export default function AdminArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .adminArticle(id)
      .then((a) =>
        setForm({
          title: a.title || "",
          category: a.category || CATEGORIES[0],
          author: a.author || "",
          author_role: a.author_role || "",
          excerpt: a.excerpt || "",
          content: a.content || "",
          image_url: a.image_url || "",
          featured: !!a.featured,
          published: !!a.published,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const req = id ? api.updateArticle(id, form) : api.createArticle(form);
    req
      .then((a) => {
        setStatus({ ok: true, msg: "Saved." });
        if (!id) navigate(`/admin/articles/${a.id}/edit`, { replace: true });
      })
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  if (loading) return <Loading label="Loading article…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/articles" className="text-sm font-bold text-zinc-500 hover:text-ink">
            ← Back to Articles
          </Link>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
            {id ? "Edit Article" : "New Article"}
          </h1>
        </div>
      </div>

      <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
        {status && (
          <p
            role="status"
            className={`mb-5 border-2 p-3 text-sm font-semibold ${
              status.ok ? "border-green-700 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-700"
            }`}
          >
            {status.msg}
          </p>
        )}

        <div>
          <label htmlFor="f-title" className="label">Title *</label>
          <input id="f-title" className="input text-lg font-bold" required value={form.title} onChange={set("title")} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="f-cat" className="label">Category</label>
            <select id="f-cat" className="input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-img" className="label">Image URL</label>
            <input id="f-img" className="input" value={form.image_url} onChange={set("image_url")} placeholder="https://…" />
          </div>
          <div>
            <label htmlFor="f-author" className="label">Author</label>
            <input id="f-author" className="input" value={form.author} onChange={set("author")} />
          </div>
          <div>
            <label htmlFor="f-role" className="label">Author Role</label>
            <input id="f-role" className="input" value={form.author_role} onChange={set("author_role")} placeholder="e.g. Fellow, University of Lagos" />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="f-excerpt" className="label">Excerpt</label>
          <textarea id="f-excerpt" rows={2} className="input" value={form.excerpt} onChange={set("excerpt")} placeholder="A short summary shown on cards and listings." />
        </div>

        <div className="mt-5">
          <label htmlFor="f-content" className="label">
            Content <span className="font-normal text-zinc-400">(blank line = new paragraph, ## heading, - list item)</span>
          </label>
          <textarea id="f-content" rows={16} className="input font-mono text-sm" required value={form.content} onChange={set("content")} />
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-ink">
            <input type="checkbox" className="h-4 w-4 accent-yellow-400" checked={form.published} onChange={set("published")} />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-ink">
            <input type="checkbox" className="h-4 w-4 accent-yellow-400" checked={form.featured} onChange={set("featured")} />
            Featured on homepage
          </label>
        </div>

        <div className="mt-7 flex gap-3">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save Article"}
          </button>
          <Link to="/admin/articles" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
