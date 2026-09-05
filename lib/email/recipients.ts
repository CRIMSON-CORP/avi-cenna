/**
 * The To: line for each form. Who *sends* is a separate setting, in send.ts —
 * they coincide today but redirecting where a form lands should not mean
 * signing in as somebody else.
 *
 * Env-overridable so the school can redirect without a deploy; falls back to
 * the address the site already shows the public.
 */

import { careersApply } from "@/lib/careers";
import { site } from "@/lib/site";
import { visitForm } from "@/lib/visits";

export type MailPurpose = "applications" | "visits" | "enquiries";

const ROUTING: Record<MailPurpose, { env: string; fallback: string }> = {
  applications: { env: "MAIL_TO_APPLICATIONS", fallback: careersApply.email },
  visits: { env: "MAIL_TO_VISITS", fallback: visitForm.email },
  enquiries: { env: "MAIL_TO_ENQUIRIES", fallback: site.email },
};

/** Read at call time so a build made without the vars cannot bake in a
    fallback. */
export function recipientFor(purpose: MailPurpose) {
  const { env, fallback } = ROUTING[purpose];
  return process.env[env]?.trim() || fallback;
}
