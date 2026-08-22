import type Lenis from "lenis";

/**
 * Module-level handle on the single Lenis instance, so UI that needs to freeze
 * the page (the nav overlay) can stop it properly rather than fighting it with
 * `overflow: hidden`, which Lenis ignores.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}
