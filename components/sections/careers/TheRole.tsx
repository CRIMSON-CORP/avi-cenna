"use client";

import { careersRole } from "@/lib/careers";
import { Reveal } from "@/components/ui/Reveal";

/**
 * What the role asks, and what you need to ask for the role.
 *
 * Two columns rather than one merged bullet list, because these answer
 * different questions: the first is the job, the second is the gate. A
 * candidate reads the right-hand column to decide whether to apply at all,
 * and flattening them together loses that.
 *
 * Neither list is numbered — nothing here happens in an order.
 */
export function TheRole() {
  return (
    <section
      id={careersRole.id}
      aria-labelledby="careers-role-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <h2 id="careers-role-heading" className="sr-only">
          The role and its requirements
        </h2>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {[careersRole.expectations, careersRole.requirements].map((list, col) => (
            <Reveal key={list.eyebrow} delay={col * 0.1}>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
                {list.eyebrow}
              </p>
              <h3 className="mt-3 max-w-sm font-display text-[clamp(1.35rem,1.1rem+1vw,1.85rem)] font-extrabold leading-tight tracking-tight text-ink">
                {list.heading}
              </h3>

              <ul className="mt-7 flex flex-col">
                {list.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-t border-brand-200 py-4 text-[0.95rem] leading-relaxed text-ink-body"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
