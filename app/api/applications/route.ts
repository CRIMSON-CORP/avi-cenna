import { NextResponse } from "next/server";
import { careersApply, getVacancyBySlug } from "@/lib/careers";

/**
 * POST /api/applications — receives a job application.
 *
 * ⚠️ THIS DOES NOT STORE ANYTHING YET.
 *
 * Validation is real and the response is real, but the application itself is
 * only written to the server log. An applicant who submits this form is told
 * it was sent, and it was not. Before /careers is publicly reachable, either
 * replace the marked block below with a database insert and file upload, or
 * take the form down.
 *
 * Everything around that block is written to survive the swap: the role is
 * resolved to a real vacancy id, so applications are already keyed the way an
 * admin screen needs them ("show me everyone who applied for vac_02"), and
 * the CV is validated for type and size before it would ever be stored.
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

  const application = {
    vacancyId: vacancy!.id,
    vacancySlug: vacancy!.slug,
    vacancyTitle: vacancy!.title,
    name,
    email,
    phone,
    message: message || null,
    cv: cv instanceof File ? { name: cv.name, size: cv.size, type: cv.type } : null,
    receivedAt: new Date().toISOString(),
  };

  /* ---------------------------------------------------------------------
     REPLACE THIS BLOCK. Persist `application` and upload the CV bytes, then
     delete the console.warn. Nothing above or below needs to change.
     --------------------------------------------------------------------- */
  console.warn(
    "[applications] NOT PERSISTED — no database wired up yet:",
    JSON.stringify(application),
  );
  /* ------------------------------------------------------------------- */

  return NextResponse.json({ ok: true });
}
