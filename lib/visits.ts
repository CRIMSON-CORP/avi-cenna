/**
 * Content and date rules for /book-visit.
 *
 * The form and the route import the same validators, so "weekdays only, from
 * tomorrow, within three months" is stated once.
 */

import { site } from "./site";

export const visitHero = {
  eyebrow: "Book a visit",
  headline: { light: "Come and see", bold: "an ordinary day." },
  body: "No rehearsed tour and no appointment theatre. Tell us when suits you, and we will show you the school as it actually runs — lessons in progress, the grounds in use, children who have not been told to look busy.",
  facts: ["Monday to Friday", "8:00am – 3:00pm", "Ages 2½ to 16"],
} as const;

export const visitExpect = {
  eyebrow: "What happens",
  heading: "An hour, roughly.",
  items: [
    {
      title: "A walk through the school",
      body: "Classrooms while they are being taught in, the library, the laboratories and the grounds. You will see the year group your child would join.",
    },
    {
      title: "Time with the Registrar",
      body: "Fees, term dates, the admission procedure, and whatever else you want to ask. Bring the awkward questions — they are the useful ones.",
    },
    {
      title: "No commitment",
      body: "A visit is not an application. Plenty of families visit twice before deciding, and plenty decide we are not the right school. Both are fine.",
    },
  ],
} as const;

/* ----------------------------------------------------------------- FORM -- */

export const visitForm = {
  id: "book",
  eyebrow: "Request a visit",
  heading: "Tell us when suits you.",
  body: "Pick a day and whether mornings or afternoons work better. The office will confirm the time with you — we do not hold the slot until they have.",
  fields: {
    name: { label: "Your name", placeholder: "Adaeze Okonkwo" },
    email: { label: "Email address", placeholder: "you@example.com" },
    phone: { label: "Phone number", placeholder: "081 8444 5444" },
    date: { label: "Preferred date", hint: "Weekdays only, from tomorrow onwards." },
    slot: { label: "Time of day" },
    reason: { label: "What is the visit about?", placeholder: "Choose one" },
    message: { label: "Anything we should know", placeholder: "Ages of your children, which year group you are asking about, anything you would like to see." },
  },
  submit: "Request a visit",
  sending: "Sending…",
  sent: {
    heading: "Request sent.",
    body: "The office has it and will call or write to confirm a time, usually within a working day. Nothing is booked until they do.",
    again: "Request another visit",
  },
  failure:
    "Something went wrong sending your request. Please try again, or call the school on " +
    site.phones[0] +
    ".",
  /** Shown under the form, for anyone who would rather not use it. */
  email: "bookavisit@avi-cenna.com",
} as const;

/* ----------------------------------------------------------- TIME OF DAY -- */
/* Half-days, not slots: nothing here can see the school's calendar, so
   offering 10:30 would promise a time we cannot hold. */

export type VisitSlot = (typeof VISIT_SLOTS)[number]["value"];

export const VISIT_SLOTS = [
  { value: "morning", label: "Morning", detail: "8:00am – 12:00pm" },
  { value: "afternoon", label: "Afternoon", detail: "12:00pm – 3:00pm" },
] as const;

export function slotLabel(value: string) {
  const slot = VISIT_SLOTS.find((s) => s.value === value);
  return slot ? `${slot.label} (${slot.detail})` : value;
}

export function isVisitSlot(value: string): value is VisitSlot {
  return VISIT_SLOTS.some((s) => s.value === value);
}

/* --------------------------------------------------------------- REASON -- */
/* Why they are coming, or who they are hoping to see. The office reads this
   to work out who needs to be free, so it is a fixed list rather than free
   text. Stored as slugs: the wording can be reworded later without making
   nonsense of what has already been sent. */

export type VisitReason = (typeof VISIT_REASONS)[number]["value"];

export const VISIT_REASONS = [
  { value: "enquiry", label: "Enquiry" },
  { value: "admission", label: "Admission" },
  { value: "eyfs-teacher", label: "EYFS teacher" },
  { value: "primary-teacher", label: "Primary teacher" },
  { value: "secondary-teacher", label: "Secondary teacher" },
  { value: "principal", label: "Principal" },
  { value: "head-of-primary", label: "Head of Primary" },
  { value: "other", label: "Others" },
] as const;

export function isVisitReason(value: string): value is VisitReason {
  return VISIT_REASONS.some((r) => r.value === value);
}

export function reasonLabel(value: string) {
  return VISIT_REASONS.find((r) => r.value === value)?.label ?? value;
}

/* ---------------------------------------------------------------- DATES -- */

/** Beyond a term the school cannot say anything useful about staffing. */
const HORIZON_DAYS = 90;

/** Today in Lagos as YYYY-MM-DD. The server runs UTC, so for the hour
    before midnight the two disagree about the date. en-CA formats as ISO. */
export function lagosToday(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Anchored at midday UTC so a shift cannot cross a date boundary. */
function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 is Sunday, 6 is Saturday. */
function weekday(iso: string) {
  return new Date(`${iso}T12:00:00Z`).getUTCDay();
}

/** min is tomorrow, not today: a 2:55pm request for a 3pm visit is not one
    anybody can honour. */
export function visitDateBounds(now: Date = new Date()) {
  const today = lagosToday(now);
  return { min: addDays(today, 1), max: addDays(today, HORIZON_DAYS) };
}

/** Error message, or null. Shared by the form and the route. */
export function validateVisitDate(value: string, now: Date = new Date()): string | null {
  if (!value) return "Choose a date.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "That is not a date we can read.";

  /* 2026-02-31 passes the pattern and is not a day. */
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    return "That is not a date we can read.";
  }

  const { min, max } = visitDateBounds(now);
  if (value < min) return "Choose a date from tomorrow onwards.";
  if (value > max) return "That is too far ahead — pick a date within the next three months.";

  const day = weekday(value);
  if (day === 0 || day === 6) return "The school is open on weekdays. Choose Monday to Friday.";

  return null;
}

/** Long form, in the school's timezone, for the email. */
export function formatVisitDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`));
}
