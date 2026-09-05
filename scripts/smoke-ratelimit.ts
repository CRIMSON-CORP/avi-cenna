/* Fires submissions from a fixed IP until the limiter trips, then checks a
   different IP is unaffected. Needs the SMTP sink on 2525.

   Run:  bun run scripts/smoke-ratelimit.ts */

export {};

process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_PORT = "2525";
process.env.MAILBOX_ENQUIRIES_USER = "info@avi-cenna.com";
process.env.MAILBOX_ENQUIRIES_PASS = "sink";

const { POST } = await import("@/app/api/enquiries/route");
const { FORM_LIMIT } = await import("@/lib/rate-limit");

function submit(ip: string) {
  const body = new FormData();
  body.append("name", "Ngozi Eze");
  body.append("email", "ngozi@example.com");
  body.append("phone", "0802 000 1111");
  body.append("subject", "Admission for my daughter");
  body.append("message", "Is there a place in Year 4?");
  return POST(
    new Request("http://x/api/enquiries", {
      method: "POST",
      body,
      headers: { "x-forwarded-for": `203.0.113.9, ${ip}` },
    }),
  );
}

console.log(`limit: ${FORM_LIMIT.max} per ${FORM_LIMIT.windowMs / 60000} minutes\n`);

for (let i = 1; i <= FORM_LIMIT.max + 2; i++) {
  const response = await submit("102.89.1.1");
  const json = await response.json();
  const retry = response.headers.get("Retry-After");
  console.log(
    `  attempt ${String(i).padStart(2)}  ${response.status}` +
      (retry ? `  Retry-After: ${retry}s` : "") +
      (response.status === 429 ? `  "${json.errors.form.slice(0, 52)}…"` : ""),
  );
}

const other = await submit("102.89.2.2");
console.log(`\n  different IP  ${other.status}  (must be 200 — one abuser cannot lock out everyone)`);

/* The spoof check: a client-supplied X-Forwarded-For must not let someone
   pretend to be a fresh address, because the proxy's hop is read last. */
const spoofBody = new FormData();
for (const [k, v] of [["name", "A"], ["email", "a@b.com"], ["phone", "1"], ["subject", "s"], ["message", "m"]]) {
  spoofBody.append(k, v);
}
const spoofed = await POST(
  new Request("http://x/api/enquiries", {
    method: "POST",
    body: spoofBody,
    headers: { "x-forwarded-for": "9.9.9.9, 102.89.1.1" },
  }),
);
console.log(`  spoofed prefix, same real hop  ${spoofed.status}  (must be 429)`);

process.exit(0);
