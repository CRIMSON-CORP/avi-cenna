import type { Metadata } from "next";
import { ptaHero } from "@/lib/pta";
import { PageHero } from "@/components/ui/PageHero";
import { Portrait } from "@/components/sections/pta/Portrait";
import { Purpose } from "@/components/sections/pta/Purpose";
import { Election } from "@/components/sections/pta/Election";
import { Committee } from "@/components/sections/pta/Committee";
import { Remit } from "@/components/sections/pta/Remit";

export const metadata: Metadata = {
  title: "Parent-Teacher Association",
  description:
    "The Avi-Cenna Parent-Teacher Association: what the volunteer forum is for, how the executive committee is chosen, the six elected posts, and where the association's remit ends.",
  alternates: { canonical: "/about/pta" },
};

/**
 * /about/pta — the old site's Parent-Teacher Association page.
 *
 * The order answers the questions a parent actually asks, in the order they
 * ask them: what is this for, how would I join it, who sits on it, and what
 * is it allowed to do. The school's own page ran the other way round, opening
 * on electoral procedure — which only matters once you want the seat.
 *
 * It ends on the remit rather than a call to action. Everyone reading this
 * has already chosen the school; there is nothing left to sell them.
 */
export default function PtaPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={ptaHero.eyebrow}
        headline={ptaHero.headline}
        body={ptaHero.body}
        facts={ptaHero.facts}
      />
      <Portrait />
      <Purpose />
      <Election />
      <Committee />
      <Remit />
    </main>
  );
}
