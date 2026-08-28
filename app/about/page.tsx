import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { SchoolFilm } from "@/components/sections/about/SchoolFilm";
import { Overview } from "@/components/sections/about/Overview";
import { VisionMission } from "@/components/sections/about/VisionMission";
import { Values } from "@/components/sections/about/Values";
import { History } from "@/components/sections/about/History";
import { Leadership } from "@/components/sections/about/Leadership";
import { Careers } from "@/components/sections/about/Careers";
import { Anthem } from "@/components/sections/about/Anthem";

export const metadata: Metadata = {
  title: "About",
  description:
    "Avi-Cenna International School is an independent, secular day and boarding school in Ikeja, Lagos, founded in 1989 with seventy students and eight teachers. Our vision, values, history, and the people who lead the school.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Avi-Cenna International School",
    description:
      "Founded in 1989 with seventy students and eight teachers. Thirty nationalities, one school in Ikeja, Lagos.",
    type: "website",
  },
};

/**
 * /about — six pages from the old site in one route.
 *
 * The order is an argument rather than a table of contents: who the school is
 * now, what it is trying to do, what it holds to, where it came from, who runs
 * it, how to join it, and then the anthem to close. History sits in the middle
 * rather than the top because the hero has already opened on the name, and a
 * parent reading this wants the present-day school before the founding story.
 */
export default function AboutPage() {
  return (
    <main id="main">
      <AboutHero />
      <SchoolFilm />
      <Overview />
      <VisionMission />
      <Values />
      <History />
      <Leadership />
      <Careers />
      <Anthem />
    </main>
  );
}
