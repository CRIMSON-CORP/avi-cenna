import type { Metadata } from "next";
import { earlyYears, stageThemes } from "@/lib/academics";
import { StageHero } from "@/components/sections/academics/StageHero";
import { ArrivalWalk } from "@/components/sections/academics/ArrivalWalk";
import { EarlyYearsContent } from "@/components/sections/academics/EarlyYearsContent";
import { VisitCta } from "@/components/sections/academics/VisitCta";

export const metadata: Metadata = {
  title: "Early Years",
  description:
    "The Early Years Foundation Stage at Avi-Cenna International School, Ikeja — ages 2 to 5, in a purpose-designed section of the school with its own enclosed outdoor area.",
  alternates: { canonical: "/academics/early-years" },
};

/**
 * The stage colour is set once here, on the page root, and every component
 * below reads --stage / --stage-ink / --stage-tint from it. That is why none
 * of them takes a `stage` prop or branches on one.
 */
export default function EarlyYearsPage() {
  return (
    <main id="main" style={stageThemes[earlyYears.id]}>
      <StageHero
        floor={earlyYears.floor}
        eyebrow={earlyYears.eyebrow}
        heading={earlyYears.heading}
        intro={earlyYears.intro}
      />
      <ArrivalWalk />
      <EarlyYearsContent />
      <VisitCta />
    </main>
  );
}
