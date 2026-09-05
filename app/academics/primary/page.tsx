import type { Metadata } from "next";
import { primary, stageThemes } from "@/lib/academics";
import { StageHero } from "@/components/sections/academics/StageHero";
import { StageGallery } from "@/components/sections/academics/StageGallery";
import { galleries } from "@/lib/galleries";
import { PrimaryContent } from "@/components/sections/academics/PrimaryContent";
import { SchoolDay } from "@/components/sections/academics/SchoolDay";
import { VisitCta } from "@/components/sections/academics/VisitCta";

export const metadata: Metadata = {
  title: "Primary School",
  description:
    "The Primary School at Avi-Cenna International School, Ikeja — Years 1 to 6, following the National Curriculum for England and Wales, with KS2 SATs at the end of Year 6.",
  alternates: { canonical: "/academics/primary" },
};

export default function PrimaryPage() {
  return (
    <main id="main" style={stageThemes[primary.id]}>
      <StageHero
        floor={primary.floor}
        eyebrow={primary.eyebrow}
        heading={primary.heading}
        intro={primary.intro}
      />
      <StageGallery gallery={galleries.primary} />
      <PrimaryContent />
      <SchoolDay eyebrow={primary.day.eyebrow} hours={primary.day.hours} />
      <VisitCta />
    </main>
  );
}
