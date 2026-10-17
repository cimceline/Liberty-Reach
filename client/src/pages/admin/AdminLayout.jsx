import React, { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { getAdmin, clearSession } from "../../api";
import Logo from "../../components/Logo";

const menu = [
  { to: "/admin", label: "Dashboard", end: true, icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { to: "/admin/articles", label: "Articles", icon: "M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h10v2H4v-2zm0 5h10v2H4v-2z" },
  { to: "/admin/topics", label: "Monthly Topics", icon: "M7 2v2H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1h-3V2h-2v2H9V2H7zm12 8H5v8h14v-8z" },
  { to: "/admin/discussions", label: "Discussions", icon: "M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1z" },
  { to: "/admin/subscribers", label: "Subscribers", icon: "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { to: "/admin/messages", label: "Messages", icon: "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4l8 5 8-5" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = getAdmin();
  const [open, setOpen] = useState(false);

  if (!admin || !localStorage.getItem("lr_token")) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    clearSession();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 border-l-4 px-4 py-3 text-sm font-bold transition-colors ${
      isActive
        ? "border-gold bg-zinc-800 text-gold"
        : "border-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 flex-col bg-ink text-white lg:flex hidden">
        <div className="border-b border-zinc-800 px-5 py-5">
          <Logo dark to="/admin" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={linkClass} onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
                <path d={m.icon} />
              </svg>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-4">
          <p className="truncate text-sm font-bold text-white">{admin.name}</p>
          <p className="truncate text-xs text-zinc-400">{admin.email}</p>
          <div className="mt-3 flex gap-2">
            <Link to="/" className="flex-1 border border-zinc-700 px-3 py-2 text-center text-xs font-bold text-zinc-300 transition-colors hover:border-gold hover:text-gold">
              View Site
            </Link>
            <button type="button" onClick={logout} className="flex-1 bg-gold px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-gold-600">
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-800 bg-ink px-4 lg:hidden">
        <Logo dark compact />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center border border-zinc-600 text-white"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-ink pt-14 lg:hidden">
          <nav className="overflow-y-auto py-4" aria-label="Admin mobile">
            {menu.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end} className={linkClass} onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
                  <path d={m.icon} />
                </svg>
                {m.label}
              </NavLink>
            ))}
            <button type="button" onClick={logout} className="mt-4 w-full border-t border-zinc-800 px-4 py-4 text-left text-sm font-bold text-gold">
              Log Out
            </button>
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="flex min-h-screen w-full flex-col pt-14 lg:ml-64 lg:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
