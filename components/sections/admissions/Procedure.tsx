"use client";

import { admissionsProcedure, type Step } from "@/lib/admissions";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The admission procedure, split by who performs each step.
 *
 * That split is not imposed — it is already in the school's own copy. You buy
 * and submit the form, the Registrar schedules the examination, the Principal
 * interviews, you pay the deposit. Setting the two lanes side by side answers
 * the question a parent actually has partway through an application, which is
 * not "what happens next" but "is anyone waiting on me right now".
 *
 * The gaps carry the meaning. Where a step sits in the school's lane, the
 * parent's lane is empty beside it — that empty space is the waiting, and it
 * is the reason this is two columns rather than one numbered list.
 *
 * It is also why this is NOT another vertical numbered rail. The academics
 * ladder and the Early Years walk both already draw a line down the page; a
 * third would stop reading as a deliberate device and start reading as a
 * house tic. Here the alternation does the work and no rail is drawn — only a
 * hairline between the lanes, to show which side of the handoff you are on.
 */
export function Procedure() {
  return (
    <section
      id={admissionsProcedure.id}
      aria-labelledby="procedure-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
            {admissionsProcedure.eyebrow}
          </p>
          <h2
            id="procedure-heading"
            className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-tight text-ink"
          >
            {admissionsProcedure.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-body">
            {admissionsProcedure.body}
          </p>
        </Reveal>

        <div className="relative mt-10 lg:mt-14">
          {/* Lane headings. Hidden below lg, where the columns collapse and
              each card states its own actor instead. */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10">
            {(["you", "school"] as const).map((lane) => (
              <p
                key={lane}
                className={cn(
                  "pb-4 text-[0.72rem] font-bold uppercase tracking-widest",
                  lane === "you" ? "text-brand-600" : "text-ink-muted",
                )}
              >
                {admissionsProcedure.lanes[lane]}
              </p>
            ))}
          </div>

          {/* The hairline between the lanes — a boundary, not a progress
              track, so it neither fills nor animates. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-brand-100 lg:block"
          />

          <ol className="grid gap-4 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-5">
            {admissionsProcedure.steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </ol>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-panel border border-brand-100 bg-surface-alt p-6 sm:p-8 lg:mt-14">
            <h3 className="font-display text-[1.05rem] font-extrabold tracking-tight text-ink">
              {admissionsProcedure.policy.title}
            </h3>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-body">
              {admissionsProcedure.policy.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const isYou = step.actor === "you";

  return (
    <li
      /* Two pins, and both matter.

         col-start puts the card in its actor's lane; without it the grid
         fills left-to-right and the handoff disappears.

         gridRow gives every step a row of its own. Left to auto-placement,
         step 4 slots into the first free cell — which is the row beside step
         3 — and two steps sitting level read as simultaneous when in fact one
         waits on the other. One step per row keeps vertical position equal to
         chronological order, and turns the empty cell opposite into what it
         actually is: the wait. Safe at every breakpoint, since a single-column
         grid wants one row per item anyway. */
      style={{ gridRow: index + 1 }}
      className={cn("lg:col-span-1", isYou ? "lg:col-start-1" : "lg:col-start-2")}
    >
      <Reveal delay={(index % 2) * 0.06} className="h-full">
        <div
          className={cn(
            "flex h-full flex-col rounded-card border p-5 transition-shadow duration-base ease-out-expo hover:shadow-soft sm:p-6",
            isYou ? "border-brand-200 bg-surface" : "border-brand-100 bg-surface-alt",
          )}
        >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold",
              isYou ? "bg-brand-500 text-white" : "bg-ink text-white",
            )}
          >
            {index + 1}
          </span>

          {/* The actor is stated on every card, not just in the lane heading —
              the columns collapse on small screens, and a screen reader never
              sees the columns at all. */}
          <span
            className={cn(
              "text-[0.68rem] font-bold uppercase tracking-widest",
              isYou ? "text-brand-600" : "text-ink-muted",
            )}
          >
            {admissionsProcedure.lanes[step.actor]}
          </span>
        </div>

        <h3 className="mt-3 font-display text-[1.08rem] font-extrabold leading-snug tracking-tight text-ink">
          {step.title}
        </h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-body">{step.body}</p>
        </div>
      </Reveal>
    </li>
  );
}
