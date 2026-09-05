import { NextResponse } from "next/server";
import { careersApply, getVacancyBySlug } from "@/lib/careers";
import { applicationEmail } from "@/lib/email/application";
import { sendMail } from "@/lib/email/send";

/**
 * POST /api/applications — receives a job application and emails it to HR.
 *
 * ⚠️ DELIVERED, BUT NOT STORED. The email is the record. There is no database
 * behind this, so an application that is deleted from the HR mailbox is gone,
 * and there is no admin screen to answer "who applied for vac_02". That is a
 * deliberate first step rather than an oversight — but the day a vacancy
 * draws fifty applicants, a mailbox stops being a good enough filing system.
 *
 * The pieces a database would need are already here: the role is resolved to
 * a real vacancy id rather than trusted as free text, and the CV is checked
 * for type and size before it goes anywhere. Adding storage means inserting a
 * row and uploading the bytes next to the send below; nothing else moves.
 *
 * A FAILED SEND IS REPORTED AS A FAILURE. If the mail host is unreachable the
 * applicant is told so and asked to try again, because the alternative — a
 * green tick over a lost application — is the exact thing this route used to
 * do wrong.
 */

/* Deliberately permissive. Strict email regexes reject addresses that are
   perfectly valid, and the only real test is whether a message arrives. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
  const role = text(form, "role");
  const message = text(form, "message");
  const cv = form.get("cv");

  const errors: Errors = {};

  if (!name) errors.name = "Tell us your name.";
  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  if (!phone) errors.phone = "Add a phone number.";

  /* The role is the whole point of the new flow: it is selected once, and
     everything downstream reads it from here rather than from a free-text
     field the applicant had to fill in twice. */
  const vacancy = role ? await getVacancyBySlug(role) : null;
  if (!role) errors.role = "Choose the position you are applying for.";
  else if (!vacancy) errors.role = "That position is no longer open.";

  if (!(cv instanceof File) || cv.size === 0) {
    errors.cv = "Attach your CV.";
  } else if (cv.size > careersApply.cv.maxBytes) {
    errors.cv = "That file is larger than 5MB.";
  } else if (cv.type && !ACCEPTED_CV_TYPES.includes(cv.type)) {
    errors.cv = "Send a PDF or Word document.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  /* Validation above guarantees both of these; the assertions are for the
     type checker, which cannot see that far back. */
  const file = cv as File;
  const position = vacancy!;

  const mail = applicationEmail({
    vacancy: position,
    name,
    email,
    phone,
    message: message || null,
    cv: { name: file.name, size: file.size, type: file.type },
    receivedAt: new Date().toISOString(),
  });

  try {
    await sendMail({
      /* The advertised address is the default, so this works before anyone
         sets the variable — and can be redirected without a deploy. */
      to: process.env.MAIL_TO_APPLICATIONS || careersApply.email,
      fromName: mail.fromName,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      /* So that hitting reply in the HR mailbox reaches the applicant. The
         From address cannot be theirs — see the note in lib/email/send.ts. */
      replyTo: email,
      attachments: [
        {
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        },
      ],
    });
  } catch (cause) {
    /* The applicant's address is logged on purpose. Nothing is stored, so
       this line is the only trace that someone tried to apply and the school
       never heard about it — enough to go back to them by hand. */
    console.error(
      `[applications] DELIVERY FAILED for ${position.id} from ${email}:`,
      cause instanceof Error ? cause.message : cause,
    );
    return NextResponse.json(
      { ok: false, errors: { form: careersApply.failure } },
      { status: 502 },
    );
  }

  console.info(`[applications] delivered ${position.id} from ${email}`);

  return NextResponse.json({ ok: true });
}
