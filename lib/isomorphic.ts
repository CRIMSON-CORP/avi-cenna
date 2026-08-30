"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";

/**
 * `useLayoutEffect` that does not warn during server rendering.
 *
 * Anything that puts an element into its "before" state has to run here, not
 * in `useEffect`: layout effects are flushed before the browser paints the
 * commit, so the first frame the user sees is already the start of the
 * animation. A passive effect runs after that paint, which shows one frame of
 * the finished layout before the animation pulls it apart.
 *
 * It lives here rather than in lib/gsap.ts, which re-exports it, because that
 * module registers the entire GSAP plugin suite on import — and the pages that
 * want this hook for a single DOM write should not be dragging GSAP into their
 * bundle to get it.
 */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A seed that is deterministic for the server and the hydration pass, then
 * becomes a fresh random number for the rest of the visit.
 *
 * The point is variety per visit WITHOUT a hydration mismatch. React renders
 * `fallback` on the server and again on the client's hydrating pass, so the
 * two agree exactly; only once hydration has finished does React read the
 * store, see a different value, and re-render with it.
 *
 * `useSyncExternalStore` rather than a `setState` in an effect: the rolled
 * value is part of what React renders, so nothing can quietly overwrite it
 * later, and there is no cascading-render lint rule to argue with. The store
 * never changes after that first read, hence the no-op subscribe.
 *
 * Someone with JavaScript off keeps `fallback`, so pass a seed you are happy
 * to look at rather than an arbitrary one.
 */
export function useClientSeed(fallback: number) {
  const rolled = useRef<number | null>(null);
  const subscribe = useCallback(() => () => {}, []);

  return useSyncExternalStore(
    subscribe,
    () => (rolled.current ??= Math.floor(Math.random() * 1_000_000)),
    () => fallback,
  );
}
