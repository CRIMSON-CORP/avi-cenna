import { NextResponse } from "next/server";

/**
 * POST /api/enquiries — receives a message from the contact form.
 *
 * ⚠️ THIS DOES NOT STORE ANYTHING YET.
 *
 * Validation is real and the response is real, but the enquiry itself is only
 * written to the server log. Someone who sends this form is told it arrived,
 * and it did not. Before /contact is publicly reachable, either replace the
 * marked block below with a mailbox or a database insert, or take the form
 * down.
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

  const enquiry = {
    name,
    email,
    phone,
    subject,
    message,
    receivedAt: new Date().toISOString(),
  };

  /* ---------------------------------------------------------------------
     REPLACE THIS BLOCK. Send `enquiry` to the school office — a mailbox, a
     database row, or both — then delete the console.warn. Nothing above or
     below needs to change.
     --------------------------------------------------------------------- */
  console.warn("[enquiries] NOT DELIVERED — no mailbox wired up yet:", JSON.stringify(enquiry));
  /* ------------------------------------------------------------------- */

  return NextResponse.json({ ok: true });
}
