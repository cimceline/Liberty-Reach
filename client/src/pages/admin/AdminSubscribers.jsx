import React, { useEffect, useState } from "react";
import { api, formatDate } from "../../api";
import { Loading, ErrorState, EmptyState } from "../../components/UI";

export default function AdminSubscribers() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    api
      .subscribers()
      .then(setItems)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const remove = (id, email) => {
    if (!window.confirm(`Remove ${email} from the subscriber list?`)) return;
    api.deleteSubscriber(id).then(load).catch((e) => window.alert(e.message));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink sm:text-3xl">Subscribers</h1>
        <p className="mt-1 text-sm text-zinc-500">Everyone who joined the Liberty Reach network.</p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <Loading label="Loading subscribers…" />}
      {items && items.length === 0 && <EmptyState title="No subscribers yet" body="Share the join page to grow the network." />}

      {items && items.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Campus</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-bold text-ink">{s.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.email}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.campus || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.country || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => remove(s.id, s.email)} className="border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                      Remove
                    </button>
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
