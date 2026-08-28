"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { admissionsCta } from "@/lib/admissions";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * The closing band on the admissions pages.
 *
 * One primary action — book a visit — because the school's own position is
 * that you should come and look before you fill anything in. The uniform link
 * rides along as a quiet secondary, and is omitted on the uniform page itself
 * so the page never offers a link to where you already are.
 */
export function AdmissionsCta({ showUniformLink = false }: { showUniformLink?: boolean }) {
  return (
    <section className="bg-surface-alt py-section">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-panel bg-surface p-8 sm:p-11 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-14">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.2rem)] font-extrabold leading-tight tracking-tight text-ink">
                {admissionsCta.heading}
              </h2>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-body">
                {admissionsCta.body}
              </p>

              {showUniformLink && (
                <Link
                  href="/admissions/uniform"
                  className="focus-ring group mt-5 inline-flex items-center gap-2 text-[0.88rem] font-bold text-brand-600 transition-colors hover:text-brand-700"
                >
                  See the uniform
                  <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            <Button href={site.bookVisit} arrow className="shrink-0">
              Book a visit
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
