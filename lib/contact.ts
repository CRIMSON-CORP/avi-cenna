/**
 * Content for /contact.
 *
 * The old page was a single textarea, a Submit button and a map that failed to
 * load. Everything a person actually needed — who to call, when the office is
 * open, how to get there — sat in a column beside it as unlinked text.
 *
 * Details are read from lib/site.ts rather than retyped, so the address and
 * the phone numbers cannot end up saying one thing in the footer and another
 * here.
 */

import { site } from "./site";

export const contactHero = {
  eyebrow: "Contact",
  headline: { light: "Come and see us,", bold: "or just say hello." },
  body: "The school operates an open-door policy — you are welcome on any ordinary school day. Call, write, or send the form and the office will come back to you.",
} as const;

/* --------------------------------------------------------------- DETAILS -- */

export type Detail = {
  label: string;
  /** Lines of the value. More than one for the address and the phones. */
  lines: readonly { text: string; href?: string }[];
  /** Optional action under the value. */
  action?: { label: string; href: string; external?: boolean };
};

/** Opens the address in whatever map app the visitor actually uses, rather
    than embedding one provider's iframe and its tracking in the page. */
const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.address,
)}`;

export const contactDetails: Detail[] = [
  {
    label: "Where we are",
    lines: [{ text: site.address }],
    action: { label: "Get directions", href: directions, external: true },
  },
  {
    label: "Call us",
    lines: site.phones.map((phone) => ({
      text: phone,
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
    })),
  },
  {
    label: "Write to us",
    lines: [{ text: site.email, href: `mailto:${site.email}` }],
  },
  {
    label: "Office hours",
    lines: [{ text: "Monday to Friday, 8:00am – 3:00pm" }],
  },
];

/* ------------------------------------------------------------------ FORM -- */

export const enquiryForm = {
  heading: "Send us a message",
  note: "We answer during office hours, usually within a working day.",
  fields: {
    name: { label: "Your name", placeholder: "Adaeze Okonkwo" },
    email: { label: "Your email", placeholder: "you@example.com" },
    phone: { label: "Phone number", placeholder: "081 8444 5444" },
    subject: { label: "Subject", placeholder: "Admission for my daughter" },
    message: { label: "Your message", placeholder: "Tell us what you would like to know." },
  },
  submit: "Send message",
  sending: "Sending…",
  /* Said in the interface's own voice, and specific about what happens next
     rather than congratulating the sender on having clicked a button. */
  sent: {
    heading: "Message sent.",
    body: "The office has it. Someone will reply to the address you gave, usually within a working day.",
    again: "Send another",
  },
  failed: "The message could not be sent. Try again, or call the office on the number beside this form.",
} as const;
