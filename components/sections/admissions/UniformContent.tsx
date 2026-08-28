"use client";

import Image from "next/image";
import { uniform, uniformOutfitter } from "@/lib/admissions";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * The uniform page below the hero: the dress-code expectation, the uniform
 * shown by stage, and the PE rules.
 *
 * The photographs come from the slider that used to sit at the bottom of the
 * admission procedure page — a uniform gallery buried under bank details,
 * where nobody looking for it would think to scroll. Here it is the page.
 *
 * A card whose photograph has not landed yet falls back to a lettered plate
 * rather than a broken frame or a gap, the same approach the leadership cards
 * take with missing headshots. Drop a file at the path in lib/admissions.ts
 * and it swaps in with no other change.
 */
export function UniformContent() {
  return (
    <>
      <section aria-labelledby="expectation-heading" className="bg-surface py-section">
        <div className="shell">
          <Reveal>
            <h2 id="expectation-heading" className="sr-only">
              Dress code
            </h2>
            <p className="max-w-3xl text-[clamp(1.02rem,0.95rem+0.4vw,1.25rem)] font-light leading-relaxed text-ink">
              {uniform.expectation}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- the sets -- */}
      <section
        id="sets"
        aria-labelledby="sets-heading"
        className="scroll-mt-24 bg-surface-alt py-section"
      >
        <div className="shell">
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
              {uniform.sets.eyebrow}
            </p>
            <h2
              id="sets-heading"
              className="mt-3 font-display text-display-sm font-extrabold tracking-tight text-ink"
            >
              {uniform.sets.heading}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {uniform.sets.items.map((set, i) => (
              <Reveal as="li" key={set.id} delay={i * 0.08}>
                <article className="group h-full overflow-hidden rounded-panel bg-surface">
                  <div className="relative aspect-4/5 overflow-hidden bg-brand-100">
                    {set.image ? (
                      <Image
                        src={set.image}
                        alt={`${set.stage} uniform`}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.03]"
                      />
                    ) : (
                      /* No photograph yet. A tinted plate carrying the stage
                         name reads as a designed state; an <Image> pointed at
                         a file that does not exist renders a broken frame and
                         logs a 400 on every load. */
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-100 to-brand-200 px-4 text-center font-display text-[1.1rem] font-extralight tracking-tight text-brand-600"
                      >
                        {set.stage}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-[1.15rem] font-extrabold tracking-tight text-ink">
                      {set.stage}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-body">{set.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- PE ----- */}
      <section id="pe" aria-labelledby="pe-heading" className="scroll-mt-24 bg-surface py-section">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
            <Reveal>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
                {uniform.pe.eyebrow}
              </p>
              <h2
                id="pe-heading"
                className="mt-3 font-display text-display-sm font-extrabold tracking-tight text-ink"
              >
                {uniform.pe.heading}
              </h2>
            </Reveal>

            <ul>
              {uniform.pe.items.map((rule, i) => (
                <Reveal as="li" key={rule} delay={i * 0.07}>
                  <div className="flex items-baseline gap-5 border-t border-brand-100 py-5">
                    <span
                      aria-hidden
                      className="font-display text-[1.1rem] font-extralight tabular-nums text-brand-400"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.97rem] leading-relaxed text-ink-body">{rule}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- where ----- */}
      {/* The last practical question, and until now the one this page could
          not answer: the outfitter was named on the old FAQ page and nowhere
          else. The numbers are tel: links — this is the section most likely
          to be opened on a phone. */}
      <section
        id="where-to-buy"
        aria-labelledby="where-heading"
        className="scroll-mt-24 bg-surface-alt py-section"
      >
        <div className="shell">
          <Reveal>
            <div className="grid gap-8 rounded-panel bg-surface p-8 sm:p-11 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:p-14">
              <div className="max-w-xl">
                <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
                  {uniform.where.eyebrow}
                </p>
                <h2
                  id="where-heading"
                  className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.2rem)] font-extrabold leading-tight tracking-tight text-ink"
                >
                  {uniform.where.heading}
                </h2>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-body">
                  {uniform.where.body}
                </p>
              </div>

              <div className="lg:min-w-64">
                <p className="font-display text-[1.3rem] font-extrabold tracking-tight text-ink">
                  {uniformOutfitter.name}
                </p>

                <a
                  href={uniformOutfitter.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group/link mt-2 inline-flex items-center gap-2 text-[0.9rem] font-bold text-brand-600 transition-colors duration-fast hover:text-brand-700"
                >
                  {uniformOutfitter.site}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover/link:translate-x-0.5" />
                </a>

                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  {uniformOutfitter.phones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="focus-ring text-[0.92rem] font-medium tabular-nums text-ink-body transition-colors duration-fast hover:text-brand-600"
                      >
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
