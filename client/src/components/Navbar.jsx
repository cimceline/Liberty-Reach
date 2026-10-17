import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/stories", label: "Stories" },
  { to: "/topics", label: "Topics" },
  { to: "/discussions", label: "Discussions" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-bold tracking-wide transition-colors ${
      isActive ? "text-ink border-b-[3px] border-gold" : "text-zinc-700 hover:text-ink border-b-[3px] border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/join" className="btn-primary ml-3 !py-2">
            Join the Movement
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border-2 border-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-zinc-200 bg-white md:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-l-4 px-3 py-3 text-base font-bold ${
                    isActive ? "border-gold text-ink bg-gold-50" : "border-transparent text-zinc-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/join" onClick={() => setOpen(false)} className="btn-primary my-3">
              Join the Movement
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
