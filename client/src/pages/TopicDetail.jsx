import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatDate } from "../api";
import { Loading, ErrorState, MarkdownLite } from "../components/UI";

export default function TopicDetail() {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTopic(null);
    setError(null);
    api
      .topic(slug)
      .then(setTopic)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!topic) return <Loading label="Loading topic…" />;

  return (
    <>
      <section className={`${topic.featured ? "bg-gold" : "bg-ink"} ${topic.featured ? "text-ink" : "text-white"}`}>
        <div className="container-x py-14 sm:py-16">
          <Link to="/topics" className={`text-sm font-bold ${topic.featured ? "text-ink/70 hover:text-ink" : "text-zinc-400 hover:text-gold"}`}>
            ← All Topics
          </Link>
          <p className={`mt-6 text-xs font-extrabold uppercase tracking-[0.2em] ${topic.featured ? "text-ink/60" : "text-gold"}`}>
            {topic.month_label} {topic.year}
          </p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">{topic.title}</h1>
          <p className={`mt-4 max-w-2xl text-lg ${topic.featured ? "text-ink/80" : "text-zinc-300"}`}>{topic.summary}</p>
        </div>
      </section>

      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xl font-extrabold text-ink">About This Topic</h2>
          <div className="mt-4">
            <MarkdownLite text={topic.description} />
          </div>
          <Link to="/discussions" className="btn-outline mt-6">
            Discuss This Topic →
          </Link>
        </div>
        <aside>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-700">Learning Activities</h2>
          <ol className="mt-4 space-y-4">
            {(topic.activities || []).map((act, i) => (
              <li key={i} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="badge shrink-0">{act.label || "Activity"}</span>
                  {act.date && (
                    <time className="text-xs font-semibold text-zinc-500" dateTime={act.date}>
                      {formatDate(act.date)}
                    </time>
                  )}
                </div>
                <h3 className="mt-3 font-extrabold text-ink">{act.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{act.detail}</p>
              </li>
            ))}
            {(topic.activities || []).length === 0 && (
              <li className="text-sm text-zinc-500">Activities will be announced soon.</li>
            )}
          </ol>
        </aside>
      </section>
    </>
  );
}
