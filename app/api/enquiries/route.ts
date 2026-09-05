import { NextResponse } from "next/server";
import { enquiryEmail } from "@/lib/email/enquiry";
import { looksAutomated } from "@/lib/spam";
import { recipientFor } from "@/lib/email/recipients";
import { enquiryReceipt } from "@/lib/email/receipts";
import { sendMail } from "@/lib/email/send";
import { enquiryForm } from "@/lib/contact";

/**
 * POST /api/enquiries — receives a message from the contact form and emails
 * it to the school office.
 *
 * ⚠️ DELIVERED, BUT NOT STORED. The office mailbox is the record — the same
 * trade as /api/applications and /api/visits, and the same caveat: a message
 * deleted from that inbox is gone, and nothing here can answer "what did we
 * promise this person in March".
 *
 * A FAILED SEND IS REPORTED AS A FAILURE, because the page tells the sender
 * their message arrived and someone will reply within a working day. Saying
 * that over a message that never left is the one outcome worth avoiding.
 *
 * A sibling of /api/applications rather than an extension of it: that route
 * resolves every submission to a vacancy id, which an enquiry does not have,
 * and the two want to be read by different people once they are stored.
 */

/* Deliberately permissive, and the same expression the applications route
   uses. Strict email regexes reject addresses that are perfectly valid, and
   the only real test is whether a reply arrives. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Long enough to be a message, short enough not to be an essay or an
    attempt to fill the log with someone else's novel. */
const MESSAGE_MAX = 4000;
const SUBJECT_MAX = 200;

type Errors = Record<string, string>;

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Could not read the submitted form." } },
      { status: 400 },
    );
  }

  /* Reported as a success on purpose. A bot told it failed will try another
     shape; one told it worked moves on. Nothing is sent either way. */
  if (looksAutomated(form)) {
    console.info("[enquiries] discarded an automated submission");
    return NextResponse.json({ ok: true });
  }

  const name = text(form, "name");
  const email = text(form, "email");
  const phone = text(form, "phone");
  const subject = text(form, "subject");
  const message = text(form, "message");

  const errors: Errors = {};

  if (!name) errors.name = "Tell us your name.";
  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  if (!phone) errors.phone = "Add a phone number.";

  if (!subject) errors.subject = "Add a subject.";
  else if (subject.length > SUBJECT_MAX) errors.subject = "That subject line is too long.";

  if (!message) errors.message = "Write your message.";
  else if (message.length > MESSAGE_MAX) errors.message = "That message is too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const receiptInput = {
    name,
    email,
    phone,
    subject,
    message,
    receivedAt: new Date().toISOString(),
  };
  const mail = enquiryEmail(receiptInput);

  try {
    await sendMail({
      /* Signs in as the general office mailbox, so this leaves as that address
         rather than as some other department. */
      mailbox: "enquiries",
      to: recipientFor("enquiries"),
      fromName: mail.fromName,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      /* So the office can reply straight from the inbox to the sender. */
      replyTo: email,
    });
  } catch (cause) {
    /* Logged with the address on purpose: nothing is stored, so this line is
       the only trace that somebody wrote in and nobody heard. */
    console.error(
      `[enquiries] DELIVERY FAILED from ${email}:`,
      cause instanceof Error ? cause.message : cause,
    );
    return NextResponse.json(
      { ok: false, errors: { form: enquiryForm.failed } },
      { status: 502 },
    );
  }

  /* After the staff copy, never alongside it — confirming receipt while that
     send is failing would be a lie. A failed receipt is logged, not returned:
     the message did arrive. */
  try {
    await sendMail({
      mailbox: "enquiries",
      to: email,
      ...enquiryReceipt(receiptInput),
    });
  } catch (cause) {
    console.error(
      `[enquiries] receipt to ${email} failed; the message itself arrived:`,
      cause instanceof Error ? cause.message : cause,
    );
  }

  console.info(`[enquiries] delivered from ${email}`);

  return NextResponse.json({ ok: true });
}
