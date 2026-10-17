import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-24 text-center">
      <p className="text-7xl font-black text-gold">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-zinc-600">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back Home
      </Link>
    </section>
  );
}
