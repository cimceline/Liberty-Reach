import React, { useState } from "react";
import { api } from "../api";

const empty = { name: "", email: "", campus: "", country: "", message: "" };

export default function Join() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    api
      .join(form)
      .then((r) => {
        setStatus({
          ok: true,
          msg: r.duplicate
            ? "You are already on the list — welcome back!"
            : "Welcome to Liberty Reach! Watch your inbox for monthly topics and stories.",
        });
        setForm({ ...empty, name: form.name, email: form.email });
      })
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  return (
    <>
      <section className="border-b border-zinc-200 bg-ink">
        <div className="container-x py-14 sm:py-16">
          <span className="badge mb-4">Get Involved</span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Join the <span className="bg-gold px-2 text-ink">Movement</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Add your name to the network. You will receive monthly learning topics,
            fresh stories, and fellowship announcements — nothing else.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="card p-7 sm:p-10" noValidate>
          <h2 className="text-2xl font-extrabold text-ink">Membership Registration</h2>
          <p className="mt-1.5 text-sm text-zinc-500">Free for every university student on the continent.</p>

          {status && (
            <div
              role="status"
              className={`mt-6 border-2 p-4 text-sm font-semibold ${
                status.ok ? "border-green-700 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-700"
              }`}
            >
              {status.msg}
            </div>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="j-name" className="label">Full Name *</label>
              <input id="j-name" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Amara Okafor" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="j-email" className="label">Email Address *</label>
              <input id="j-email" type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" />
            </div>
            <div>
              <label htmlFor="j-campus" className="label">University / Campus</label>
              <input id="j-campus" className="input" value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} placeholder="e.g. University of Ghana" />
            </div>
            <div>
              <label htmlFor="j-country" className="label">Country</label>
              <input id="j-country" className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Ghana" />
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn-primary mt-7 !px-8 !py-3.5 text-base">
            {busy ? "Submitting…" : "Join the Movement"}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="border-2 border-ink bg-gold p-6">
            <h3 className="text-lg font-black text-ink">What members get</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/85">
              <li>✓ Monthly topic packs with reading lists</li>
              <li>✓ New stories every week</li>
              <li>✓ Fellowship and event announcements</li>
              <li>✓ A pan-African student network</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-extrabold text-ink">Already a member?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Jump into the discussion floor — ask a question or share your opinion with
              students across the continent.
            </p>
            <a href="/discussions" className="btn-secondary mt-4 w-full">
              Go to Discussions
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}
