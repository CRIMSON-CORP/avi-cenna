import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { VisitExpect } from "@/components/sections/visit/VisitExpect";
import { VisitForm } from "@/components/sections/visit/VisitForm";
import { visitHero } from "@/lib/visits";

export const metadata: Metadata = {
  title: "Book a visit",
  description:
    "Arrange a visit to Avi-Cenna International School in Ikeja, Lagos. Choose a weekday that suits you and the office will confirm a time.",
  alternates: { canonical: "/book-visit" },
};

/**
 * Replaces the appointment.avi-cenna.com subdomain. Every "Book a visit"
 * button reaches this through `site.bookVisit`.
 */
export default function BookVisitPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={visitHero.eyebrow}
        headline={visitHero.headline}
        body={visitHero.body}
        facts={visitHero.facts}
      />
      <VisitExpect />
      <VisitForm />
    </main>
  );
}
