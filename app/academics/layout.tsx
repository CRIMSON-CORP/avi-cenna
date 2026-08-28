"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/components/providers/lenis";

/**
 * Resets scroll on navigation between the academics pages.
 *
 * Next.js restores scroll on client-side navigation, but Lenis owns the scroll
 * position and does not hear about the route change — so moving from the
 * ladder on /academics to /academics/primary would leave you part-way down the
 * new page. Lenis has to be told directly; window.scrollTo is the fallback for
 * when it is not running, which is the case under prefers-reduced-motion.
 */
export default function AcademicsLayout({ children }: LayoutProps<"/academics">) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}
