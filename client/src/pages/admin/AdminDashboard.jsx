import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { Loading, ErrorState } from "../../components/UI";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .stats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  const cards = stats
    ? [
        { label: "Published Articles", value: `${stats.published_articles} / ${stats.articles}`, to: "/admin/articles", accent: true },
        { label: "Monthly Topics", value: stats.topics, to: "/admin/topics" },
        { label: "Discussions", value: stats.discussions, to: "/admin/discussions" },
        { label: "Total Replies", value: stats.replies, to: "/admin/discussions" },
        { label: "Subscribers", value: stats.subscribers, to: "/admin/subscribers" },
        { label: "Messages", value: stats.messages, to: "/admin/messages" },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Welcome back. Here is what is happening on Liberty Reach.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/articles/new" className="btn-primary">+ New Article</Link>
          <Link to="/admin/topics/new" className="btn-secondary">+ New Topic</Link>
        </div>
      </div>

      {error && <ErrorState message={error} />}
      {!error && !stats && <Loading label="Loading stats…" />}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="card block p-6 transition-shadow hover:shadow-card-hover">
              <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">{c.label}</p>
              <p className={`mt-2 text-4xl font-black ${c.accent ? "text-gold-700" : "text-ink"}`}>{c.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-ink bg-gold p-6">
          <h2 className="text-lg font-black text-ink">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/admin/articles/new" className="btn-secondary">Write an Article</Link>
            <Link to="/admin/topics/new" className="btn-outline">Plan a Topic</Link>
            <Link to="/admin/discussions" className="btn-outline">Moderate Discussions</Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-extrabold text-ink">Public site</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Preview what your visitors see — stories, monthly topics, and the discussion floor.
          </p>
          <Link to="/" className="btn-outline mt-4">Open Public Site →</Link>
        </div>
      </div>
    </div>
  );
}
