/**
 * Contact enquiry, as the office receives it. The subject leads because it is
 * the only sorting key an enquiry has — which is why the field is required.
 * The message gets room rather than a footnote; it is the point.
 */

import { site } from "@/lib/site";
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

export type EnquiryEmailInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** ISO 8601, as written by the route. */
  receivedAt: string;
};

export function enquiryEmail(e: EnquiryEmailInput) {
  const replyHref = `mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject}`)}`;


  const subject = `Enquiry — ${e.subject} — ${e.name}`;

  /* Opens with the message, so the preview is not the subject twice. */
  const preheader = e.message.replace(/\s+/g, " ").slice(0, 140);

  const body = `
              <p style="margin:0 0 24px; font-family:${FONT}; font-size:15px; line-height:1.65; color:${palette.body};">
                <strong style="color:${palette.navy};">${esc(e.name)}</strong> sent a message through the contact form.
              </p>

${panel({ label: "Subject", title: e.subject })}

${heading("Their message")}
${quote(e.message)}

${heading("How to reach them")}
${rows([
  ["Name", `<strong style="color:${palette.navy};">${esc(e.name)}</strong>`],
  ["Email", mailtoLink(e.email)],
  ["Phone", telLink(e.phone)],
])}

${button(replyHref, `Reply to ${e.name.split(/\s+/)[0]}`)}
`;

  const footnote = `Received ${esc(lagos(e.receivedAt))}. Sent automatically by the form at <a href="${esc(`${SITE_URL}/contact`)}" style="color:${palette.muted}; text-decoration:underline;">avi-cenna.com/contact</a> — reply to this email and it goes to ${esc(e.name)}, not to the website. The page promises an answer within a working day.`;

  return {
    subject,
    fromName: e.name,
    html: shell({
      preheader,
      eyebrow: `Message for ${site.shortName}`,
      title: e.subject,
      body,
      footnote,
    }),
    text: plain(e),
  };
}

function plain(e: EnquiryEmailInput) {
  return [
    `ENQUIRY — ${e.subject}`,
    "",
    `${e.name} sent a message through the contact form.`,
    "",
    "THEIR MESSAGE",
    ...e.message.split(/\r?\n/).map((l) => `  ${l}`),
    "",
    "HOW TO REACH THEM",
    `  Name    ${e.name}`,
    `  Email   ${e.email}`,
    `  Phone   ${e.phone}`,
    "",
    "—",
    `Received ${lagos(e.receivedAt)}.`,
    `Sent automatically by the form at ${SITE_URL}/contact`,
    `Reply to this email and it goes to ${e.name}, not to the website.`,
  ].join("\n");
}
