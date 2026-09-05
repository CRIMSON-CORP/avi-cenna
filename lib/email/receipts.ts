/**
 * Confirmations sent to the person who used a form. Separate from the
 * staff-facing templates because the rules differ: no internal metadata, no
 * `fromName` (the school really is the sender), no `replyTo` (From already
 * owns the conversation), and no promise the school has not made — the visit
 * receipt says the date is not confirmed, because it is not.
 */

import { directions, site } from "@/lib/site";
import { formatVisitDate, slotLabel } from "@/lib/visits";
import type { ApplicationEmailInput } from "./application";
import type { EnquiryEmailInput } from "./enquiry";
import type { VisitEmailInput } from "./visit";
import {
  FONT,
  SITE_URL,
  esc,
  firstName,
  heading,
  palette,
  panel,
  quote,
  shell,
} from "./shell";

/** A paragraph in the body, so the three below stay consistent. */
function para(html: string, top = 0) {
  return `              <p style="margin:${top}px 0 18px; font-family:${FONT}; font-size:15px; line-height:1.7; color:${palette.body};">${html}</p>
`;
}

/** Names the school in words; the From line is not always shown. */
function signoff(extra?: string) {
  return `              <p style="margin:26px 0 0; padding-top:22px; border-top:1px solid ${palette.blueSoft}; font-family:${FONT}; font-size:14px; line-height:1.7; color:${palette.body};">
                ${extra ? `${extra}<br /><br />` : ""}— ${esc(site.name)}
              </p>
`;
}

/** How to reach a human, and that this one was automatic. */
function footnote(purpose: string) {
  return `This is an automatic confirmation that your ${esc(purpose)} reached us — you do not need to reply to it. If you need to reach someone, call ${esc(site.phones[0])} or reply to this email and it will land in the right inbox.`;
}

/* -------------------------------------------------------- APPLICATION -- */

export function applicationReceipt(a: ApplicationEmailInput) {
  const body = `
${para(`Thank you, <strong style="color:${palette.navy};">${esc(firstName(a.name))}</strong>. Your application has reached us and is with the people who read them.`)}

${panel({ label: "You applied for", title: a.vacancy.title, chips: [a.vacancy.category, a.vacancy.employmentType] })}

${heading("What happens next")}
${para("Every application is read. If you are shortlisted someone will contact you on the details you gave us — usually within two weeks, and sooner when a position is urgent. If you do not hear from us, the post has been filled or gone to someone whose experience fitted it more closely; it is not a comment on your application.")}
${a.cv ? para(`We received your CV as <strong style="color:${palette.navy};">${esc(a.cv.name)}</strong>. There is nothing further to send.`) : ""}

${signoff("You are welcome to visit the school before or after applying — the open-door policy applies to prospective staff too.")}
`;

  return {
    subject: `We have your application — ${a.vacancy.title}`,
    html: shell({
      preheader: `Your application for ${a.vacancy.title} reached us. Nothing further to send.`,
      eyebrow: "Application received",
      title: "Thank you for applying.",
      body,
      footnote: footnote("application"),
    }),
    text: [
      `APPLICATION RECEIVED — ${a.vacancy.title}`,
      "",
      `Thank you, ${firstName(a.name)}. Your application has reached us and is with`,
      "the people who read them.",
      "",
      "WHAT HAPPENS NEXT",
      "Every application is read. If you are shortlisted someone will contact you",
      "on the details you gave us, usually within two weeks.",
      a.cv ? `\nWe received your CV as ${a.cv.name}. There is nothing further to send.` : "",
      "",
      `— ${site.name}`,
      `${site.address}`,
      `${site.phones.join(" · ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

/* -------------------------------------------------------------- VISIT -- */

export function visitReceipt(v: VisitEmailInput) {
  const when = formatVisitDate(v.date);

  const body = `
${para(`Thank you, <strong style="color:${palette.navy};">${esc(firstName(v.name))}</strong>. We have your request to visit the school.`)}

${panel({ label: "You asked for", title: when, chips: [slotLabel(v.slot)] })}

${heading("This is not confirmed yet")}
${para("The office will call or write to agree a time with you, usually within a working day. Please wait for that before setting out — we would rather you did not make the journey on a day we cannot give you our attention.")}

${heading("When it is confirmed")}
${para(`We are at ${esc(site.address)}. <a href="${esc(directions.href)}" style="color:${palette.blue}; font-weight:600; text-decoration:underline;">Directions</a>. Ask for the Registrar at reception — allow about an hour, and bring any questions about fees, term dates or the admission procedure.`)}

${signoff("If your plans change, just reply to this email and tell us.")}
`;

  return {
    subject: `Your visit request — ${when}`,
    html: shell({
      preheader: `${slotLabel(v.slot)}. We will confirm the time with you — nothing is booked yet.`,
      eyebrow: "Visit request received",
      title: "We have your request.",
      body,
      footnote: footnote("visit request"),
    }),
    text: [
      `VISIT REQUEST RECEIVED — ${when}`,
      slotLabel(v.slot),
      "",
      `Thank you, ${firstName(v.name)}. We have your request to visit the school.`,
      "",
      "THIS IS NOT CONFIRMED YET",
      "The office will call or write to agree a time with you, usually within a",
      "working day. Please wait for that before setting out.",
      "",
      "WHEN IT IS CONFIRMED",
      `We are at ${site.address}.`,
      "Ask for the Registrar at reception. Allow about an hour.",
      "",
      `— ${site.name}`,
      `${site.phones.join(" · ")}`,
    ].join("\n"),
  };
}

/* ------------------------------------------------------------ ENQUIRY -- */

export function enquiryReceipt(e: EnquiryEmailInput) {
  const body = `
${para(`Thank you, <strong style="color:${palette.navy};">${esc(firstName(e.name))}</strong>. Your message is with the school office.`)}

${panel({ label: "You wrote about", title: e.subject })}

${heading("What happens next")}
${para(`Someone will reply to this address during office hours — Monday to Friday, 8:00am to 3:00pm — usually within a working day. If it is urgent, call ${esc(site.phones[0])} rather than waiting.`)}

${heading("What you sent us")}
${quote(e.message)}

${signoff()}
`;

  return {
    subject: `We have your message — ${e.subject}`,
    html: shell({
      preheader: "Someone will reply within a working day.",
      eyebrow: "Message received",
      title: "Thank you for writing.",
      body,
      footnote: footnote("message"),
    }),
    text: [
      `MESSAGE RECEIVED — ${e.subject}`,
      "",
      `Thank you, ${firstName(e.name)}. Your message is with the school office.`,
      "",
      "WHAT HAPPENS NEXT",
      "Someone will reply to this address during office hours, Monday to Friday,",
      `8:00am to 3:00pm, usually within a working day. If it is urgent, call`,
      `${site.phones[0]} rather than waiting.`,
      "",
      "WHAT YOU SENT US",
      ...e.message.split(/\r?\n/).map((l) => `  ${l}`),
      "",
      `— ${site.name}`,
      `${site.address}`,
      `${SITE_URL}`,
    ].join("\n"),
  };
}
