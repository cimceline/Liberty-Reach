import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { Loading, ErrorState } from "../../components/UI";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const empty = {
  title: "",
  month_label: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear(),
  summary: "",
  description: "",
  activities: [],
  featured: false,
  published: true,
};

export default function AdminTopicEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .adminTopic(id)
      .then((t) =>
        setForm({
          title: t.title || "",
          month_label: t.month_label || MONTHS[0],
          year: t.year || new Date().getFullYear(),
          summary: t.summary || "",
          description: t.description || "",
          activities: t.activities || [],
          featured: !!t.featured,
          published: !!t.published,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const setActivity = (i, k, v) => {
    const activities = form.activities.map((a, idx) => (idx === i ? { ...a, [k]: v } : a));
    setForm({ ...form, activities });
  };

  const addActivity = () =>
    setForm({
      ...form,
      activities: [...form.activities, { title: "", detail: "", date: "", label: "Workshop" }],
    });

  const removeActivity = (i) =>
    setForm({ ...form, activities: form.activities.filter((_, idx) => idx !== i) });

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const body = { ...form, year: Number(form.year) };
    const req = id ? api.updateTopic(id, body) : api.createTopic(body);
    req
      .then((t) => {
        setStatus({ ok: true, msg: "Saved." });
        if (!id) navigate(`/admin/topics/${t.id}/edit`, { replace: true });
      })
      .catch((err) => setStatus({ ok: false, msg: err.message }))
      .finally(() => setBusy(false));
  };

  if (loading) return <Loading label="Loading topic…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/topics" className="text-sm font-bold text-zinc-500 hover:text-ink">
        ← Back to Topics
      </Link>
      <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{id ? "Edit Topic" : "New Topic"}</h1>

      <form onSubmit={submit} className="card mt-6 p-6 sm:p-8" noValidate>
        {status && (
          <p
            role="status"
            className={`mb-5 border-2 p-3 text-sm font-semibold ${
              status.ok ? "border-green-700 bg-green-50 text-green-800" : "border-red-600 bg-red-50 text-red-700"
            }`}
          >
            {status.msg}
          </p>
        )}

        <div>
          <label htmlFor="t-title" className="label">Topic Title *</label>
          <input id="t-title" className="input text-lg font-bold" required value={form.title} onChange={set("title")} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="t-month" className="label">Month</label>
            <select id="t-month" className="input" value={form.month_label} onChange={set("month_label")}>
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="t-year" className="label">Year</label>
            <input id="t-year" type="number" min="2020" max="2100" className="input" value={form.year} onChange={set("year")} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-ink">
              <input type="checkbox" className="h-4 w-4 accent-yellow-400" checked={form.published} onChange={set("published")} />
              Published
            </label>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="t-summary" className="label">Summary</label>
          <textarea id="t-summary" rows={2} className="input" value={form.summary} onChange={set("summary")} />
        </div>

        <div className="mt-5">
          <label htmlFor="t-desc" className="label">Full Description</label>
          <textarea id="t-desc" rows={5} className="input" value={form.description} onChange={set("description")} />
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-bold text-ink">
          <input type="checkbox" className="h-4 w-4 accent-yellow-400" checked={form.featured} onChange={set("featured")} />
          Featured topic (highlighted on the homepage)
        </label>

        <div className="mt-8 border-t border-zinc-200 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Learning Activities</h2>
            <button type="button" onClick={addActivity} className="btn-outline !py-2 text-xs">
              + Add Activity
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {form.activities.map((a, i) => (
              <div key={i} className="border border-zinc-200 bg-zinc-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor={`act-title-${i}`}>Title</label>
                    <input id={`act-title-${i}`} className="input" value={a.title} onChange={(e) => setActivity(i, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor={`act-label-${i}`}>Label</label>
                    <input id={`act-label-${i}`} className="input" value={a.label} onChange={(e) => setActivity(i, "label", e.target.value)} placeholder="e.g. Debate, Workshop…" />
                  </div>
                  <div>
                    <label className="label" htmlFor={`act-date-${i}`}>Date</label>
                    <input id={`act-date-${i}`} type="date" className="input" value={a.date} onChange={(e) => setActivity(i, "date", e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeActivity(i)} className="mb-[1px] w-full border border-red-300 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50">
                      Remove
                    </button>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor={`act-detail-${i}`}>Detail</label>
                    <textarea id={`act-detail-${i}`} rows={2} className="input" value={a.detail} onChange={(e) => setActivity(i, "detail", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {form.activities.length === 0 && (
              <p className="border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                No activities yet. Add one above.
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save Topic"}
          </button>
          <Link to="/admin/topics" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
