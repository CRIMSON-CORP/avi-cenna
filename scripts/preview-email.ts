/* Render the application email with sample data so it can be looked at.
   Run from the repo root:  bun run <this file>                          */

import { writeFileSync } from "node:fs";
import { applicationEmail } from "@/lib/email/application";

const OUT =
  "C:/Users/CRIMSON/AppData/Local/Temp/claude/C--Users-CRIMSON-Work-avi-cenna/d68fdb9f-d7f2-4165-a608-6c64a432a2c3/scratchpad";

const full = applicationEmail({
  vacancy: {
    id: "vac_01",
    slug: "igcse-english",
    title: "IGCSE English Teacher",
    category: "Teaching",
    employmentType: "Full-time",
  },
  name: "Adaeze Okonkwo",
  email: "adaeze.okonkwo@gmail.com",
  phone: "+234 803 411 2288",
  message:
    "I have taught Cambridge IGCSE English Language and Literature for six years, most recently at Grange School in Ikeja, and led the department for the last two.\n\nI can supply three referees, including my current head of secondary. I am available from the start of the second term.",
  cv: { name: "Adaeze-Okonkwo-CV-2026.pdf", size: 486_112, type: "application/pdf" },
  receivedAt: "2026-09-04T09:41:00.000Z",
});

/* No optional message, a Word CV, and a name that would be markup if the
   escaping were not doing its job. */
const bare = applicationEmail({
  vacancy: {
    id: "vac_03",
    slug: "boarding-parent",
    title: "Boarding Parent",
    category: "Boarding",
    employmentType: "Full-time",
  },
  name: '<img src=x onerror="alert(1)"> "Tunde" O\'Brien & Sons',
  email: "tunde@example.com",
  phone: "081 8444 5444",
  message: null,
  cv: {
    name: "tunde cv (final) v2.docx",
    size: 2_310_400,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  receivedAt: "2026-09-04T16:05:00.000Z",
});

writeFileSync(`${OUT}/email-full.html`, full.html);
writeFileSync(`${OUT}/email-bare.html`, bare.html);

console.log("SUBJECT:", full.subject);
console.log("SUBJECT:", bare.subject);
console.log("\n--- text/plain -------------------------------------------\n");
console.log(full.text);
console.log("\n----------------------------------------------------------");
console.log("\nescaping check — the name must appear as characters:");
console.log(bare.html.includes("<img src=x") ? "  FAIL: raw <img> in output" : "  ok: no raw <img>");
console.log(
  bare.html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;")
    ? "  ok: escaped form present"
    : "  FAIL: escaped form missing",
);
console.log(`\nwrote ${OUT}/email-full.html and email-bare.html`);
