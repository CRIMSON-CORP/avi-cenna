/* Posts one submission through each form's route handler against a local SMTP
   sink. Refuses to run unless SMTP_HOST is loopback, so it can never reach the
   school's real mail host.

   Run:  bun run scripts/smoke-forms.ts   (with the sink listening on 2525) */

import { readFileSync } from "node:fs";

process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_PORT = "2525";
process.env.MAILBOX_CAREERS_USER = "career@avi-cenna.com";
process.env.MAILBOX_CAREERS_PASS = "sink";
process.env.MAILBOX_CAREERS_NAME = "Avi-Cenna Careers";
process.env.MAILBOX_VISITS_USER = "bookavisit@avi-cenna.com";
process.env.MAILBOX_VISITS_PASS = "sink";
process.env.MAILBOX_VISITS_NAME = "Avi-Cenna Admissions";
process.env.MAILBOX_ENQUIRIES_USER = "info@avi-cenna.com";
process.env.MAILBOX_ENQUIRIES_PASS = "sink";
process.env.MAILBOX_ENQUIRIES_NAME = "Avi-Cenna International School";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

if (!["127.0.0.1", "localhost"].includes(process.env.SMTP_HOST)) {
  throw new Error("refusing to run against a non-local SMTP host");
}

const { POST: applications } = await import("@/app/api/applications/route");
const { POST: visits } = await import("@/app/api/visits/route");
const { POST: enquiries } = await import("@/app/api/enquiries/route");
const { visitDateBounds } = await import("@/lib/visits");

function post(url: string, fields: Record<string, string | File>) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  return new Request(url, { method: "POST", body });
}

async function run(label: string, handler: (r: Request) => Promise<Response>, request: Request) {
  const response = await handler(request);
  const json = await response.json();
  console.log(`${label.padEnd(22)} ${response.status}  ${JSON.stringify(json)}`);
  return response.status;
}

const cv = new File([readFileSync("C:/Users/CRIMSON/.claude/jobs/130ca7a2/tmp/cv.pdf")], "Adaeze-CV.pdf", {
  type: "application/pdf",
});

/* A weekday inside the allowed window. */
const { min } = visitDateBounds();
let date = min;
for (let i = 0; i < 7; i++) {
  const d = new Date(`${date}T12:00:00Z`);
  if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) break;
  d.setUTCDate(d.getUTCDate() + 1);
  date = d.toISOString().slice(0, 10);
}

console.log("valid submissions\n");
await run(
  "applications",
  applications,
  post("http://x/api/applications", {
    name: "Adaeze Okonkwo",
    email: "adaeze@example.com",
    phone: "+234 803 411 2288",
    role: "igcse-english",
    message: "Six years teaching IGCSE English.",
    cv,
  }),
);
await run(
  "visits",
  visits,
  post("http://x/api/visits", {
    name: "Chidi Balogun",
    email: "chidi@example.com",
    phone: "081 8444 5444",
    date,
    slot: "morning",
    message: "Two children, ages 6 and 9.",
  }),
);
await run(
  "enquiries",
  enquiries,
  post("http://x/api/enquiries", {
    name: "Ngozi Eze",
    email: "ngozi@example.com",
    phone: "0802 000 1111",
    subject: "Admission for my daughter",
    message: "Is there a place in Year 4 for January?",
  }),
);

console.log("\nrejected submissions\n");
await run("visits (weekend)", visits, post("http://x/api/visits", {
  name: "A", email: "a@b.com", phone: "1", date: "2026-09-12", slot: "morning",
}));
await run("visits (past date)", visits, post("http://x/api/visits", {
  name: "A", email: "a@b.com", phone: "1", date: "2020-01-06", slot: "morning",
}));
await run("visits (bad slot)", visits, post("http://x/api/visits", {
  name: "A", email: "a@b.com", phone: "1", date, slot: "midnight",
}));

process.exit(0);
