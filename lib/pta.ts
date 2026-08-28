/**
 * Content for /about/pta.
 *
 * The old site's Parent-Teacher Association page, which was three short lists
 * and a banner. The lists carry more than they look: the six posts are split
 * deliberately between parent members and teacher members, and the class
 * representatives are *appointed* where the six are *elected*. Both of those
 * distinctions are the school's own, and both are load-bearing on this page —
 * see components/sections/pta/Committee.tsx, which draws them rather than
 * explaining them.
 *
 * Same rule as lib/about.ts: the framing copy is written in the site's voice,
 * but the electoral procedure and the three closing notes stay close to the
 * school's own wording. They read as constitutional, and softening a sentence
 * like "shall not seek to interfere" would quietly change what it means.
 */

/* ------------------------------------------------------------- HERO ------ */

export const ptaHero = {
  eyebrow: "Parent-Teacher Association",
  /** The page's whole argument, and the metaphor the committee section pays
      off: a PTA is people who sit down together. */
  headline: { light: "Parents and teachers,", bold: "at the same table." },
  body: "A volunteer forum for the people who between them make up a school day. It exists to keep parents and teachers on speaking terms, to take pride in what the school does well, and to organise the events — and raise the funds — that a school year runs on.",
  facts: ["Six elected posts", "Three parents, three teachers", "Selected at the AGM"],
} as const;

/* ------------------------------------------------------------ PORTRAIT --- */

export const ptaPortrait = {
  src: "/images/pta.jpg",
  alt: "Parents and members of staff of Avi-Cenna International School standing together on the steps at the school entrance, several with a finger raised",
  /** Says what is in the frame and nothing more — the occasion is not
      recorded anywhere we can check, and a caption should not invent one. */
  caption: "Parents and staff at the school entrance.",
} as const;

/* -------------------------------------------------------------- PURPOSE -- */
/* The school's three purposes, kept as written, each given the name of the
   thing it is actually about. The label is the addition; the sentence is
   theirs. */

export const ptaPurpose = {
  id: "purpose",
  eyebrow: "What it's for",
  heading: "Three jobs, and one condition.",
  aims: [
    {
      label: "Relations",
      body: "Fostering good relations between parents and teachers.",
    },
    {
      label: "Pride",
      body: "Encouraging a spirit of cooperation and pride in the accomplishments of the School.",
    },
    {
      label: "Events and funds",
      body: "Assisting in organising special events, and helping to raise funds for the School.",
    },
  ],
  /** The condition. Worth stating plainly rather than burying: a volunteer
      body is only ever as full as its volunteers. */
  condition:
    "What the association actually does in a given year follows the parents who take part in it. The elected committee meets regularly right through the school year, and the programme is whatever those parents care enough to run.",
} as const;

/* ------------------------------------------------------------- ELECTION -- */
/* A real sequence — applications, then vetting, then the AGM — which is why
   this is the one section on the page that is numbered. */

export const ptaElection = {
  id: "election",
  eyebrow: "How the committee is chosen",
  heading: "Applications, vetting, then the AGM.",
  steps: [
    {
      title: "The School invites applications",
      body: "Member parents are invited to apply for posts on the Executive Committee of the PTA.",
    },
    {
      title: "The School vets them",
      body: "The School reserves the right to vet all applications before any name goes forward.",
    },
    {
      title: "The AGM selects",
      body: "Names are submitted to the Annual General Meeting, and the meeting makes the selection.",
    },
  ],
} as const;

/* ------------------------------------------------------------ COMMITTEE -- */

export type Seat = {
  post: string;
  /** Which side of the association holds the post. */
  held: "parent" | "teacher";
};

export const ptaCommittee = {
  id: "committee",
  eyebrow: "The committee",
  heading: "Six seats, evenly split.",
  body: "Three posts are held by parent members and three by teacher members, so neither side of the association can carry a meeting on its own.",
  /** The school's own order, which alternates rather than grouping the two
      sides — worth keeping, because it is how the posts are listed to the
      parents who stand for them. */
  seats: [
    { post: "Chairperson", held: "parent" },
    { post: "Vice-Chairperson", held: "parent" },
    { post: "Secretary", held: "teacher" },
    { post: "Assistant Secretary", held: "teacher" },
    { post: "Treasurer", held: "parent" },
    { post: "Financial Secretary", held: "teacher" },
  ] satisfies Seat[],
  held: { parent: "Parent member", teacher: "Teacher member" },
  /** Not one of the six: a class representative is appointed rather than
      elected, and the seat exists whether or not a year group fills it. */
  classRep: {
    post: "Class Representative",
    note: "One per year group, appointed — a seat that exists whether or not a year group takes it up.",
  },
} as const;

/* ---------------------------------------------------------------- REMIT -- */
/* The three notes from the foot of the old page, close to verbatim. They are
   the last word on the page by design: the association's remit is bounded,
   and the school states the boundary itself. */

export const ptaRemit = {
  id: "remit",
  eyebrow: "Where it stops",
  heading: "An advisory body.",
  body: "The association advises. It does not administer, and it does not write policy — the school sets that out plainly, and so do we.",
  notes: [
    "The PTA is an advisory body.",
    "The PTA shall not seek to interfere in the day to day running of the School.",
    "The designing of all School policies is strictly the responsibility of the School Board and the School Management.",
  ],
} as const;
