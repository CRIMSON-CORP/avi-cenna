"use client";

import { admissionsDocuments, admissionsPayment } from "@/lib/admissions";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The checklist and the fee — the two things a parent comes back to this page
 * for once they have decided.
 *
 * Set side by side because they are used together: you gather the four
 * documents and you pay for the form in the same trip to the Registrar. The
 * account details sit in their own bordered block so they can be read off a
 * phone without hunting through a paragraph.
 */
export function WhatToBring() {
  return (
    <section
      id={admissionsDocuments.id}
      aria-labelledby="bring-heading"
      className="scroll-mt-24 bg-surface pb-section"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          {/* ------------------------------------------- the documents --- */}
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
              {admissionsDocuments.eyebrow}
            </p>
            <h2
              id="bring-heading"
              className="mt-3 font-display text-display-sm font-extrabold tracking-tight text-ink"
            >
              {admissionsDocuments.heading}
            </h2>

            <ol className="mt-8">
              {admissionsDocuments.items.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-5 border-t border-brand-100 py-4"
                >
                  <span
                    aria-hidden
                    className="font-display text-[1.1rem] font-extralight tabular-nums text-brand-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink-body">{item}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ------------------------------------------------ the fee ---- */}
          <Reveal delay={0.1}>
            <div className="rounded-panel bg-surface-deep p-7 shadow-lift sm:p-9">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-gold-400">
                {admissionsPayment.eyebrow}
              </p>

              <p className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-[clamp(2.2rem,1.6rem+2.2vw,3rem)] font-extrabold leading-none tracking-tight text-white">
                  {admissionsPayment.amount}
                </span>
                <span className="text-[0.9rem] text-ink-invert-soft">
                  {admissionsPayment.amountLabel}
                </span>
              </p>

              <p className="mt-4 text-[0.9rem] text-ink-invert-soft">
                {admissionsPayment.methods}
              </p>

              {/* Account details as a definition list, in their own block —
                  they get read aloud over the phone and typed into a banking
                  app, so they need to be findable, not embedded in prose. */}
              <dl className="mt-7 rounded-card border border-white/15 p-5">
                {[
                  ["Account name", admissionsPayment.account.name],
                  ["Account number", admissionsPayment.account.number],
                  ["Bank", admissionsPayment.account.bank],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/10 py-2.5 last:border-b-0 last:pb-0 first:pt-0"
                  >
                    <dt className="text-[0.78rem] uppercase tracking-widest text-brand-300">
                      {label}
                    </dt>
                    <dd className="font-display text-[0.98rem] font-bold tabular-nums text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[0.85rem] leading-relaxed text-ink-invert-soft">
                {admissionsPayment.note}
              </p>

              <a
                href={admissionsPayment.enquire.href}
                className="focus-ring mt-5 inline-block text-[0.88rem] font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                {admissionsPayment.enquire.label}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
