import { faqItems } from "@/lib/faq";
import { FaqList } from "./FaqList";

/**
 * The twelve questions, on the homepage.
 *
 * A server shell around the client accordion, for one reason: these are the
 * questions people type into a search engine, so the page ought to answer them
 * there too. The FAQPage structured data below is generated from exactly the
 * same content the section renders, which is the only way the two can never
 * drift apart.
 */
export function Faq() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FaqList />
    </>
  );
}
