import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, setSession, getAdmin } from "../../api";
import Logo, { Flame } from "../../components/Logo";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (getAdmin() && localStorage.getItem("lr_token")) return <Navigate to="/admin" replace />;

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    api
      .login(form)
      .then((r) => {
        setSession(r.token, r.admin);
        navigate("/admin", { replace: true });
      })
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>
        <div className="bg-white shadow-2xl">
          <div className="border-b-4 border-gold px-8 py-6 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-700">Administrator</p>
            <h1 className="mt-1 text-2xl font-black text-ink">Sign in to the dashboard</h1>
          </div>
          <form onSubmit={submit} className="px-8 py-8" noValidate>
            {error && (
              <p role="alert" className="mb-5 border-2 border-red-600 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="a-email" className="label">Email</label>
              <input
                id="a-email"
                type="email"
                className="input"
                required
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin's email"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="a-pass" className="label">Password</label>
              <div className="relative">
                <input
                  id="a-pass"
                  type={showPass ? "text" : "password"}
                  className="input pr-11"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  aria-pressed={showPass}
                  className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-zinc-400 transition-colors hover:text-ink"
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full !py-3">
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">
          <Flame className="mr-1 inline-block h-4 w-4 align-text-bottom" dark /> Liberty Reach Content Management
        </p>
      </div>
    </div>
  );
}
