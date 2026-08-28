"use client";

import Image from "next/image";
import { ptaPortrait } from "@/lib/pta";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The group photograph, sitting directly under the hero panel.
 *
 * It runs close beneath the navy rather than in a section of its own further
 * down, so the two read as one opening: the panel makes the claim, the
 * photograph is the evidence. A PTA is a room full of people, and this is the
 * only asset on the page that shows that.
 *
 * The crop tightens as the viewport widens — the native 3:2 on a phone, where
 * width is scarce and every face matters, letterboxing towards 21:9 on a
 * desktop, where the same frame would otherwise tower over the fold.
 */
export function Portrait() {
  return (
    <section className="bg-surface">
      <div className="shell">
        <Reveal y={20}>
          <figure>
            <div className="relative aspect-3/2 overflow-hidden rounded-panel bg-brand-100 sm:aspect-16/9 lg:aspect-[21/9]">
              <Image
                src={ptaPortrait.src}
                alt={ptaPortrait.alt}
                fill
                priority
                sizes="(min-width: 1024px) 82rem, 100vw"
                /* Held above centre: the wider crops trim from the bottom,
                   which is where the steps are, not where the faces are. */
                style={{ objectPosition: "50% 38%" }}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-[0.8rem] font-medium text-ink-muted">
              {ptaPortrait.caption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
