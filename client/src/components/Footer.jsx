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
            <li>
              <a
                href="mailto:nemmanuel@studentforliberty.org"
                className="transition-colors hover:text-gold"
              >
                nemmanuel@studentforliberty.org
              </a>
            </li>
            <li>Pan-African network — chapters across the continent</li>
          </ul>
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
