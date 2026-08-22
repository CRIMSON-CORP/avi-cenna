import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The school's own logo lockup — crest, wordmark and tagline in one raster.
 *
 * The source file is a 300×89 PNG saved WITHOUT an alpha channel, so its
 * background is baked-in white. Dropped straight onto the pale blue surfaces
 * (the menu overlay, the footer) that reads as an obvious white rectangle
 * around the mark. `mix-blend-multiply` solves it without re-cutting the asset:
 * multiplying by white leaves the backdrop untouched, so the white box vanishes
 * while the blue artwork stays. This works because every surface behind the
 * logo is white or near-white — on a dark background it would fail, and the
 * asset would need a real transparent PNG or SVG instead.
 */
export function Logo({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${site.name} — home`}
      className={cn("focus-ring group inline-flex items-center", className)}
    >
      <Image
        src="/images/logo.png"
        alt={site.name}
        width={300}
        height={89}
        priority
        className="h-9 w-auto mix-blend-multiply transition-transform duration-base ease-out-expo group-hover:scale-[1.03] sm:h-11"
      />
    </Link>
  );
}
