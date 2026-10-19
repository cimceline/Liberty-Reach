// Demo content used by the JSON fallback store and the MySQL seed script.

const ARTICLES = [];

const TOPICS = [
  {
    title: "Foundations of a Free Society",
    slug: "foundations-of-a-free-society",
    month_label: "January",
    year: 2026,
    featured: 1,
    published: 1,
    summary: "What makes a free society? This month we examine the moral and institutional foundations of liberty.",
    description:
      "We open the year with first principles. Throughout January, clubs across the network study the core ideas of a free society: individual dignity, voluntary cooperation, rule of law, and limited government. The aim is not agreement — it is precision. We want every member able to state a position on liberty clearly and defend it fairly.",
    activities: JSON.stringify([
      { title: "Opening Reading Group", detail: "Discuss the first chapter of On Liberty. Bring one quotation you loved and one you resisted.", date: "2026-01-08", label: "Reading Group" },
      { title: "Foundations Debate Night", detail: "Structured debate: resolved, a free society requires shared moral traditions.", date: "2026-01-15", label: "Debate" },
      { title: "Campus Talk: What Freedom Meant to Our Grandparents", detail: "Local historians join students to discuss African traditions of liberty and authority.", date: "2026-01-22", label: "Public Talk" },
      { title: "Essay Sprint", detail: "Members draft 800-word essays on 'The free society I want to build'. Best essays published on Liberty Reach.", date: "2026-01-29", label: "Writing" }
    ])
  },
  {
    title: "Economic Freedom in Practice",
    slug: "economic-freedom-in-practice",
    month_label: "February",
    year: 2026,
    featured: 0,
    published: 1,
    summary: "From inflation to entrepreneurship — a hands-on month of learning how economies really work.",
    description:
      "February is practical. Clubs run mini-enterprises, track real prices, and interview local entrepreneurs. We connect classroom theory to the marketplaces our members grew up in. The month closes with an essay contest judged by journalists and founders.",
    activities: JSON.stringify([
      { title: "Micro-Enterprise Launch Week", detail: "Teams of four launch a real campus service with under $20 seed money.", date: "2026-02-03", label: "Workshop" },
      { title: "Guest Lecture: Central Banking Explained", detail: "An economist walks through monetary policy with live data from our own markets.", date: "2026-02-10", label: "Guest Lecture" },
      { title: "Market Walk Field Trip", detail: "Visit a local market, interview three traders, and map the regulatory costs they face.", date: "2026-02-17", label: "Field Trip" },
      { title: "Economic Freedom Essay Contest", detail: "Submit 1,200 words on an economic freedom issue in your country. Winners announced in March.", date: "2026-02-26", label: "Contest" }
    ])
  },
  {
    title: "Free Speech on Campus",
    slug: "free-speech-on-campus",
    month_label: "March",
    year: 2026,
    featured: 0,
    published: 1,
    summary: "A month dedicated to the practice of open disagreement — the hardest and most important liberal skill.",
    description:
      "March challenges members to build real culture of free expression. Clubs audit their own speech environments, host difficult conversations, and practice the art of disagreeing well. Events include film screenings, open-mic nights, and a cross-campus panel with faculty.",
    activities: JSON.stringify([
      { title: "Speech Environment Audit", detail: "Clubs survey members: what can and cannot be said openly on campus? Results shared publicly.", date: "2026-03-05", label: "Research" },
      { title: "Film Screening & Discussion", detail: "Screen a documentary on censorship, followed by a moderated discussion.", date: "2026-03-12", label: "Film Night" },
      { title: "Open Mic: Ideas You Are Not Supposed to Say", detail: "Members give three-minute talks on positions they hold but rarely voice. Rules of respectful disagreement apply.", date: "2026-03-19", label: "Open Mic" },
      { title: "Faculty Panel: Academic Freedom in Practice", detail: "Lecturers and students discuss where academic freedom works and where it fails.", date: "2026-03-26", label: "Panel" }
    ])
  },
  {
    title: "Leadership & Character",
    slug: "leadership-and-character",
    month_label: "April",
    year: 2026,
    featured: 0,
    published: 1,
    summary: "Freedom needs builders. This month we focus on the character, habits, and skills of effective leaders.",
    description:
      "Ideas without builders stay in books. April develops the human side of leadership: integrity under pressure, clear communication, and the discipline to finish what you start. Every club runs a mentorship mixer and a community service project.",
    activities: JSON.stringify([
      { title: "Leadership Lab: Communication Under Pressure", detail: "Practical workshop on speaking clearly when the room is hostile.", date: "2026-04-02", label: "Workshop" },
      { title: "Mentorship Mixer", detail: "Alumni and professionals join for structured conversations about careers and character.", date: "2026-04-09", label: "Networking" },
      { title: "Community Project Day", detail: "Clubs execute a local service project — tutoring, cleanup, or book drives.", date: "2026-04-18", label: "Service" },
      { title: "Closing Symposium: The Leaders We Are Becoming", detail: "Members present lessons from the year and commitments for the term ahead.", date: "2026-04-25", label: "Symposium" }
    ])
  }
];

const DISCUSSIONS = [
  {
    title: "How do we keep club debates from becoming shouting matches?",
    type: "question",
    author_name: "Aisha Bello",
    author_email: "aisha@example.com",
    campus: "Ahmadu Bello University",
    pinned: 1,
    locked: 0,
    body: "Our last debate on tax policy ended with two members not speaking to each other for a week. We want spirited disagreement but need better rules. What procedures has worked for your club?",
    created_at: "2026-01-12T10:00:00.000Z",
    replies: [
      { author_name: "Kwame Mensah", body: "We assign a moderator who can interrupt anyone — including the president. Also: no sarcasm in the first five minutes of any response. Sounds small, changes everything.", created_at: "2026-01-12T12:30:00.000Z" },
      { author_name: "Zainab Aliyu", body: "Try the 'steelman round': before you rebut, you must restate your opponent's position until they agree you understood it. It feels slow and it works.", created_at: "2026-01-13T08:15:00.000Z" }
    ]
  },
  {
    title: "Is economic inequality a threat to a free society?",
    type: "opinion",
    author_name: "Daniel Otieno",
    author_email: "daniel@example.com",
    campus: "University of Nairobi",
    pinned: 0,
    locked: 0,
    body: "My view: extreme inequality is not inherently unjust, but it is politically dangerous. When people believe the game is rigged, they eventually reach for the state to flip the table — and everyone loses freedom in the process. Free societies survive by keeping genuine mobility visible and real. Curious what others think.",
    created_at: "2026-01-15T09:00:00.000Z",
    replies: [
      { author_name: "Thabo Dlamini", body: "Agree on the political danger, disagree on the framing. The enemy is not the gap itself but the barriers that create it — licensing, cronies, bad money. Fix the barriers and the gap becomes less fragile.", created_at: "2026-01-15T14:20:00.000Z" }
    ]
  },
  {
    title: "What books helped you understand sound money?",
    type: "question",
    author_name: "Grace Mwangi",
    author_email: "grace@example.com",
    campus: "University of Dar es Salaam",
    pinned: 0,
    locked: 0,
    body: "Inflation is eating my first salary and I want to understand why, not just complain. What is the one book or resource that made monetary policy click for you?",
    created_at: "2026-01-18T16:45:00.000Z",
    replies: [
      { author_name: "Thabo Dlamini", body: "Basic Economics by Sowell has a monetary chapter that takes one hour. After that, read any central bank's annual report for your country — the contrast is educational.", created_at: "2026-01-18T18:00:00.000Z" },
      { author_name: "Amara Okafor", body: "Also: follow a bread price in your neighborhood for a full year on your phone. No book makes inflation as real as your own spreadsheet.", created_at: "2026-01-19T07:30:00.000Z" }
    ]
  },
  {
    title: "Free speech should have limits — here is my honest case",
    type: "opinion",
    author_name: "Samuel Kofi",
    author_email: "samuel@example.com",
    campus: "University of Ghana",
    pinned: 0,
    locked: 0,
    body: "I believe in free speech, but I do not believe it is unlimited. Direct incitement to violence, targeted harassment of individuals, and deliberate defamation clearly cross lines. Where I get uncomfortable is how easily 'harm' gets stretched to mean 'I found that upsetting'. My proposal: narrow, explicit, written limits — and fierce protection for everything else.",
    created_at: "2026-01-21T11:10:00.000Z",
    replies: [
      { author_name: "Zainab Aliyu", body: "The written-limits proposal is the right instinct. The historical lesson is that vague rules always get enforced against the least popular speaker in the room.", created_at: "2026-01-21T13:00:00.000Z" },
      { author_name: "Aisha Bello", body: "Harassment is not speech — it is conduct. Once you separate those categories honestly, most of the paradox disappears.", created_at: "2026-01-22T09:45:00.000Z" }
    ]
  },
  {
    title: "How do you recruit members who stay after the first event?",
    type: "question",
    author_name: "Chidi Nwosu",
    author_email: "chidi@example.com",
    campus: "University of Nigeria, Nsukka",
    pinned: 0,
    locked: 0,
    body: "We get decent turnout for big events but almost nobody comes back. What retention practices actually work?",
    created_at: "2026-01-25T15:20:00.000Z",
    replies: [
      { author_name: "Kwame Mensah", body: "Give everyone a role before they leave the first event. Even a small one — photographer, note-taker, tea coordinator. Ownership beats enthusiasm.", created_at: "2026-01-25T17:00:00.000Z" },
      { author_name: "Chidi Nwosu", body: "Tried this at our next event — five people signed up for roles and four of them came back. Thank you!", created_at: "2026-01-27T10:05:00.000Z" }
    ]
  },
  {
    title: "Campus vendor fees are strangling student businesses",
    type: "opinion",
    author_name: "Fatima Sow",
    author_email: "fatima@example.com",
    campus: "Fourah Bay College",
    pinned: 0,
    locked: 0,
    body: "Our university charges student vendors a daily pitch fee that a first-year entrepreneur simply cannot cover. Meanwhile the same administration talks about 'youth empowerment'. I am drafting a proposal for a subsidized pilot zone. If anyone has done a similar campaign successfully, I would love your template.",
    created_at: "2026-01-28T08:00:00.000Z",
    replies: [
      { author_name: "Zainab Aliyu", body: "We ran an almost identical campaign — the winning move was a costed one-page memo plus three vendor testimonials. Happy to send the template.", created_at: "2026-01-28T11:30:00.000Z" }
    ]
  }
];

module.exports = { ARTICLES, TOPICS, DISCUSSIONS };
