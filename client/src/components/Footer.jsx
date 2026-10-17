import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const cols = [
  {
    title: "Explore",
    links: [
      { to: "/stories", label: "Stories" },
      { to: "/topics", label: "Monthly Topics" },
      { to: "/discussions", label: "Discussions" },
      { to: "/about", label: "About Us" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { to: "/join", label: "Join Liberty Reach" },
      { to: "/discussions", label: "Ask a Question" },
      { to: "/discussions", label: "Share Your Opinion" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-300">
            A freedom-focused educational platform for Africa's next generation of
            leaders, thinkers, and builders.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-zinc-300 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
            <li>hello@libertyreach.org</li>
            <li>Pan-African network — chapters across the continent</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[
              { label: "X", d: "M4 4l7.5 9.5L4.5 20H7l5.3-5.9L16.8 20H20l-7.8-9.9L19.4 4H17l-4.9 5.5L7.5 4H4z" },
              { label: "Facebook", d: "M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4V14h2.4v7h2.9z" },
              { label: "YouTube", d: "M21.6 8.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 5 12 5 12 5h0s-4 0-6.8.3c-.4 0-1.3.1-2 .9-.6.6-.8 2-.8 2S2.2 9.8 2.2 11.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.7.8 2.2.9 1.6.1 6.6.2 6.6.2s4 0 6.8-.3c.4 0 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.6-.2-3.2-.2-3.2zM9.9 14.6V9.1l5.3 2.8-5.3 2.7z" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                onClick={(e) => e.preventDefault()}
                className="flex h-9 w-9 items-center justify-center border border-zinc-700 text-zinc-300 transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Liberty Reach. Freedom education for Africa's next generation.</p>
          <Link to="/admin/login" className="transition-colors hover:text-gold">
            Administrator Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
