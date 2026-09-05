import type { StageId } from "@/lib/academics";

/**
 * The photographs scattered under each stage hero.
 *
 * Dimensions are recorded because the scatter positions cards by percentage
 * of the container and needs the ratio before the file loads — and because
 * next/image wants them anyway. Every one of these is 3:2 landscape, which is
 * why the layout leans on rotation and overlap rather than varying shape.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  /** Read out to a screen reader in place of the image. */
  alt: string;
  /** Shown under the card, and in the lightbox. */
  caption: string;
};

export type Gallery = {
  eyebrow: string;
  heading: string;
  note: string;
  photos: Photo[];
};

const dir = "/images/grades";

export const galleries: Record<StageId, Gallery> = {
  early: {
    eyebrow: "A look inside",
    heading: "Days in the Early Years",
    note: "Photographs from our own classrooms and garden — no stock, no staging.",
    photos: [
      {
        src: `${dir}/early-years/IMG_0013-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "Four children at a classroom table sorting magnetic letters and phonics cubes, with rhyming-word charts on the shelves behind them.",
        caption: "Rhyming words",
      },
      {
        src: `${dir}/early-years/IMG_0486-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "Three children lean out of a green and yellow playhouse in the Early Years garden, waving, under a neem tree.",
        caption: "The garden",
      },
      {
        src: `${dir}/early-years/IMG_0603-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "A line of Early Years children wrapped in towels after a swimming lesson, filing back through a gate hung with balloons.",
        caption: "Back from the pool",
      },
    ],
  },
  primary: {
    eyebrow: "A look inside",
    heading: "Days in Primary",
    note: "Photographs from our own classrooms and library — no stock, no staging.",
    photos: [
      {
        src: `${dir}/primary/Av-web-pic-356-2048x1360.jpg`,
        width: 2048,
        height: 1360,
        alt: "Two Primary pupils at a library table, each holding an open book and looking up from their reading.",
        caption: "In the library",
      },
      {
        src: `${dir}/primary/Av-Intl-Day-2019-200-2048x1360.jpg`,
        width: 2048,
        height: 1360,
        alt: "Two pupils in International Day dress laughing in a Primary classroom, one wearing a wide straw hat.",
        caption: "International Day",
      },
      {
        src: `${dir}/primary/IMG_1885-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "A Primary class and their teachers crowded around a cake shaped like a bookcase, holding up their favourite books.",
        caption: "The library's birthday",
      },
      {
        src: `${dir}/primary/IMG_8047-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "Three pupils and a teacher in white woven dress and beadwork, ready for the International Day procession.",
        caption: "Dressed for the day",
      },
    ],
  },
  secondary: {
    eyebrow: "A look inside",
    heading: "Days in Secondary",
    note: "Photographs from our own grounds, library and Sports Day — no stock, no staging.",
    photos: [
      {
        src: `${dir}/secondary/IMG_0435-2-scaled.jpg`,
        width: 2560,
        height: 1707,
        alt: "Four Secondary students sitting on the grass against a hedge, heads together over a laptop.",
        caption: "Between lessons",
      },
      {
        src: `${dir}/secondary/Av-web-pic-221-1536x1020.jpg`,
        width: 1536,
        height: 1020,
        alt: "Secondary students in blazers tapping in at the school turnstiles at the start of the day.",
        caption: "Morning gate",
      },
      {
        src: `${dir}/secondary/Av-web-pic-333-1536x1020.jpg`,
        width: 1536,
        height: 1020,
        alt: "Two Secondary students working at laptops in the school library, shelves of books behind them.",
        caption: "Study period",
      },
      {
        src: `${dir}/secondary/Avi-30th-Sport-Day-2020-2590-scaled.jpg`,
        width: 2560,
        height: 1700,
        alt: "The opening leg of a relay at Sports Day, four runners in house colours coming off the bend.",
        caption: "Sports Day",
      },
    ],
  },
};
