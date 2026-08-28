import type { Metadata } from "next";
import { academicsHero } from "@/lib/academics";
import { PageHero } from "@/components/ui/PageHero";
import { TheLadder } from "@/components/sections/academics/TheLadder";
import { Approach } from "@/components/sections/academics/Approach";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Avi-Cenna International School follows the National Curriculum of England and Wales, from the Early Years Foundation Stage through to Cambridge IGCSE. Three schools, one building, ages 2 to 16.",
  alternates: { canonical: "/academics" },
};

/**
 * /academics — the Academics Overview and School Programs Overview pages from
 * the current site, folded into one route.
 *
 * The order is an argument: what the school teaches and how it is measured
 * comes first, because that is what a parent opened this page for; the ethos
 * follows and explains why the building is arranged the way the ladder just
 * showed. The three stage pages hang off the ladder rather than off a menu.
 */
export default function AcademicsPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={academicsHero.eyebrow}
        headline={academicsHero.headline}
        body={academicsHero.body}
        facts={academicsHero.facts}
      />
      <TheLadder />
      <Approach />
    </main>
  );
}
