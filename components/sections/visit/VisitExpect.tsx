import { visitExpect } from "@/lib/visits";
import { Reveal } from "@/components/ui/Reveal";

/** Above the form: "what am I signing up for" comes before filling it in. */
export function VisitExpect() {
  return (
    <section aria-labelledby="visit-expect-heading" className="bg-surface py-section">
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {visitExpect.eyebrow}
          </p>
          <h2
            id="visit-expect-heading"
            className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {visitExpect.heading}
          </h2>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {visitExpect.items.map((item, index) => (
            <Reveal key={item.title} delay={0.08 * index}>
              <li className="h-full rounded-card bg-surface-alt p-7">
                <span
                  aria-hidden
                  className="block h-1 w-9 rounded-pill bg-gold-400"
                />
                <h3 className="mt-5 font-display text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-body">
                  {item.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
