import type { Metadata } from "next";
import { NotFound } from "@/components/sections/NotFound";

export const metadata: Metadata = {
  title: "Page not found",
  /* Nothing here should ever be indexed or offered as a search result. */
  robots: { index: false, follow: true },
};

/**
 * The global 404, rendered for every unmatched route in the app.
 *
 * It sits inside the root layout, so it keeps the header and the footer — the
 * whole site is one tap away from a dead end, which is why the page itself
 * only needs to offer the one door.
 */
export default function NotFoundPage() {
  return (
    <main id="main">
      <NotFound />
    </main>
  );
}
