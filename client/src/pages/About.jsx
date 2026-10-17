import React from "react";
import { Link } from "react-router-dom";
import { JoinStrip } from "./Home";

const values = [
  {
    title: "Ideas Before Power",
    body: "We study the principles of a free society first — dignity, voluntary cooperation, rule of law — so that when responsibility comes, character is already built.",
  },
  {
    title: "Honest Disagreement",
    body: "We treat disagreement as a tool, not a threat. Steelman first, rebut second. Campus culture changes one respectful debate at a time.",
  },
  {
    title: "Africa's Future, African Voices",
    body: "Liberty is not a foreign import. Our continent has deep traditions of freedom and voluntary association. We connect those roots to the global conversation.",
  },
  {
    title: "Builders, Not Critics",
    body: "Complaints are cheap. We measure ourselves by what students actually build: clubs, essays, policy papers, businesses, and institutions that last.",
  },
];

const programs = [
  { label: "Stories", title: "Publishing Platform", body: "Student essays, field reports, and interviews from campuses across the continent." },
  { label: "Topics", title: "Monthly Learning Program", body: "A shared curriculum every month — reading groups, debates, workshops, and public events." },
  { label: "Discussions", title: "Open Discussion Floor", body: "A moderated space for questions and opinions, open to every student who joins." },
  { label: "Fellowship", title: "Liberty Reach Fellowship", body: "Mentorship and resources for students turning ideas into finished campus projects." },
];

export default function About() {
  return (
    <>
      <section className="border-b border-zinc-200 bg-ink">
        <div className="container-x py-14 sm:py-20">
          <span className="badge mb-4">About Liberty Reach</span>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            We take the ideas of freedom{" "}
            <span className="bg-gold px-2 text-ink">straight to campus</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Liberty Reach is a pan-African educational platform built for university
            students who want to understand — and defend — a free society. We connect
            readers, writers, and debaters across borders through stories, structured
            learning, and open conversation.
          </p>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Why we exist</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                Across Africa, a generation is coming of age amid rising unemployment,
                shrinking civic space, and endless debate about what kind of future to
                build. Too often, students encounter freedom only as a slogan — never as
                a rigorous set of ideas worth mastering.
              </p>
              <p>
                Liberty Reach exists to change that. We give students the reading, the
                language, and the practice space to think clearly about liberty — and the
                confidence to act on what they learn.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="mb-3 h-1.5 w-10 bg-gold" />
                <h3 className="font-extrabold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="container-x">
          <h2 className="section-title">What we do</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <div key={p.title} className="border-2 border-ink bg-white p-6">
                <span className="badge">{p.label}</span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid items-center gap-8 border-2 border-ink lg:grid-cols-[1fr_auto]">
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Ready to carry the ideas of liberty on your campus?
            </h2>
            <p className="mt-3 max-w-xl text-base text-zinc-600">
              Join thousands of students across the continent. Membership is free —
              curiosity is the only requirement.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-8 pt-0 sm:p-12 sm:pt-0">
            <Link to="/join" className="btn-primary !px-8 !py-3.5 text-base">
              Join Liberty Reach
            </Link>
            <Link to="/stories" className="btn-outline !px-8 !py-3.5 text-base">
              Read Stories
            </Link>
          </div>
        </div>
      </section>

      <JoinStrip />
    </>
  );
}
