import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../api";

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-zinc-500" role="status">
      <span className="h-5 w-5 animate-spin border-2 border-zinc-300 border-t-gold" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="border-2 border-ink bg-gold-50 p-8">
        <h2 className="text-xl font-extrabold text-ink">Something went wrong</h2>
        <p className="mt-2 text-sm text-zinc-600">{message || "Please try again in a moment."}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-secondary mt-5">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, body, actionLabel, actionTo }) {
  return (
    <div className="border-2 border-dashed border-zinc-300 p-12 text-center">
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{body}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, body, actionLabel, actionTo, light = false }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={`mb-2 text-xs font-extrabold uppercase tracking-[0.2em] ${light ? "text-gold" : "text-gold-700"}`}>
            {eyebrow}
          </p>
        )}
        <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        {body && (
          <p className={`mt-3 text-base leading-relaxed ${light ? "text-zinc-300" : "text-zinc-600"}`}>{body}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className={light ? "btn-outline-light shrink-0" : "btn-outline shrink-0"}>
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

export function ArticleCard({ article }) {
  const image = article.image_url;
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <Link to={`/stories/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink">
            <span className="text-4xl font-black text-gold">LR</span>
          </div>
        )}
        <span className="badge absolute left-0 top-4">{article.category}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-snug text-ink">
          <Link to={`/stories/${article.slug}`} className="transition-colors hover:text-gold-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
          {article.excerpt || excerpt(article.content)}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-500">
          <span className="font-semibold text-ink">{article.author}</span>
          <span>{formatDate(article.created_at)}</span>
        </div>
      </div>
    </article>
  );
}

function excerpt(content, max = 160) {
  const text = String(content || "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

/* Minimal safe markdown-ish renderer: paragraphs, ## headings, - lists. */
export function MarkdownLite({ text }) {
  const blocks = String(text || "").split(/\n\n+/);
  return (
    <div className="prose-lr">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        if (lines[0] && lines[0].trim().startsWith("## ")) {
          return <h3 key={i}>{lines[0].trim().slice(3)}</h3>;
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
