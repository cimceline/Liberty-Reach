import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../api";
import { Loading, ErrorState, EmptyState } from "../components/UI";

const TABS = [
  { key: "all", label: "All" },
  { key: "question", label: "Questions" },
  { key: "opinion", label: "Opinions" },
];

export default function Discussions() {
  const [threads, setThreads] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", author_name: "", author_email: "", campus: "", type: "question" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setError(null);
    api
      .discussions()
      .then(setThreads)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    api
      .createDiscussion(form)
      .then(() => {
        setStatus({ ok: true, msg: "Posted! Your thread is now live on the discussion floor." });
        setForm({ title: "", body: "", author_name: "", author_email: "", campus: "", type: form.type });
        setShowForm(false);
        load();
      })
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  const filtered = threads ? threads.filter((t) => tab === "all" || t.type === tab) : null;

  return (
    <>
      <section className="border-b border-zinc-200 bg-ink">
        <div className="container-x py-14 sm:py-16">
          <span className="badge mb-4">Discussion Floor</span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Student <span className="bg-gold px-2 text-ink">Discussions</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Ask the question you have been quietly carrying. Make the case for the idea
            you cannot find anywhere else. Respectful disagreement is welcome.
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Filter discussions">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                  tab === t.key ? "bg-gold text-ink" : "border border-zinc-300 bg-white text-zinc-600 hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary">
            {showForm ? "Close Form" : "+ Start a Discussion"}
          </button>
        </div>

        {status && (
          <div
            role="status"
            className={`mb-6 border-2 p-4 text-sm font-semibold ${
              status.ok ? "border-green-700 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        {showForm && (
          <form onSubmit={submit} className="card mb-10 p-6 sm:p-8" noValidate>
            <h2 className="text-xl font-extrabold text-ink">Start a Discussion</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="label">Type</span>
                <div className="flex gap-2">
                  {[
                    { key: "question", label: "Ask a Question" },
                    { key: "opinion", label: "Share Your Opinion" },
                  ].map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => setForm({ ...form, type: o.key })}
                      className={`flex-1 border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                        form.type === o.key ? "border-ink bg-gold text-ink" : "border-zinc-300 bg-white text-zinc-600 hover:border-ink"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="d-title" className="label">Title</label>
                <input id="d-title" className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What do you want to discuss?" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="d-body" className="label">Your Message</label>
                <textarea id="d-body" rows={5} className="input" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Share context, your view, or your question…" />
              </div>
              <div>
                <label htmlFor="d-name" className="label">Your Name</label>
                <input id="d-name" className="input" required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="d-email" className="label">Email <span className="font-normal text-zinc-400">(optional)</span></label>
                <input id="d-email" type="email" className="input" value={form.author_email} onChange={(e) => setForm({ ...form, author_email: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="d-campus" className="label">University / Campus <span className="font-normal text-zinc-400">(optional)</span></label>
                <input id="d-campus" className="input" value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={busy} className="btn-primary mt-5">
              {busy ? "Posting…" : form.type === "question" ? "Ask the Question" : "Share Your Opinion"}
            </button>
          </form>
        )}

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !filtered && <Loading label="Loading discussions…" />}
        {filtered && filtered.length === 0 && (
          <EmptyState title="No discussions yet" body="Be the first to start the conversation." />
        )}
        {filtered && filtered.length > 0 && (
          <ul className="space-y-4">
            {filtered.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/discussions/${d.id}`}
                  className="card block p-6 transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {d.pinned && <span className="badge-dark">Pinned</span>}
                    <span className={d.type === "question" ? "badge" : "badge-dark"}>
                      {d.type === "question" ? "Question" : "Opinion"}
                    </span>
                    {d.locked && (
                      <span className="inline-flex items-center bg-zinc-200 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
                        Locked
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold leading-snug text-ink">{d.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">{d.body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span className="font-bold text-ink">{d.author_name}</span>
                    {d.campus && <span>{d.campus}</span>}
                    <time dateTime={d.created_at}>{formatDate(d.created_at)}</time>
                    <span className="ml-auto font-bold text-gold-700">
                      {d.reply_count} {d.reply_count === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
