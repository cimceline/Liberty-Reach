import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Loading, ErrorState } from "../components/UI";

export default function Topics() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .topics()
      .then(setTopics)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section className="border-b border-zinc-200 bg-ink">
        <div className="container-x py-14 sm:py-16">
          <span className="badge mb-4">Learning Program</span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Monthly Topics &amp; <span className="bg-gold px-2 text-ink">Learning Activities</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Every month, the network studies one theme together — with reading groups,
            debates, workshops, and public events you can run on your own campus.
          </p>
        </div>
      </section>

      <section className="container-x space-y-8 py-12">
        {error && <ErrorState message={error} />}
        {!error && !topics && <Loading label="Loading topics…" />}
        {topics &&
          topics.map((t) => (
            <article key={t.id} className="card grid gap-0 overflow-hidden md:grid-cols-[240px_1fr]">
              <div className={`flex flex-col justify-center p-7 ${t.featured ? "bg-gold" : "bg-ink"}`}>
                <p className={`text-xs font-extrabold uppercase tracking-[0.2em] ${t.featured ? "text-ink/60" : "text-gold"}`}>
                  {t.month_label}
                </p>
                <p className={`mt-1 text-5xl font-black ${t.featured ? "text-ink" : "text-white"}`}>{t.year}</p>
                {t.featured && (
                  <span className="badge-dark mt-4 w-fit">Featured Month</span>
                )}
              </div>
              <div className="p-7">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink">{t.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(t.activities || []).slice(0, 4).map((a, i) => (
                    <span key={i} className="border border-zinc-300 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      {a.label || "Activity"}
                    </span>
                  ))}
                </div>
                <Link to={`/topics/${t.slug}`} className="btn-primary mt-5">
                  View Activities →
                </Link>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}
