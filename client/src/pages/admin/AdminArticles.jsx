import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../../api";
import { Loading, ErrorState, EmptyState } from "../../components/UI";

export default function AdminArticles() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    api
      .adminArticles()
      .then(setItems)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const remove = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    api.deleteArticle(id).then(load).catch((e) => window.alert(e.message));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">Articles</h1>
          <p className="mt-1 text-sm text-zinc-500">Write, edit, publish, and feature stories.</p>
        </div>
        <Link to="/admin/articles/new" className="btn-primary">+ New Article</Link>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loading label="Loading articles…" />}
      {items && items.length === 0 && (
        <EmptyState title="No articles yet" body="Write your first story to get started." actionLabel="New Article" actionTo="/admin/articles/new" />
      )}

      {items && items.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate font-bold text-ink">{a.title}</p>
                    {a.featured && <span className="badge mt-1">Featured</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{a.category}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.author}</td>
                  <td className="px-4 py-3 text-zinc-600">{formatDate(a.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${a.published ? "bg-green-100 text-green-800" : "bg-zinc-200 text-zinc-600"}`}>
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/stories/${a.slug}`} className="border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-600 hover:border-ink hover:text-ink" target="_blank" rel="noreferrer">
                        View
                      </Link>
                      <Link to={`/admin/articles/${a.id}/edit`} className="bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800">
                        Edit
                      </Link>
                      <button type="button" onClick={() => remove(a.id, a.title)} className="border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
