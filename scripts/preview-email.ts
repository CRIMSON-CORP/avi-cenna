/* Renders every email template with sample data so they can be looked at
   without sending one. Writes HTML into scripts/.preview/ (gitignored).

   Run:  bun run scripts/preview-email.ts */

import { mkdirSync, writeFileSync } from "node:fs";
import { applicationEmail } from "@/lib/email/application";
import { enquiryEmail } from "@/lib/email/enquiry";
import { visitEmail } from "@/lib/email/visit";
import { applicationReceipt, enquiryReceipt, visitReceipt } from "@/lib/email/receipts";

const OUT = "scripts/.preview";
mkdirSync(OUT, { recursive: true });

const application = {
  vacancy: {
    id: "vac_01",
    slug: "igcse-english",
    title: "IGCSE English Teacher",
    category: "Teaching" as const,
    employmentType: "Full-time" as const,
  },
  name: "Adaeze Okonkwo",
  email: "adaeze.okonkwo@gmail.com",
  phone: "+234 803 411 2288",
  message:
    "I have taught Cambridge IGCSE English for six years, most recently at Grange School in Ikeja.\n\nI can supply three referees and am available from the second term.",
  cv: { name: "Adaeze-Okonkwo-CV-2026.pdf", size: 486_112, type: "application/pdf" },
  receivedAt: "2026-09-05T09:41:00.000Z",
};

const visit = {
  name: "Chidi Balogun",
  email: "chidi.balogun@gmail.com",
  phone: "081 8444 5444",
  date: "2026-09-15",
  slot: "morning",
  message: "Two children, ages 6 and 9. We would like to see the primary classrooms.",
  receivedAt: "2026-09-05T11:20:00.000Z",
};

/* A name that would be markup if the escaping were not working. */
const enquiry = {
  name: '<img src=x onerror="alert(1)"> Ngozi & Sons',
  email: "ngozi@example.com",
  phone: "0802 000 1111",
  subject: "Admission for my daughter",
  message: "Is there a place in Year 4 for January? She is currently at a British curriculum school in Abuja.",
  receivedAt: "2026-09-05T14:05:00.000Z",
};

const templates = {
  "staff-application": applicationEmail(application),
  "staff-visit": visitEmail(visit),
  "staff-enquiry": enquiryEmail(enquiry),
  "receipt-application": applicationReceipt(application),
  "receipt-visit": visitReceipt(visit),
  "receipt-enquiry": enquiryReceipt(enquiry),
};

for (const [name, mail] of Object.entries(templates)) {
  writeFileSync(`${OUT}/${name}.html`, mail.html);
  console.log(`${name.padEnd(22)} ${mail.subject}`);
}

const escaped = templates["staff-enquiry"].html;
console.log(
  `\nescaping: ${escaped.includes("<img src=x") ? "FAIL — raw <img> in output" : "ok"}`,
);
console.log(`\nwrote ${Object.keys(templates).length} files to ${OUT}/`);
