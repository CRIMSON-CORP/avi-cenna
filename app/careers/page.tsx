import type { Metadata } from "next";
import { Suspense } from "react";
import { getVacancies } from "@/lib/careers";
import { CareersHero } from "@/components/sections/careers/CareersHero";
import { WorkingHere } from "@/components/sections/careers/WorkingHere";
import { TheRole } from "@/components/sections/careers/TheRole";
import { ApplyForm } from "@/components/sections/careers/ApplyForm";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Opportunities to join the staff at Avi-Cenna International School in Ikeja, Lagos. Current vacancies, what the roles ask, and how to apply.",
  alternates: { canonical: "/careers" },
};

/**
 * /careers
 *
 * Vacancies are fetched on the server through lib/careers, which is the only
 * place that knows they are currently a hardcoded array — the components take
 * them as a prop, so nothing here changes when that becomes a database query.
 *
 * The positions are not a section of their own: they are the first field of
 * the application form, as a strip of selectable cards. A separate board
 * meant reading a role at the top of the page and then re-stating it in a
 * dropdown further down — picking the card IS choosing the role.
 *
 * The selection lives in `?role=` so a position can be linked to.
 * `useSearchParams` opts a component into client-side rendering, so the form
 * sits inside a Suspense boundary — without it the whole route would be
 * forced dynamic and lose its static prerender.
 */
export default async function CareersPage() {
  const vacancies = await getVacancies();

  return (
    <main id="main">
      <CareersHero />
      <WorkingHere />
      <TheRole />
      <Suspense fallback={null}>
        <ApplyForm vacancies={vacancies} />
      </Suspense>
    </main>
  );
}
