import React from "react";
import { Link } from "react-router-dom";

export function Flame({ className = "h-9 w-9", dark = false }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 4c6.5 7.8 11 12.2 6.8 18.6-2.2 3.3-11.4 3.3-13.6 0C13 16.2 17.5 11.8 24 4z"
        fill="#FFD700"
        stroke={dark ? "#FFFFFF" : "#000000"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 12.5c2.6 3.4 4.2 5.6 2.5 8.4-.9 1.4-4.1 1.4-5 0-1.7-2.8-.1-5 2.5-8.4z"
        fill={dark ? "#000000" : "#FFFFFF"}
        opacity="0.85"
      />
      <rect x="16.5" y="25.5" width="15" height="4" rx="2" fill={dark ? "#FFFFFF" : "#000000"} />
      <rect x="21.5" y="29.5" width="5" height="13" rx="2" fill={dark ? "#FFFFFF" : "#000000"} />
    </svg>
  );
}

export default function Logo({ dark = false, to = "/", className = "", compact = false }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Liberty Reach home">
      <Flame className="h-9 w-9 shrink-0" dark={dark} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[17px] font-black uppercase tracking-[0.14em] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            Liberty
          </span>
          <span className="relative mt-0.5 inline-block w-fit">
            <span
              className={`text-[17px] font-black uppercase tracking-[0.14em] ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              Reach
            </span>
            <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gold transition-transform duration-200 group-hover:scale-x-110 origin-left" />
          </span>
        </span>
      )}
    </Link>
  );
}
