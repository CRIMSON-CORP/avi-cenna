/**
 * Content for /about.
 *
 * Six pages from the old site — Overview, Vision/Mission/Values, History,
 * Leadership, Careers and the School Anthem — folded into one route. Each
 * block below is one section, and the `id` on each doubles as the anchor the
 * About entry in `navigation` points at.
 *
 * Same rule as lib/site.ts: no component hardcodes a string, so copy can be
 * edited here without opening a .tsx file.
 */

import { site } from "./site";

/* ------------------------------------------------------------- HERO ------
   States what the school is, in the present tense — the job of an About
   hero. The founding story and the namesake belong to the history section
   further down, which is where the school's own site puts them.

   The headline is the school's own phrase for itself. The weight break is
   the page's typographic signature: the same size in extralight and then in
   extrabold, so the emphasis lands without a second typeface. */

export const aboutHero = {
  eyebrow: "About us",
  /** The school's own phrase for itself, from the About page. */
  headline: { light: "A school that operates", bold: "as a family." },
  /** The opening paragraph of the old About page, unchanged. */
  body: "Avi-Cenna International School is an independent, secular day and boarding school for boys and girls from age 2 to age 16. We are a thriving community where you will find students fully engaged and eager to learn.",
  /** The facts a parent checks first, read off the copy above. */
  facts: ["Day & boarding", "Ages 2 to 16", "Independent & secular", "Founded 1989"],
} as const;

/* ------------------------------------------------------------- FILM ------
   The old About page opened with this video, above the copy, so it keeps that
   position. It loads only when someone asks for it — see SchoolFilm.tsx. */

export const aboutFilm = {
  videoId: "s6YlleRtwQQ",
  title: "Back to School Instructional Video",
  channel: "Avi TV",
} as const;

/* ---------------------------------------------------------- OVERVIEW ---- */

export const aboutOverview = {
  id: "overview",
  eyebrow: "Who we are",
  heading: "Purposeful, and happy with it.",
  /* The hero carries the school's opening paragraph, so this section runs the
     three that followed it, in their original order and wording. */
  /** Set larger than the paragraphs that follow it. */
  lead: "One of the most striking features of the school is its atmosphere: happy children and young adults going about their business in a purposeful manner.",
  body: [
    "Avi-Cenna operates as a family, and the relationship between staff and students is exceptionally warm, built on trust and mutual respect — a good starting point for a fine education.",
    "Our teachers are passionate about what they teach and are strongly committed to the ethos of continuous improvement, always striving to get the best from their students and to provide an academic education of the highest possible standard.",
  ],
  /** The fourth paragraph, lifted out of the flow — the section's one loud
      moment, because it is the most quotable fact the school has. */
  pullQuote: {
    figure: "30",
    label: "nationalities represented",
    body: "Our students are exposed to cultural differences early and are sensitised to various cultural nuances, thus equipping them to thrive in our shrinking global village.",
  },
  image: {
    src: "/images/IMG_0013-scaled.jpg",
    alt: "Avi-Cenna students together on the school grounds in Ikeja",
    focal: "50% 45%",
  },
} as const;

/* ------------------------------------------------- VISION & MISSION ----- */

export const aboutVision = {
  id: "vision",
  eyebrow: "Vision & mission",
  heading: "Inspired to act.",
  vision:
    "We are dedicated to creating a safe environment where children can learn and develop, and are inspired to act —",
  /** A real triad, taken word for word from the school's vision statement.
      It carries itself — nothing has been added to gloss it. */
  acts: ["information and knowledge", "their passions", "their curiosity"],
  missionEyebrow: "Mission",
  mission: [
    "Avi-Cenna aims to provide a broad and stimulating educational experience of the highest quality for all its students in Lagos, Nigeria.",
    "We believe that school life should be valued for itself, and not only as a preparation for adulthood.",
    "The school aims for all its students to achieve very high standards in both the formal curriculum and in the many extra-curricular activities on offer. We hope that their enjoyment of both work and play — and the friendships they make here — help them become well-rounded young people, ready to make their contribution to the world in the years ahead.",
  ],
} as const;

/* ------------------------------------------------------------ VALUES ---- */
/* Seven, as the school writes them. Set as rows rather than a card grid:
   seven does not divide into a tidy grid, and rows let the value word carry
   the weight while its definition stays comfortably readable. */

export type AboutValue = { word: string; body: string };

export const aboutValues = {
  id: "values",
  eyebrow: "What we hold to",
  heading: "Seven values, in plain words.",
  items: [
    {
      word: "Diversity",
      body: "We recognise and celebrate the unique nature of each person in the school community.",
    },
    {
      word: "Excellence",
      body: "We encourage continuous learning and improvement.",
    },
    {
      word: "Ethics",
      body: "We promote moral and ethical values which reflect truth, honesty and positive behaviour.",
    },
    {
      word: "Creativity",
      body: "We provide an environment which is stimulating, caring and vibrant, and which encourages enthusiasm and creativity.",
    },
    {
      word: "Individuality",
      body: "We emphasise participation and the achievement of a personal best, to increase self-esteem and personal well-being.",
    },
    {
      word: "Leadership",
      body: "We provide opportunities for students of different ages to develop interpersonal and leadership skills.",
    },
    {
      word: "Collaboration",
      body: "We build positive relationships and work together to improve our community.",
    },
  ] satisfies AboutValue[],
} as const;

/* ----------------------------------------------------------- HISTORY ---- */

export const aboutHistory = {
  id: "history",
  eyebrow: "Our beginning",
  heading: "Seventy students. Eight teachers.",
  intro:
    "Avi-Cenna had its roots in a vision developed by Mr. and Mrs. Foudeh, who came to Nigeria from Jordan. They shared a wish to provide a quality international education in an enabling and inspiring environment — and to instil in young minds that there are no boundaries in education.",
  /** The heading carries the roll and the staff, so this only has to carry
      the when. Set large in heritage gold beside it. */
  founded: { year: "1989", label: "Opened in Lagos" },
  /** The namesake, told properly — the school's own account of him.
      The four disciplines arrive one at a time and the last line resolves
      them, which is the one moment of theatre on the page. It sits here
      rather than in the hero because it is history, not identity. */
  namesake: {
    eyebrow: "The name",
    disciplines: ["Physics.", "Metaphysics.", "Mathematics.", "Logic."],
    resolve: "All four, before he was sixteen.",
    body: "The name of the school emanates from a great scholar, role model, mentor and philosopher, Avi-Cenna, who lived between 986 and 1037 A.D. He was popularly known as “The Prince of Physicians” because of the vast contributions he made in the field of medicine. He wrote the masterpiece “Qanun” at the age of 21, and it remained the principal authority in medicine for several centuries in Europe and Asia.",
    facts: [
      { value: "986–1037", label: "Lived" },
      { value: "21", label: "Age at which he wrote the Qanun" },
      { value: "16", label: "Age by which he had mastered four disciplines" },
    ],
  },
  evolution: {
    eyebrow: "Our evolution",
    body: "The school has expanded steadily and has an outstanding reputation for achieving the best for all students. Avi-Cenna is now a well-established co-educational school following the National Curriculum for England and Wales, catering for students from pre-school to secondary, and serving both the Nigerian community and expatriate families seeking a British education in Lagos.",
  },
  /** Swap for archive photographs when they are available. */
  image: {
    src: "/images/DSC_4842-768x512.jpg",
    alt: "The Avi-Cenna campus in GRA, Ikeja",
  },
} as const;

/* -------------------------------------------------------- LEADERSHIP ---- */
/* `photo` is optional on purpose: until a headshot exists the card falls back
   to a monogram, which reads as a deliberate state rather than a hole. */

/* Every field is optional and a card renders only the platforms it actually
   has, so a person with one profile gets one icon rather than three dead
   ones. A person with none keeps a plain portrait and no hover reveal.

   TO ADD PROFILES: paste the full URL against the platform, e.g.
     socials: { linkedin: "https://www.linkedin.com/in/…" }
   Nothing else needs changing — the reveal switches itself on. */
export type LeaderSocials = {
  linkedin?: string;
  x?: string;
  facebook?: string;
  instagram?: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  photo?: string;
  socials?: LeaderSocials;
};

export const aboutLeadership = {
  id: "leadership",
  eyebrow: "Who leads the school",
  heading: "The people responsible.",
  body: "Between them they carry the founding vision, the curriculum, and the daily running of three school stages.",
  people: [
    {
      id: "foudeh",
      name: "Darwish Foudeh",
      role: "Founder",
      photo: "/images/leaders/Darwish-Foudeh.jpg",
      /* ⚠️ PLACEHOLDER — NOT REAL PROFILES. DELETE BEFORE LAUNCH.
         These point at the platforms' own home pages purely so the liquid
         hover reveal can be seen working on one card. Every icon here is
         labelled "Darwish Foudeh on …" and goes somewhere that is not his
         profile, so shipping it as-is would be actively misleading.
         Replace with the real URLs, or delete this block. */
      socials: {
        linkedin: "https://www.linkedin.com/",
        x: "https://x.com/",
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
      },
    },
    {
      id: "olubajo",
      name: "Paul Olubajo",
      role: "Principal",
      photo: "/images/leaders/Paul-Olubajo-Principal.jpg",
    },
    {
      id: "bakare",
      name: "Afolabi Bakare",
      role: "Acting Head of Secondary School",
      photo: "/images/leaders/afolabi-bakare.jpg",
    },
    {
      id: "balogun",
      name: "Bolanle Balogun",
      role: "Head of Primary",
      photo: "/images/leaders/Bolanle-Balogun-Head-of-Primary.jpg",
    },
    {
      id: "kono-ugen",
      name: "Ajiri Kono-Ugen",
      role: "Head of Curriculum, Secondary",
      photo: "/images/leaders/Ajiri-Kono-Ugen-Head-Of-Curriculum-Secondary.jpg",
    },
    {
      id: "acha",
      name: "Felix Acha",
      role: "Head of Curriculum, Primary",
      photo: "/images/leaders/Felix-Acha-Head-of-Curriculum-Primary-2.jpg",
    },
    {
      id: "egbe",
      name: "Nnena Egbe",
      role: "Deputy Head, EYFS",
      photo: "/images/leaders/Nnena-Egbe-Deputy-Head-EYFS.jpg",
    },
  ] satisfies Leader[],
} as const;

/* ------------------------------------------------------------ ANTHEM ---- */
/* The school's own anthem. The emphasised line is where the tagline
   "…the trailblazers" comes from, which is why it closes the page. */

export const aboutAnthem = {
  id: "anthem",
  eyebrow: "School anthem",
  lines: [
    "I shall ever be proud to see myself",
    "A student of great Avi-Cenna International School",
    "My eyes to God and knowledge you open",
    "Your banner will I therefore bear",
    "In all fields of endeavour",
    "To be either the first or with the first",
    "In serving my country and God throughout my life",
    "I shall ever be proud",
    "Avi-Cenna School",
  ],
  /** Index of the line the section sets apart. */
  emphasis: 5,
  footnote: `${site.tagline} — the school motto, and the line it comes from.`,
} as const;

/* ----------------------------------------------------------- CAREERS ---- */

/* A teaser now, not the whole story — careers has its own page. The heading
   and body are the school's own words from that page. */
export const aboutCareers = {
  id: "careers",
  eyebrow: "Careers at Avi-Cenna",
  heading: "Be a part of a winning team.",
  body: "Opportunities to join the staff at Avi-Cenna arise from time to time. We invite applications from experienced, creative and talented teaching and non-teaching specialists.",
  cta: { label: "See open positions", href: "/careers" },
} as const;
