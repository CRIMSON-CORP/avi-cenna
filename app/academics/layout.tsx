"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis } from "@/components/providers/lenis";

function AccademicsLayout({ children }: { children: LayoutProps<"/academics"> }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return children;
}

export default AccademicsLayout;
