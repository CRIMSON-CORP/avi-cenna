import type { Metadata } from "next";
import { admissionsHero } from "@/lib/admissions";
import { PageHero } from "@/components/ui/PageHero";
import { WhyApply } from "@/components/sections/admissions/WhyApply";
import { Procedure } from "@/components/sections/admissions/Procedure";
import { WhatToBring } from "@/components/sections/admissions/WhatToBring";
import { AdmissionsCta } from "@/components/sections/admissions/AdmissionsCta";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How to apply to Avi-Cenna International School, Ikeja: admission forms, the entrance examination, interview with the Principal, and the documents to bring.",
  alternates: { canonical: "/admissions" },
};

/**
 * /admissions — the Admission Overview and Admission Procedure pages from the
 * current site, folded into one route.
 *
 * Reasons first, then process: a parent has to want the school before the fee
 * and the paperwork mean anything. The uniform gallery that used to sit at the
 * bottom of the procedure page now has a route of its own — nobody looking for
 * uniform photographs would think to scroll past bank details to find them.
 */
export default function AdmissionsPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={admissionsHero.eyebrow}
        headline={admissionsHero.headline}
        body={admissionsHero.body}
        facts={admissionsHero.facts}
      />
      <WhyApply />
      <Procedure />
      <WhatToBring />
      <AdmissionsCta showUniformLink />
    </main>
  );
}
