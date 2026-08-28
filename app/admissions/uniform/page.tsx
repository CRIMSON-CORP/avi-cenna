import type { Metadata } from "next";
import { uniform } from "@/lib/admissions";
import { PageHero } from "@/components/ui/PageHero";
import { UniformContent } from "@/components/sections/admissions/UniformContent";
import { AdmissionsCta } from "@/components/sections/admissions/AdmissionsCta";

export const metadata: Metadata = {
  title: "Uniform",
  description:
    "The Avi-Cenna International School uniform — the dress code, what is worn at each stage, and the secondary PE kit rules.",
  alternates: { canonical: "/admissions/uniform" },
};

export default function UniformPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={uniform.eyebrow}
        headline={uniform.headline}
        body={uniform.intro}
      />
      <UniformContent />
      <AdmissionsCta />
    </main>
  );
}
