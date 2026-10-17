import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { ArticleCard, Loading, ErrorState, EmptyState } from "../components/UI";

const CATEGORIES = ["All", "Freedom Ideas", "Campus Activism", "Education", "Leadership", "Policy", "Student Voices"];

export default function Stories() {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const load = () => {
    setError(null);
    api
      .articles()
      .then(setArticles)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!articles) return null;
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        if (!(a.title + a.excerpt + a.author).toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [articles, category, search]);

  return (
    <>
      <section className="border-b border-zinc-200 bg-ink">
        <div className="container-x py-14 sm:py-16">
          <span className="badge mb-4">Stories</span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Ideas and reports from <span className="bg-gold px-2 text-ink">the network</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Essays, field reports, and conversations from students across Africa building
            the case for a freer society.
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                  category === c
                    ? "bg-gold text-ink"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="lg:w-72">
            <label htmlFor="story-search" className="sr-only">Search stories</label>
            <input
              id="story-search"
              type="search"
              className="input"
              placeholder="Search stories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !filtered && <Loading label="Loading stories…" />}
        {filtered && filtered.length === 0 && (
          <EmptyState
            title="No stories found"
            body="Try a different category or clear your search."
            actionLabel="Browse All"
            actionTo="/stories"
          />
        )}
        {filtered && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
