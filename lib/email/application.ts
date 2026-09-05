/**
 * The email HR receives when someone applies through /careers.
 *
 * WHO THIS IS WRITTEN FOR. One person, opening a phone, deciding in about
 * four seconds whether this application is worth ten minutes now or ten
 * minutes on Friday. So the position leads — it is the only thing that sorts
 * one application from another — the contact details sit where a thumb can
 * hit them, and everything an HR system would want but a human would not
 * (the vacancy id, the exact byte count) is kept to the small print.
 *
 * WHY THERE IS NO "REPLY TO THE APPLICANT" WIRING HERE. The route sets
 * `replyTo` on the message to the applicant's address, so hitting reply in
 * any client goes to them and not to the noreply sender. The button below is
 * the visible half of that promise, not a second mechanism.
 *
 * Every interpolated value came from a stranger's keyboard, so every one of
 * them goes through esc()/escLines(). There is no exception to that in this
 * file and there should not be one in the next.
 */

import type { Vacancy } from "@/lib/careers";
import { site } from "@/lib/site";
import { FONT, SITE_URL, bytes, esc, escLines, lagos, palette, shell } from "./shell";

export type ApplicationEmailInput = {
  /** The resolved vacancy, not the raw slug — the route already looked it up
      to validate, so the title and category come for free. */
  vacancy: Pick<Vacancy, "id" | "slug" | "title" | "category" | "employmentType">;
  name: string;
  email: string;
  phone: string;
  /** The optional "Anything else" box. Null when they left it empty. */
  message: string | null;
  /** Metadata only — the bytes themselves ride as a real attachment. */
  cv: { name: string; size: number; type: string } | null;
  /** ISO 8601, as written by the route. */
  receivedAt: string;
};

export function applicationEmail(a: ApplicationEmailInput) {
  const roleUrl = `${SITE_URL}/careers?role=${encodeURIComponent(a.vacancy.slug)}`;
  const replyHref = `mailto:${a.email}?subject=${encodeURIComponent(
    `Your application for ${a.vacancy.title} — ${site.name}`,
  )}`;
  /** Anything a dialler cannot use is noise in a tel: href. */
  const telHref = `tel:${a.phone.replace(/[^\d+]/g, "")}`;

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

${panel(a, roleUrl)}

${heading("How to reach them")}
${rows([
  ["Name", `<strong style="color:${palette.navy};">${esc(a.name)}</strong>`],
  [
    "Email",
    `<a href="${esc(`mailto:${a.email}`)}" style="color:${palette.blue}; font-weight:600; text-decoration:underline;">${esc(a.email)}</a>`,
  ],
  [
    "Phone",
    `<a href="${esc(telHref)}" style="color:${palette.blue}; font-weight:600; text-decoration:underline;">${esc(a.phone)}</a>`,
  ],
])}

${button(replyHref, `Reply to ${a.name.split(/\s+/)[0]}`)}

${a.message ? note(a) : ""}

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

/** The position, set apart in a tinted panel. It leads because it is the one
    field that decides who in the office this belongs to. */
function panel(a: ApplicationEmailInput, roleUrl: string) {
  const chips = [a.vacancy.category, a.vacancy.employmentType]
    .map(
      (label) =>
        `<span style="display:inline-block; padding:5px 11px; margin:0 6px 6px 0; background-color:${palette.card}; border:1px solid ${palette.blueSoft}; border-radius:999px; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:0.04em; color:${palette.navy};">${esc(label)}</span>`,
    )
    .join("");

  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${palette.blueFaint}; border:1px solid ${palette.blueSoft}; border-radius:14px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px; font-family:${FONT}; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:${palette.muted};">Position applied for</p>
                    <p style="margin:0 0 12px; font-family:${FONT}; font-size:19px; line-height:1.3; font-weight:800; letter-spacing:-0.01em; color:${palette.navy};">
                      <a href="${esc(roleUrl)}" style="color:${palette.navy}; text-decoration:none;">${esc(a.vacancy.title)}</a>
                    </p>
                    ${chips}
                  </td>
                </tr>
              </table>
`;
}

function heading(text: string) {
  return `              <p style="margin:28px 0 14px; font-family:${FONT}; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:${palette.muted};">${esc(text)}</p>
`;
}

/** Label/value pairs. The label column is fixed so the values line up; on a
    phone the media query stacks them, because 150px of label next to a long
    email address wraps into porridge. */
function rows(pairs: [string, string][]) {
  const cells = pairs
    .map(
      ([label, value]) => `                <tr>
                  <td class="sm-stack" width="120" style="width:120px; padding:0 0 14px; vertical-align:top; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:${palette.muted};">${esc(label)}</td>
                  <td class="sm-stack-v" style="padding:0 0 14px; vertical-align:top; font-family:${FONT}; font-size:15px; line-height:1.5; color:${palette.body};">${value}</td>
                </tr>`,
    )
    .join("\n");

  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${cells}
              </table>
`;
}

/** A real link styled as a button — no <button>, which does nothing in mail.
    Padding on the anchor rather than the cell so the whole pill is the tap
    target in clients that ignore display:inline-block. */
function button(href: string, label: string) {
  return `              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
                <tr>
                  <td style="background-color:${palette.coral}; border-radius:999px;">
                    <a href="${esc(href)}" style="display:inline-block; padding:13px 26px; font-family:${FONT}; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">${esc(label)}</a>
                  </td>
                </tr>
              </table>
`;
}

/** The "Anything else" box. Quoted rather than run into the page, so it is
    always clear which words are the applicant's and which are the school's. */
function note(a: ApplicationEmailInput) {
  return `${heading("In their own words")}              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:2px 0 2px 18px; border-left:3px solid ${palette.blueSoft}; font-family:${FONT}; font-size:15px; line-height:1.7; color:${palette.body};">${escLines(a.message!)}</td>
                </tr>
              </table>
`;
}

function attachment(cv: NonNullable<ApplicationEmailInput["cv"]>) {
  return `${heading("Attached")}              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${palette.blueSoft}; border-radius:14px;">
                <tr>
                  <td width="56" style="width:56px; padding:16px 0 16px 16px; vertical-align:middle;">
                    <div style="width:40px; height:40px; line-height:40px; text-align:center; background-color:${palette.blueFaint}; border-radius:10px; font-size:20px;">&#128196;</div>
                  </td>
                  <td style="padding:16px 18px 16px 12px; vertical-align:middle; font-family:${FONT};">
                    <p style="margin:0; font-size:14px; font-weight:700; color:${palette.navy}; overflow-wrap:break-word; word-break:break-word;">${esc(cv.name)}</p>
                    <p style="margin:3px 0 0; font-size:12px; color:${palette.muted};">${esc(bytes(cv.size))}${cv.type ? ` &middot; ${esc(label(cv.type))}` : ""}</p>
                  </td>
                </tr>
              </table>
`;
}

/** Should not happen — the route rejects an application without a CV — but a
    silent omission here would read as "they didn't send one", which is a
    different and much worse thing to tell HR. */
function missingCv() {
  return `${heading("Attached")}              <p style="margin:0; font-family:${FONT}; font-size:14px; line-height:1.6; color:${palette.coral};">No CV came through with this application. Ask the applicant to send one, and check the server log — the form is not supposed to allow this.</p>
`;
}

const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word document",
};

function label(mime: string) {
  return TYPE_LABELS[mime] ?? mime;
}

/* ----------------------------------------------------------- plain text -- */

/**
 * The text/plain alternative, sent alongside the HTML.
 *
 * Not a courtesy. A multipart message with only an HTML part scores worse
 * with spam filters than one with both, and this is the version that shows up
 * in a watch notification, a screen reader, and any client with images and
 * styling turned off — which is a lot of school IT departments.
 */
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
