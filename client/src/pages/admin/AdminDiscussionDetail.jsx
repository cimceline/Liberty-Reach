import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, formatDate } from "../../api";
import { Loading, ErrorState } from "../../components/UI";

export default function AdminDiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disc, setDisc] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    api
      .adminDiscussion(id)
      .then(setDisc)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [id]);

  const toggle = (key) => {
    api.updateDiscussion(id, { [key]: !disc[key] }).then(setDisc).catch((e) => window.alert(e.message));
  };

  const removeReply = (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    api.deleteReply(id, replyId).then(load).catch((e) => window.alert(e.message));
  };

  const removeThread = () => {
    if (!window.confirm(`Delete "${disc.title}" and all replies? This cannot be undone.`)) return;
    api.deleteDiscussion(id).then(() => navigate("/admin/discussions")).catch((e) => window.alert(e.message));
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!disc) return <Loading label="Loading discussion…" />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/discussions" className="text-sm font-bold text-zinc-500 hover:text-ink">
        ← Back to Discussions
      </Link>

      <div className="card mt-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {disc.pinned && <span className="badge-dark">Pinned</span>}
          <span className={disc.type === "question" ? "badge" : "badge-dark"}>
            {disc.type === "question" ? "Question" : "Opinion"}
          </span>
          {disc.locked && (
            <span className="inline-flex bg-zinc-200 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
              Locked
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-black leading-tight text-ink">{disc.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          <span className="font-bold text-ink">{disc.author_name}</span>
          {disc.author_email && <span>{disc.author_email}</span>}
          {disc.campus && <span>{disc.campus}</span>}
          <time dateTime={disc.created_at}>{formatDate(disc.created_at)}</time>
        </div>
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-zinc-800">{disc.body}</p>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-200 pt-5">
          <button type="button" onClick={() => toggle("pinned")} className="btn-outline !py-2 text-xs">
            {disc.pinned ? "Unpin" : "Pin"}
          </button>
          <button type="button" onClick={() => toggle("locked")} className="btn-outline !py-2 text-xs">
            {disc.locked ? "Unlock" : "Lock"}
          </button>
          <button type="button" onClick={removeThread} className="border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
            Delete Thread
          </button>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-extrabold uppercase tracking-wider text-gold-700">
        Replies ({disc.replies.length})
      </h2>
      <ul className="mt-4 space-y-3">
        {disc.replies.map((r) => (
          <li key={r.id} className="border-l-4 border-gold bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="font-extrabold text-ink">{r.author_name}</span>
                <span className="ml-3 text-xs text-zinc-500">{formatDate(r.created_at)}</span>
              </div>
              <button type="button" onClick={() => removeReply(r.id)} className="border border-red-300 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{r.body}</p>
          </li>
        ))}
        {disc.replies.length === 0 && (
          <li className="border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
            No replies yet.
          </li>
        )}
      </ul>
    </div>
  );
}
