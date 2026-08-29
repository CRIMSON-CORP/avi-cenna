import type { Metadata } from "next";
import { ContactPanel } from "@/components/sections/contact/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Avi-Cenna International School, 6 Harold Shodipo Crescent, GRA, Ikeja, Lagos. Phone, email, office hours, directions, and a message form.",
  alternates: { canonical: "/contact" },
};

/**
 * /contact — one panel, no scroll.
 *
 * The old page put a map where the answers should have been and left the
 * address, the phone number and the opening hours as unlinked text beside a
 * single unlabelled box. Here the details are the page's left half and every
 * one of them is actionable — the number dials, the address opens a map, the
 * address bar never leaves the site.
 */
export default function ContactPage() {
  return (
    <main id="main">
      <ContactPanel />
    </main>
  );
}
