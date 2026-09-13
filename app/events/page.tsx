import type { Metadata } from "next";
import { EventsHero } from "@/components/sections/events/EventsHero";
import { EventsList } from "@/components/sections/events/EventsList";

export const metadata: Metadata = {
  title: "Events & School Calendar",
  description:
    "Explore upcoming events, academic honours, inter-house sports, cultural festivals, and community gatherings at Avi-Cenna International School, Ikeja, Lagos.",
  alternates: { canonical: "/events" },
};

/**
 * /events — The school calendar and events discovery hub.
 *
 * Combines the site's signature navy PageHero with an interactive
 * events list inspired by clean horizontal card layouts, complete with
 * date filtering (All, Today, This Week, This Month, This Year), keyword
 * search, event details inspection, and seat reservation / RSVP.
 */
export default function EventsPage() {
  return (
    <main id="main">
      <EventsHero />
      <EventsList />
    </main>
  );
}
