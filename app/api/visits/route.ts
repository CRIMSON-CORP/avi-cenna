import { NextResponse } from "next/server";
import { recipientFor } from "@/lib/email/recipients";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/email/send";
import { visitReceipt } from "@/lib/email/receipts";
import { visitEmail } from "@/lib/email/visit";
import { isVisitSlot, validateVisitDate, visitForm } from "@/lib/visits";

/**
 * POST /api/visits — receives a request to visit the school and emails the
 * office.
 *
 * A REQUEST, NOT A BOOKING. Nothing here can see the school's calendar, so
 * this cannot and does not reserve a slot. Both the form and the email say so.
 * The day this route starts writing to a real calendar is the day that wording
 * has to change with it.
 *
 * The date rules live in lib/visits.ts and are enforced there, not here, so
 * the form and this route cannot disagree about what counts as a valid day.
 * Client-side validation is a courtesy; this is the copy that decides.
 *
 * ⚠️ DELIVERED, BUT NOT STORED — the same trade as /api/applications. The
 * office mailbox is the record.
 */

/* Deliberately permissive, and the same expression the other two routes use.
   Strict email regexes reject addresses that are perfectly valid, and the
   only real test is whether a reply arrives. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_MAX = 2000;

/** 429 copy. Says what to do instead rather than only saying no. */
const TOO_MANY =
  "That is a lot of submissions from one connection in a short time. Wait a few minutes and try again, or call the school if it is urgent.";

type Errors = Record<string, string>;

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  /* Before reading the body: a rejected request should not have cost us a
     5MB upload. Unproxied there is no address to key on, and blocking every
     submission is worse than allowing them. */
  const ip = clientIp(request);
  if (ip) {
    const limit = rateLimit(`visits:${ip}`);
    if (!limit.ok) {
      return NextResponse.json(
        { ok: false, errors: { form: TOO_MANY } },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }
  }

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
  const date = text(form, "date");
  const slot = text(form, "slot");
  const message = text(form, "message");

  const errors: Errors = {};

  if (!name) errors.name = "Tell us your name.";
  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  if (!phone) errors.phone = "Add a phone number.";

  const dateError = validateVisitDate(date);
  if (dateError) errors.date = dateError;

  if (!slot) errors.slot = "Choose a morning or an afternoon.";
  else if (!isVisitSlot(slot)) errors.slot = "Choose a morning or an afternoon.";

  if (message.length > MESSAGE_MAX) errors.message = "That message is too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const receiptInput = {
    name,
    email,
    phone,
    date,
    slot,
    message: message || null,
    receivedAt: new Date().toISOString(),
  };
  const mail = visitEmail(receiptInput);

  try {
    await sendMail({
      /* Signs in as the admissions mailbox, so this leaves as that address
         rather than as some other department. */
      mailbox: "visits",
      to: recipientFor("visits"),
      fromName: mail.fromName,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      /* So the office can reply straight from the inbox to the family. */
      replyTo: email,
    });
  } catch (cause) {
    /* Logged with the address on purpose: nothing is stored, so this line is
       the only trace that a family asked to visit and nobody heard. */
    console.error(
      `[visits] DELIVERY FAILED for ${date} from ${email}:`,
      cause instanceof Error ? cause.message : cause,
    );
    return NextResponse.json(
      { ok: false, errors: { form: visitForm.failure } },
      { status: 502 },
    );
  }

  /* After the staff copy, never alongside it — confirming receipt while that
     send is failing would be a lie. A failed receipt is logged, not returned:
     the request did arrive. */
  try {
    await sendMail({
      mailbox: "visits",
      to: email,
      ...visitReceipt(receiptInput),
    });
  } catch (cause) {
    console.error(
      `[visits] receipt to ${email} failed; the request itself arrived:`,
      cause instanceof Error ? cause.message : cause,
    );
  }

  console.info(`[visits] delivered ${date} ${slot} from ${email}`);

  return NextResponse.json({ ok: true });
}
