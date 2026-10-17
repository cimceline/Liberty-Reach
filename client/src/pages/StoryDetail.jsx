import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatDate } from "../api";
import { Loading, ErrorState, MarkdownLite } from "../components/UI";

export default function StoryDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setArticle(null);
    setError(null);
    api
      .article(slug)
      .then(setArticle)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!article) return <Loading label="Loading story…" />;

  return (
    <article>
      <div className="relative h-64 bg-ink sm:h-80 lg:h-[420px]">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="h-full w-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink to-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-8">
          <span className="badge mb-3">{article.category}</span>
          <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-zinc-200 pb-6 text-sm text-zinc-500">
            <span className="font-bold text-ink">{article.author}</span>
            <span>{article.author_role}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
          </div>
          <MarkdownLite text={article.content} />
          <div className="mt-10 border-t border-zinc-200 pt-8">
            <Link to="/stories" className="btn-outline">
              ← Back to Stories
            </Link>
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold-700">About the Author</h3>
            <p className="mt-2 text-2xl font-black text-ink">{article.author}</p>
            <p className="mt-1 text-sm text-zinc-500">{article.author_role}</p>
          </div>
          <div className="border-2 border-ink bg-gold p-5">
            <h3 className="text-lg font-black text-ink">Want to write for us?</h3>
            <p className="mt-2 text-sm text-ink/80">
              Liberty Reach publishes student voices from across the continent.
            </p>
            <Link to="/join" className="btn-secondary mt-4 w-full">
              Join the Network
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
