/**
 * Job application, as HR receives it. The position leads — it is the only
 * thing that sorts one application from another. The reply button is the
 * visible half of the route's `replyTo`, not a second mechanism.
 */

import type { Vacancy } from "@/lib/careers";
import { site } from "@/lib/site";
import {
  FONT,
  SITE_URL,
  bytes,
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

export type ApplicationEmailInput = {
  /** Resolved by the route during validation, so it comes for free. */
  vacancy: Pick<Vacancy, "id" | "slug" | "title" | "category" | "employmentType">;
  name: string;
  email: string;
  phone: string;
  /** The optional "Anything else" box. Null when they left it empty. */
  message: string | null;
  /** Metadata only; the bytes ride as a real attachment. */
  cv: { name: string; size: number; type: string } | null;
  /** ISO 8601, as written by the route. */
  receivedAt: string;
};

export function applicationEmail(a: ApplicationEmailInput) {
  const roleUrl = `${SITE_URL}/careers?role=${encodeURIComponent(a.vacancy.slug)}`;
  const replyHref = `mailto:${a.email}?subject=${encodeURIComponent(
    `Your application for ${a.vacancy.title} — ${site.name}`,
  )}`;

  const subject = `New application — ${a.vacancy.title} — ${a.name}`;

  const preheader = a.cv
    ? `${a.vacancy.employmentType} · ${a.vacancy.category} — CV attached (${a.cv.name}, ${bytes(a.cv.size)})`
    : `${a.vacancy.employmentType} · ${a.vacancy.category} — no CV attached`;

  const body = `
              <p style="margin:0 0 24px; font-family:${FONT}; font-size:15px; line-height:1.65; color:${palette.body};">
                <strong style="color:${palette.navy};">${esc(a.name)}</strong> has applied through the careers page.${
                  a.cv ? " Their CV is attached to this email." : ""
                }
              </p>

${panel({
  label: "Position applied for",
  title: a.vacancy.title,
  href: roleUrl,
  chips: [a.vacancy.category, a.vacancy.employmentType],
})}

${heading("How to reach them")}
${rows([
  ["Name", `<strong style="color:${palette.navy};">${esc(a.name)}</strong>`],
  ["Email", mailtoLink(a.email)],
  ["Phone", telLink(a.phone)],
])}

${button(replyHref, `Reply to ${a.name.split(/\s+/)[0]}`)}

${a.message ? heading("In their own words") + quote(a.message) : ""}

${a.cv ? attachment(a.cv) : missingCv()}
`;

  const footnote = `Received ${esc(lagos(a.receivedAt))}. Sent automatically by the application form at <a href="${esc(roleUrl)}" style="color:${palette.muted}; text-decoration:underline;">avi-cenna.com/careers</a> — reply to this email and it goes to ${esc(a.name)}, not to the website. Filed under vacancy <strong style="color:${palette.body};">${esc(a.vacancy.id)}</strong>.`;

  return {
    subject,
    /** Who the send should say it is relayed for. */
    fromName: a.name,
    html: shell({
      preheader,
      eyebrow: "New job application",
      title: a.vacancy.title,
      body,
      footnote,
    }),
    text: plain(a, roleUrl),
  };
}

/* ---------------------------------------------------------------- parts -- */

function attachment(cv: NonNullable<ApplicationEmailInput["cv"]>) {
  return `${heading("Attached")}              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${palette.blueSoft}; border-radius:14px;">
                <tr>
                  <td width="56" style="width:56px; padding:16px 0 16px 16px; vertical-align:middle;">
                    <div style="width:40px; height:40px; line-height:40px; text-align:center; background-color:${palette.blueFaint}; border-radius:10px; font-size:20px;">&#128196;</div>
                  </td>
                  <td style="padding:16px 18px 16px 12px; vertical-align:middle; font-family:${FONT};">
                    <p style="margin:0; font-size:14px; font-weight:700; color:${palette.navy}; overflow-wrap:break-word; word-break:break-word;">${esc(cv.name)}</p>
                    <p style="margin:3px 0 0; font-size:12px; color:${palette.muted};">${esc(bytes(cv.size))}${cv.type ? ` &middot; ${esc(typeLabel(cv.type))}` : ""}</p>
                  </td>
                </tr>
              </table>
`;
}

/** Unreachable via the route, but a silent omission would read as "they
    didn't send one". */
function missingCv() {
  return `${heading("Attached")}              <p style="margin:0; font-family:${FONT}; font-size:14px; line-height:1.6; color:${palette.coral};">No CV came through with this application. Ask the applicant to send one, and check the server log — the form is not supposed to allow this.</p>
`;
}

const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word document",
};

function typeLabel(mime: string) {
  return TYPE_LABELS[mime] ?? mime;
}

/* ----------------------------------------------------------- plain text -- */

/** HTML-only multipart scores worse with spam filters, and this is what a
    screen reader and a watch notification actually get. */
function plain(a: ApplicationEmailInput, roleUrl: string) {
  const lines = [
    `NEW JOB APPLICATION — ${a.vacancy.title}`,
    `${a.vacancy.category} · ${a.vacancy.employmentType}`,
    "",
    `${a.name} has applied through the careers page.`,
    "",
    "HOW TO REACH THEM",
    `  Name    ${a.name}`,
    `  Email   ${a.email}`,
    `  Phone   ${a.phone}`,
  ];

  if (a.message) {
    lines.push("", "IN THEIR OWN WORDS", ...a.message.split(/\r?\n/).map((l) => `  ${l}`));
  }

  lines.push(
    "",
    "ATTACHED",
    a.cv ? `  ${a.cv.name} (${bytes(a.cv.size)})` : "  No CV came through with this application.",
    "",
    "—",
    `Received ${lagos(a.receivedAt)}.`,
    `Sent automatically by the application form at ${roleUrl}`,
    `Reply to this email and it goes to ${a.name}, not to the website.`,
    `Filed under vacancy ${a.vacancy.id}.`,
  );

  return lines.join("\n");
}
