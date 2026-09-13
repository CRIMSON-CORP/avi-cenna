import { PageHero } from "@/components/ui/PageHero";

const eventsHero = {
  eyebrow: "CALENDAR",
  headline: {
    light: "Experience campus life &",
    bold: "Avi-Cenna events.",
  },
  body: "From Cambridge academic honours and inter-house athletic championships to STEAM expos, cultural celebrations, and parent forums — discover the vibrant gatherings shaping our school community.",
  facts: [
    "Ikeja GRA Campus",
    "Parents & Guests Welcome",
    "Cambridge Academic Calendar",
  ],
} as const;

export function EventsHero() {
  return (
    <PageHero
      eyebrow={eventsHero.eyebrow}
      headline={eventsHero.headline}
      body={eventsHero.body}
      facts={eventsHero.facts}
    />
  );
}
