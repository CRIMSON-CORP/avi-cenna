"use client";

/**
 * Single registration point for GSAP and its plugins.
 *
 * The whole plugin suite ships in the public `gsap` package — MorphSVG,
 * DrawSVG, SplitText and the rest are all included. Registering them in one
 * module keeps every component importing from the same place and stops the
 * plugins being registered a dozen times over.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import CustomEase from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, DrawSVGPlugin, CustomEase);

  /* The hero's signature curves. `swoop` is the arrival: almost all of the
     distance is covered in the first third, then it eases into place — that
     front-loading is what makes a reveal feel confident rather than floaty.
     `sink` is its opposite, used when copy leaves downward. */
  CustomEase.create("swoop", "M0,0 C0.12,0.78 0.2,1 1,1");
  CustomEase.create("sink", "M0,0 C0.55,0 0.78,0.28 1,1");
}

/* Re-exported so every component that already imports it from here keeps
   working; the definition moved to lib/isomorphic.ts so pages that want the
   hook without the plugin suite can reach it without importing GSAP. */
export { useIsomorphicLayoutEffect } from "./isomorphic";

export { gsap, ScrollTrigger, SplitText, MorphSVGPlugin, DrawSVGPlugin, CustomEase };
