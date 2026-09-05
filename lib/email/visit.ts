/**
 * Visit request, as the office receives it. The date leads because it is the
 * only field that decides anything. The wording says "request" throughout —
 * read as a booking, it ends with a family at a locked gate.
 */

import { site } from "@/lib/site";
import { formatVisitDate, slotLabel } from "@/lib/visits";
import {
  FONT,
  SITE_URL,
  button,
  esc,
  heading,
  lagos,
  mailtoLink,
  palette,
  panel,
  quote,
  rows,
  shell,
  telLink,
} from "./shell";

export type VisitEmailInput = {
  name: string;
  email: string;
  phone: string;
  /** YYYY-MM-DD, already validated as a weekday inside the horizon. */
  date: string;
  /** "morning" | "afternoon" — validated by the route. */
  slot: string;
  message: string | null;
  /** ISO 8601, as written by the route. */
  receivedAt: string;
};

export function visitEmail(v: VisitEmailInput) {
  const when = formatVisitDate(v.date);
  const slot = slotLabel(v.slot);

  const replyHref = `mailto:${v.email}?subject=${encodeURIComponent(
    `Your visit to ${site.name}`,
  )}`;

  const subject = `Visit request — ${when} — ${v.name}`;
  const preheader = `${slot}. ${v.name} · ${v.phone} — not yet confirmed.`;

  const body = `
              <p style="margin:0 0 24px; font-family:${FONT}; font-size:15px; line-height:1.65; color:${palette.body};">
                <strong style="color:${palette.navy};">${esc(v.name)}</strong> would like to visit the school. Confirm the time with them — nothing is booked until you do.
              </p>

${panel({ label: "Requested for", title: when, chips: [slot] })}

${heading("How to reach them")}
${rows([
  ["Name", `<strong style="color:${palette.navy};">${esc(v.name)}</strong>`],
  ["Email", mailtoLink(v.email)],
  ["Phone", telLink(v.phone)],
])}

${button(replyHref, `Reply to ${v.name.split(/\s+/)[0]}`)}

${v.message ? heading("What they told us") + quote(v.message) : ""}
`;

  const footnote = `Received ${esc(lagos(v.receivedAt))}. Sent automatically by the form at <a href="${esc(`${SITE_URL}/book-visit`)}" style="color:${palette.muted}; text-decoration:underline;">avi-cenna.com/book-visit</a> — reply to this email and it goes to ${esc(v.name)}, not to the website. This is a request for a preferred day, not a confirmed appointment.`;

  return {
    subject,
    fromName: v.name,
    html: shell({
      preheader,
      eyebrow: "Visit request",
      title: when,
      body,
      footnote,
    }),
    text: plain(v, when, slot),
  };
}

function plain(v: VisitEmailInput, when: string, slot: string) {
  const lines = [
    `VISIT REQUEST — ${when}`,
    slot,
    "",
    `${v.name} would like to visit the school.`,
    "Confirm the time with them — nothing is booked until you do.",
    "",
    "HOW TO REACH THEM",
    `  Name    ${v.name}`,
    `  Email   ${v.email}`,
    `  Phone   ${v.phone}`,
  ];

  if (v.message) {
    lines.push("", "WHAT THEY TOLD US", ...v.message.split(/\r?\n/).map((l) => `  ${l}`));
  }

  lines.push(
    "",
    "—",
    `Received ${lagos(v.receivedAt)}.`,
    `Sent automatically by the form at ${SITE_URL}/book-visit`,
    `Reply to this email and it goes to ${v.name}, not to the website.`,
    "This is a request for a preferred day, not a confirmed appointment.",
  );

  return lines.join("\n");
}
