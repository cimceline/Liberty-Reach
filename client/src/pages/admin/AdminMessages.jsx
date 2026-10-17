import React, { useEffect, useState } from "react";
import { api, formatDate } from "../../api";
import { Loading, ErrorState, EmptyState } from "../../components/UI";

export default function AdminMessages() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  const load = () => {
    setError(null);
    api
      .messages()
      .then(setItems)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const remove = (id) => {
    if (!window.confirm("Delete this message?")) return;
    api.deleteMessage(id).then(load).catch((e) => window.alert(e.message));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">Contact form submissions from the public site.</p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loading label="Loading messages…" />}
      {items && items.length === 0 && <EmptyState title="No messages yet" />}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((m) => (
            <li key={m.id} className="card">
              <button
                type="button"
                onClick={() => setOpenId(openId === m.id ? null : m.id)}
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-5 text-left"
                aria-expanded={openId === m.id}
              >
                <span className="font-extrabold text-ink">{m.name}</span>
                <span className="text-sm text-zinc-500">{m.email}</span>
                {m.subject && <span className="text-sm font-semibold text-zinc-700">{m.subject}</span>}
                <span className="ml-auto text-xs text-zinc-500">{formatDate(m.created_at)}</span>
              </button>
              {openId === m.id && (
                <div className="border-t border-zinc-200 p-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">{m.body}</p>
                  <div className="mt-4 flex gap-2">
                    <a href={`mailto:${m.email}`} className="btn-primary !py-2 text-xs">
                      Reply by Email
                    </a>
                    <button type="button" onClick={() => remove(m.id)} className="border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
