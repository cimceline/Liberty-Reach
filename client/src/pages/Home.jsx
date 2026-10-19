import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { ArticleCard, Loading, ErrorState, SectionHeading } from "../components/UI";
import { Flame } from "../components/Logo";

const heroImages = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
];

export default function Home() {
  const [articles, setArticles] = useState(null);
  const [topics, setTopics] = useState(null);
  const [storyCount, setStoryCount] = useState(0);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    Promise.all([api.articles({ featured: "1" }), api.topics(), api.articles()])
      .then(([a, t, all]) => {
        setArticles(a.slice(0, 3));
        setTopics(t);
        setStoryCount(all.length);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const featuredTopic = topics && topics.find((t) => t.featured) || topics && topics[0];

  const stats = [
    { value: "24", label: "Campus Chapters" },
    { value: "11", label: "Countries" },
    { value: String(storyCount), label: "Stories Published" },
    { value: "0", label: "Students Reached" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          {heroImages[0] && (
            <img
              src={heroImages[0]}
              alt=""
              className="h-full w-full object-cover object-center opacity-30"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        </div>
        <div className="container-x relative grid min-h-[560px] items-center gap-10 py-20 lg:grid-cols-2">
          <div>
            <span className="badge mb-6">Pan-African · Student-Led · Free</span>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Empowering Africa's Next Generation of{" "}
              <span className="bg-gold px-2 text-ink">Freedom Champions</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
              Liberty Reach is where African university students explore the ideas of a
              free society — through stories, structured monthly topics, and honest
              conversation across campuses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/stories" className="btn-primary !px-7 !py-3.5 text-base">
                Explore Stories
              </Link>
              <Link to="/discussions" className="btn-outline-light !px-7 !py-3.5 text-base">
                Join the Conversation
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={heroImages[1]}
                alt="African university students in discussion"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.innerHTML =
                    '<div class="flex h-full w-full items-center justify-center bg-zinc-900"><span class="text-gold"><svg viewBox="0 0 48 48" width="96" height="96"><path d="M24 4c6.5 7.8 11 12.2 6.8 18.6-2.2 3.3-11.4 3.3-13.6 0C13 16.2 17.5 11.8 24 4z" fill="#FFD700"/></svg></span></div>';
                }}
              />
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 border-4 border-ink bg-gold px-5 py-3 text-ink shadow-xl">
              <Flame className="h-8 w-8" />
              <p className="text-sm font-black leading-tight">
                Ideas worth
                <br />
                defending
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-zinc-200 bg-gold">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-ink sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured stories */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow="From the Network"
          title="Featured Stories"
          body="Field reports, essays, and ideas from students building a free society on their campuses."
          actionLabel="All Stories"
          actionTo="/stories"
        />
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !articles && <Loading label="Loading stories…" />}
        {articles && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      {/* Monthly topic */}
      {featuredTopic && (
        <section className="bg-ink py-16 sm:py-20">
          <div className="container-x">
            <SectionHeading
              light
              eyebrow="This Month's Focus"
              title={featuredTopic.title}
              body={featuredTopic.summary}
              actionLabel="All Topics"
              actionTo="/topics"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(featuredTopic.activities || []).map((act, i) => (
                <div key={i} className="border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-gold">
                  <span className="badge">{act.label || "Activity"}</span>
                  <h3 className="mt-3 font-extrabold text-white">{act.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{act.detail}</p>
                </div>
              ))}
            </div>
            <Link to={`/topics/${featuredTopic.slug}`} className="btn-primary mt-8">
              View the Full Program →
            </Link>
          </div>
        </section>
      )}

      {/* Discussions CTA */}
      <section className="container-x py-16 sm:py-20">
        <div className="grid items-center gap-10 border-2 border-ink lg:grid-cols-2">
          <div className="bg-gold p-8 sm:p-12">
            <h2 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
              Your campus. Your questions. Your ideas.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              The discussion floor is open. Ask the question you have been quietly
              carrying, or make the case for the opinion you cannot find anywhere else.
              Students across the continent are already answering.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/discussions" className="btn-secondary">
                Ask a Question
              </Link>
              <Link to="/discussions" className="btn-outline">
                Share Your Opinion
              </Link>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <blockquote className="text-xl font-bold leading-relaxed text-ink">
              “The student who understands liberty today will build the institutions of
              tomorrow. That is why we reach campuses first.”
            </blockquote>
            <p className="mt-5 text-sm font-extrabold uppercase tracking-wider text-gold-700">
              — The Liberty Reach Team
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <JoinStrip />
    </>
  );
}

export function JoinStrip() {
  const [form, setForm] = useState({ name: "", email: "", campus: "", country: "" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    api
      .join(form)
      .then((r) =>
        setStatus({
          ok: true,
          msg: r.duplicate ? "You are already on the list — welcome back!" : "You are in. Welcome to Liberty Reach!",
        })
      )
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  return (
    <section className="border-t border-zinc-200 bg-zinc-50">
      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-gold-700">Stay Close</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Join the Liberty Reach network
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-600">
            Get monthly topics, new stories, and fellowship announcements delivered to
            your inbox. Free, focused, and built for students.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="join-name" className="label">Full Name</label>
              <input id="join-name" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Amara Okafor" />
            </div>
            <div>
              <label htmlFor="join-email" className="label">Email</label>
              <input id="join-email" type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" />
            </div>
            <div>
              <label htmlFor="join-campus" className="label">University / Campus</label>
              <input id="join-campus" className="input" value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} placeholder="e.g. University of Lagos" />
            </div>
            <div>
              <label htmlFor="join-country" className="label">Country</label>
              <input id="join-country" className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Nigeria" />
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
            {busy ? "Joining…" : "Join the Movement"}
          </button>
          {status && (
            <p role="status" className={`text-sm font-semibold ${status.ok ? "text-green-700" : "text-red-600"}`}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
