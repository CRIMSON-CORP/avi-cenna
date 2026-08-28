import type { Metadata } from "next";
import { secondary, stageThemes } from "@/lib/academics";
import { StageHero } from "@/components/sections/academics/StageHero";
import { SecondaryContent } from "@/components/sections/academics/SecondaryContent";
import { VisitCta } from "@/components/sections/academics/VisitCta";

export const metadata: Metadata = {
  title: "Secondary School",
  description:
    "The Secondary School at Avi-Cenna International School, Ikeja — Years 7 to 11, Key Stage 3 Checkpoint and Cambridge IGCSE, externally examined and marked in England.",
  alternates: { canonical: "/academics/secondary" },
};

export default function SecondaryPage() {
  return (
    <main id="main" style={stageThemes[secondary.id]}>
      <StageHero
        floor={secondary.floor}
        eyebrow={secondary.eyebrow}
        heading={secondary.heading}
        intro={secondary.intro}
      />
      <SecondaryContent />
      <VisitCta />
    </main>
  );
}
