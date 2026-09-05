"use client";

import { useState } from "react";
import Image from "next/image";
import { aboutFilm } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The school's own film, in the position the old About page gave it: directly
 * under the opening, before the copy.
 *
 * It is a facade rather than an iframe. A YouTube embed loads roughly a
 * megabyte of player and sets third-party cookies on arrival, whether or not
 * anyone watches — on a page this long that is a real cost for something most
 * readers scroll past. So the poster is a plain image and the player is only
 * mounted once someone presses play, at which point it autoplays.
 *
 * youtube-nocookie.com, because there is no reason to hand a tracking cookie
 * to every parent who watches a two-minute film about the school.
 *
 * The poster comes from i.ytimg.com, allowed in next.config.ts so it can be
 * optimised rather than served as YouTube's full-size JPEG.
 */
export function SchoolFilm() {
  const [playing, setPlaying] = useState(false);

  return (
    <section aria-labelledby="about-film-heading" className="bg-surface pt-section">
      <div className="shell">
        <Reveal>
          {/* The poster already carries the title and the channel, so there is
              no caption underneath repeating them. */}
          <div className="relative aspect-video overflow-hidden rounded-panel bg-surface-deep shadow-lift">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${aboutFilm.videoId}?autoplay=1&rel=0`}
                title={aboutFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play the film: ${aboutFilm.title}`}
                className="focus-ring group absolute inset-0 h-full w-full cursor-pointer"
              >
                <Image
                  src={`https://i.ytimg.com/vi/${aboutFilm.videoId}/hqdefault.jpg`}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.02]"
                />

                {/* Darkened so the play control and caption stay legible
                      whatever frame the thumbnail happens to be. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/25 to-brand-950/10"
                />

                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-500 shadow-glow transition-transform duration-1000 ease-out-expo group-hover:scale-110 sm:h-20 sm:w-20"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>

                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-left sm:p-8">
                  <span
                    id="about-film-heading"
                    className="font-display text-[1.05rem] font-extrabold tracking-[-0.01em] text-white sm:text-[1.25rem]"
                  >
                    {aboutFilm.title}
                  </span>
                  <span className="text-[0.8rem] font-semibold text-brand-200">
                    {aboutFilm.channel}
                  </span>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
