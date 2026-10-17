import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { Loading, ErrorState, EmptyState } from "../../components/UI";

export default function AdminTopics() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    api
      .adminTopics()
      .then(setItems)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const remove = (id, title) => {
    if (!window.confirm(`Delete topic "${title}"? This cannot be undone.`)) return;
    api.deleteTopic(id).then(load).catch((e) => window.alert(e.message));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink sm:text-3xl">Monthly Topics</h1>
          <p className="mt-1 text-sm text-zinc-500">Plan the shared learning calendar for the network.</p>
        </div>
        <Link to="/admin/topics/new" className="btn-primary">+ New Topic</Link>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loading label="Loading topics…" />}
      {items && items.length === 0 && (
        <EmptyState title="No topics yet" body="Create the first monthly learning topic." actionLabel="New Topic" actionTo="/admin/topics/new" />
      )}

      {items && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <div key={t.id} className="card p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{t.month_label} {t.year}</span>
                {t.featured && <span className="badge-dark">Featured</span>}
                <span className={`inline-flex px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${t.published ? "bg-green-100 text-green-800" : "bg-zinc-200 text-zinc-600"}`}>
                  {t.published ? "Published" : "Draft"}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-extrabold text-ink">{t.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600">{t.summary}</p>
              <p className="mt-2 text-xs font-semibold text-zinc-500">
                {(t.activities || []).length} activities
              </p>
              <div className="mt-4 flex gap-2">
                <Link to={`/admin/topics/${t.id}/edit`} className="btn-secondary !px-4 !py-2 text-xs">
                  Edit
                </Link>
                <button type="button" onClick={() => remove(t.id, t.title)} className="border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
