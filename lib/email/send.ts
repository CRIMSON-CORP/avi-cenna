/**
 * SMTP client, one authenticated connection per mailbox.
 *
 * A host only lets an account send as itself, so From follows the login — it
 * is not a field callers may set. Each form owns a mailbox so confirmations
 * to the public come from the right address. Pools are built on first use, so
 * a mailbox with no password yet breaks only the form that needs it.
 *
 * SMTP_HOST must be the school's mail host, never localhost: the domain's SPF
 * record vouches for that host and distrusts everything else.
 */

import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

/** The school mailboxes the site can send as. One per form. */
export type Mailbox = "careers" | "visits" | "enquiries";

export type Mail = {
  /** Which account signs in, and therefore the From address. No default:
      the wrong one is invisible until a stranger gets it. */
  mailbox: Mailbox;
  to: string;
  /** Relays as "Their Name (via <mailbox>)". Staff-facing mail only. */
  fromName?: string;
  subject: string;
  html: string;
  text: string;
  /** Where a reply should go — the applicant, not this mailbox. */
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

/* --------------------------------------------------------------- config -- */

/** Same host for all three, so only credentials differ. */
const MAILBOXES: Record<Mailbox, { prefix: string; name: string }> = {
  careers: { prefix: "MAILBOX_CAREERS", name: "Avi-Cenna Careers" },
  visits: { prefix: "MAILBOX_VISITS", name: "Avi-Cenna Admissions" },
  enquiries: { prefix: "MAILBOX_ENQUIRIES", name: site.name },
};

type Config = {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
};

function readConfig(mailbox: Mailbox): Config {
  const { prefix, name } = MAILBOXES[mailbox];
  const keys = ["SMTP_HOST", "SMTP_PORT", `${prefix}_USER`, `${prefix}_PASS`];

  /* All of them at once, and named. Finding out about a missing variable one
     deploy at a time is a miserable way to configure a server, and with three
     mailboxes there are three times as many chances to miss one. */
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `The ${mailbox} mailbox is not configured — set ${missing.join(", ")} ` +
        `in the environment. See .env.example for what each one is.`,
    );
  }

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`SMTP_PORT must be a port number, got "${process.env.SMTP_PORT}".`);
  }

  return {
    host: process.env.SMTP_HOST!,
    port,
    user: process.env[`${prefix}_USER`]!,
    pass: process.env[`${prefix}_PASS`]!,
    name: process.env[`${prefix}_NAME`] || name,
  };
}

/* ------------------------------------------------------------ transport -- */

/** Pooled per mailbox: a TLS handshake per submission is slow and trips
    connection-rate limits on shared hosts. Two each — three pools already
    means six sockets against one server. */
const pools = new Map<Mailbox, Transporter>();

function transport(mailbox: Mailbox, config: Config) {
  const existing = pools.get(mailbox);
  if (existing) return existing;

  const created = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    /* 465 is TLS from the first byte; everything else upgrades via
       STARTTLS. Derived, because a separate flag only ever gets set wrong. */
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    pool: true,
    maxConnections: 2,
    /* Shared hosts go away mid-handshake; without these the request hangs
       and the visitor watches a spinner. */
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  pools.set(mailbox, created);
  return created;
}

/* --------------------------------------------------------------- sending -- */

/** Header injection guard. Nodemailer encodes correctly on its own; this
    is the second lock, because every value here came off a public form. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Capped so a pasted essay cannot push the address out of the inbox
    column. */
function safeName(name: string) {
  return oneLine(name).slice(0, 60).trim();
}

function safeFilename(name: string) {
  return oneLine(name).replace(/[\\/]/g, "-").slice(0, 200) || "attachment";
}

/** Sends or throws — never swallows. The caller decides what to tell the
    person waiting, and cannot if a failure looks like success here. */
export async function sendMail(mail: Mail) {
  const config = readConfig(mail.mailbox);

  /* "Adaeze Okonkwo (via Avi-Cenna Careers)": staff see who wrote in, the
     address stays ours. Omitted on public mail. */
  const person = mail.fromName ? safeName(mail.fromName) : "";
  const fromName = person ? `${person} (via ${config.name})` : config.name;

  await transport(mail.mailbox, config).sendMail({
    from: { name: fromName, address: config.user },
    to: mail.to,
    replyTo: mail.replyTo ? oneLine(mail.replyTo) : undefined,
    subject: oneLine(mail.subject),
    text: mail.text,
    html: mail.html,
    attachments: mail.attachments?.map((a) => ({
      filename: safeFilename(a.filename),
      content: a.content,
      contentType: a.contentType || undefined,
    })),
  });
}
