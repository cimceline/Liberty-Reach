import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatDate } from "../api";
import { Loading, ErrorState } from "../components/UI";

export default function DiscussionDetail() {
  const { id } = useParams();
  const [disc, setDisc] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ author_name: "", body: "" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setError(null);
    api
      .discussion(id)
      .then(setDisc)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [id]);

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    api
      .reply(id, form)
      .then((d) => {
        setDisc(d);
        setForm({ author_name: form.author_name, body: "" });
        setStatus({ ok: true, msg: "Reply posted." });
      })
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!disc) return <Loading label="Loading discussion…" />;

  return (
    <section className="container-x max-w-4xl py-12">
      <Link to="/discussions" className="text-sm font-bold text-zinc-500 hover:text-ink">
        ← Back to Discussions
      </Link>

      <article className="card mt-6 p-7 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          {disc.pinned && <span className="badge-dark">Pinned</span>}
          <span className={disc.type === "question" ? "badge" : "badge-dark"}>
            {disc.type === "question" ? "Question" : "Opinion"}
          </span>
          {disc.locked && (
            <span className="inline-flex items-center bg-zinc-200 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
              Locked
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
          {disc.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-zinc-200 pb-6 text-sm text-zinc-500">
          <span className="font-bold text-ink">{disc.author_name}</span>
          {disc.campus && <span>{disc.campus}</span>}
          <time dateTime={disc.created_at}>{formatDate(disc.created_at)}</time>
        </div>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-zinc-800">{disc.body}</p>
      </article>

      <h2 className="mt-12 text-lg font-extrabold uppercase tracking-wider text-gold-700">
        {disc.replies.length} {disc.replies.length === 1 ? "Reply" : "Replies"}
      </h2>

      <ul className="mt-5 space-y-4">
        {disc.replies.map((r) => (
          <li key={r.id} className="border-l-4 border-gold bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-extrabold text-ink">{r.author_name}</span>
              <time className="text-xs text-zinc-500" dateTime={r.created_at}>
                {formatDate(r.created_at)}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{r.body}</p>
          </li>
        ))}
        {disc.replies.length === 0 && (
          <li className="border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
            No replies yet. Add the first one.
          </li>
        )}
      </ul>

      {disc.locked ? (
        <div className="mt-10 border-2 border-zinc-300 bg-zinc-50 p-6 text-center">
          <p className="font-bold text-ink">This discussion is locked.</p>
          <p className="mt-1 text-sm text-zinc-500">An administrator has closed it for new replies.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-10 p-6 sm:p-8" noValidate>
          <h3 className="text-xl font-extrabold text-ink">Add Your Reply</h3>
          {status && (
            <p
              role="status"
              className={`mt-3 text-sm font-semibold ${status.ok ? "text-green-700" : "text-red-600"}`}
            >
              {status.msg}
            </p>
          )}
          <div className="mt-4">
            <label htmlFor="r-name" className="label">Your Name</label>
            <input id="r-name" className="input" required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
          </div>
          <div className="mt-4">
            <label htmlFor="r-body" className="label">Reply</label>
            <textarea id="r-body" rows={4} className="input" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Keep it thoughtful and respectful…" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary mt-4">
            {busy ? "Posting…" : "Post Reply"}
          </button>
        </form>
      )}
    </section>
  );
}
