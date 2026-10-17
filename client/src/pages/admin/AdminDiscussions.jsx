import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../../api";
import { Loading, ErrorState, EmptyState } from "../../components/UI";

const TABS = [
  { key: "all", label: "All" },
  { key: "question", label: "Questions" },
  { key: "opinion", label: "Opinions" },
];

export default function AdminDiscussions() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");

  const load = () => {
    setError(null);
    api
      .adminDiscussions(tab === "all" ? {} : { type: tab })
      .then(setItems)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [tab]);

  const remove = (id, title) => {
    if (!window.confirm(`Delete "${title}" and all its replies? This cannot be undone.`)) return;
    api.deleteDiscussion(id).then(load).catch((e) => window.alert(e.message));
  };

  const toggle = (d, key) => {
    api.updateDiscussion(d.id, { [key]: !d[key] }).then(load).catch((e) => window.alert(e.message));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Discussions</h1>
        <p className="mt-1 text-sm text-zinc-500">Moderate student conversations — pin, lock, or remove threads.</p>
      </div>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
              tab === t.key ? "bg-gold text-ink" : "border border-zinc-300 bg-white text-zinc-600 hover:border-ink hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loading label="Loading discussions…" />}
      {items && items.length === 0 && <EmptyState title="No discussions in this view" />}

      {items && items.length > 0 && (
        <div className="space-y-3">
          {items.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                {d.pinned && <span className="badge-dark">Pinned</span>}
                <span className={d.type === "question" ? "badge" : "badge-dark"}>
                  {d.type === "question" ? "Question" : "Opinion"}
                </span>
                {d.locked && (
                  <span className="inline-flex bg-zinc-200 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
                    Locked
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-500">{formatDate(d.created_at)}</span>
              </div>
              <h2 className="mt-2 font-extrabold text-ink">{d.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">
                by <span className="font-semibold text-ink">{d.author_name}</span>
                {d.campus ? ` · ${d.campus}` : ""} · {d.reply_count} replies
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/admin/discussions/${d.id}`} className="bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800">
                  View &amp; Moderate
                </Link>
                <button type="button" onClick={() => toggle(d, "pinned")} className="border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-600 hover:border-ink hover:text-ink">
                  {d.pinned ? "Unpin" : "Pin"}
                </button>
                <button type="button" onClick={() => toggle(d, "locked")} className="border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-600 hover:border-ink hover:text-ink">
                  {d.locked ? "Unlock" : "Lock"}
                </button>
                <button type="button" onClick={() => remove(d.id, d.title)} className="border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
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
