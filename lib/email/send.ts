/**
 * The one place in the codebase that talks to a mail server.
 *
 * WE ARE A CLIENT, NOT A MAIL SERVER. Nodemailer signs in to a mailbox that
 * already exists on the school's mail host and asks it to send — it does not
 * deliver anything itself. That distinction is the whole deliverability
 * story: the domain's SPF record names the mail host as an allowed sender and
 * says to distrust everything else, so mail leaving through that host is
 * vouched for and mail leaving straight from this server would not be. Point
 * SMTP_HOST at the school's mail host, never at localhost.
 *
 * WHY `from` IS NOT A SETTING. A mail host will only let an account send as
 * itself, so the From address is derived from SMTP_USER rather than being its
 * own variable that could drift out of step with it. Making the applicant the
 * sender — the obvious instinct, so replies reach them — would be rejected by
 * the host and would fail SPF at the far end. `replyTo` is the supported way
 * to get the same result, and every template that needs it sets it.
 */

import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

export type Mail = {
  to: string;
  /** The person this message is on behalf of, shown in the inbox as
      "Their Name (via <MAIL_FROM_NAME>)". The address underneath stays ours —
      see the note above on why it has to. Omit for mail that is genuinely
      from the school rather than relayed for someone. */
  fromName?: string;
  subject: string;
  html: string;
  text: string;
  /** Where a reply should go — the applicant, not this mailbox. */
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

/* --------------------------------------------------------------- config -- */

type Config = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
};

function readConfig(): Config {
  const missing = (["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const).filter(
    (key) => !process.env[key],
  );

  /* All of them at once. Finding out about a missing variable one deploy at a
     time is a miserable way to configure a server. */
  if (missing.length > 0) {
    throw new Error(
      `Mail is not configured — set ${missing.join(", ")} in the environment. ` +
        `See .env.example for what each one is.`,
    );
  }

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`SMTP_PORT must be a port number, got "${process.env.SMTP_PORT}".`);
  }

  return {
    host: process.env.SMTP_HOST!,
    port,
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    fromName: process.env.MAIL_FROM_NAME || site.name,
  };
}

/* ------------------------------------------------------------ transport -- */

let cached: Transporter | null = null;

/**
 * Built once and kept.
 *
 * A route handler runs per request, and building a transport per request
 * means a fresh TCP connection and TLS handshake for every application — on a
 * shared host that is both slow and a good way to trip a connection-rate
 * limit. `pool` keeps a couple of connections open and reuses them.
 */
function transport(config: Config) {
  if (cached) return cached;

  cached = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    /* 465 is TLS from the first byte; 587 and 25 start in the clear and
       upgrade with STARTTLS. Deriving this from the port removes a variable
       that is only ever set wrong. */
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    pool: true,
    maxConnections: 2,
    /* Shared mail hosts do go away mid-handshake. Without these the request
       hangs until something upstream gives up, and the applicant watches a
       spinner instead of being told to try again. */
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return cached;
}

/* --------------------------------------------------------------- sending -- */

/** Strip anything that could break out of a header or a filename. Nodemailer
    encodes these correctly on its own; this is the second lock on the door,
    because every value here came off a public form. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** A display name from a public form, made safe to sit in a header: one
    line, and short enough that a pasted essay cannot push the real address
    out of view in a narrow inbox column. */
function safeName(name: string) {
  return oneLine(name).slice(0, 60).trim();
}

function safeFilename(name: string) {
  return oneLine(name).replace(/[\\/]/g, "-").slice(0, 200) || "attachment";
}

/**
 * Sends, or throws. There is no third outcome and no swallowed error: the
 * caller decides what to tell the person waiting on the other end, and it
 * cannot decide that if a failure looks like a success from here.
 */
export async function sendMail(mail: Mail) {
  const config = readConfig();

  /* "Adaeze Okonkwo (via Avi-Cenna Careers)" — the convention GitHub and
     Substack use. HR scans the sender column and sees who applied, while the
     address stays the mailbox that really sent it, so nothing about SPF or
     deliverability changes. */
  const person = mail.fromName ? safeName(mail.fromName) : "";
  const fromName = person ? `${person} (via ${config.fromName})` : config.fromName;

  await transport(config).sendMail({
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
