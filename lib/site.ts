/**
 * Site content. Every string the homepage renders lives here so copy can be
 * edited without touching component code — and so this file can be swapped for
 * a CMS fetch later without changing a single component.
 */

export const site = {
  name: "Avi-Cenna International School",
  shortName: "Avi-Cenna",
  tagline: "…the trailblazers",
  email: "info@avi-cenna.com",
  phones: ["+234 1-3426271", "081 8444 5444"],
  address: "6 Harold Shodipo Crescent, GRA, Ikeja, Lagos, Nigeria",
  socials: {
    facebook: "https://www.facebook.com/AviCennaInternationalSchool/",
    instagram: "https://www.instagram.com/avicennaschool/",
  },
  /* Was an external appointment system on its own subdomain. It is a page
     on this site now, so a visitor never leaves and the request lands in the
     school's own inbox rather than a third party's dashboard. Every "Book a
     visit" button on the site reads this one value. */
  bookVisit: "/book-visit",
} as const;

/* --------------------------------------------------------------- TOUR ---- */
/* The old site gave the tour film a page of its own, which meant leaving
   whatever you were reading to go and watch it. It plays in a dialog now — see
   components/ui/VideoDialog.tsx — so the film lives here rather than behind a
   route, and nothing loads until someone asks for it. */

export const tour = {
  src: "/videos/School-Tour-Video.mp4",
  /** Frame six seconds in — the title card over the school entrance. */
  poster: "/videos/School-Tour-Video-poster.jpg",
  title: "A day at Avi-Cenna",
  caption: "A walk through the school — classrooms, grounds, and an ordinary school day.",
  /** Runtime, so nobody has to press play to find out what they are in for. */
  duration: "7 min",
} as const;

/* ---------------------------------------------------------------- NAV ---- */
/* Mirrors the current site's menu. Routes don't exist yet — pages are being
   built progressively, so these will 404 until each section lands. */

export type NavLink = { label: string; href: string };

/** A call to action either goes somewhere or opens something where it stands. */
export type Cta = NavLink | { label: string; action: "tour" };
export type NavSection = { label: string; href: string; children?: NavLink[] };

export const navigation: NavSection[] = [
  { label: "Home", href: "/" },
  {
    /* The old site's six About pages are one route now, so these are anchors
       rather than child routes. Old URLs redirect onto the same anchors —
       see `redirects` in next.config.ts. */
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about#overview" },
      { label: "Vision & Mission", href: "/about#vision" },
      { label: "Our Values", href: "/about#values" },
      { label: "History", href: "/about#history" },
      { label: "Leadership", href: "/about#leadership" },
      /* A route of its own rather than an anchor: it carries an electoral
         procedure and a committee, which is more than a section can hold. */
      { label: "Parent-Teacher Association", href: "/about/pta" },
      /* Careers is a route of its own — it has a vacancy list and an
         application form, which is more than an anchor can carry. */
      { label: "Careers at Avi-Cenna", href: "/careers" },
      { label: "School Anthem", href: "/about#anthem" },
    ],
  },
  {
    /* Academics Overview and School Programs Overview are one page now, so
       the programs half is an anchor. The three stages keep routes of their
       own — each carries a full curriculum. */
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Academics Overview", href: "/academics" },
      { label: "Our Approach", href: "/academics#approach" },
      { label: "Early Years", href: "/academics/early-years" },
      { label: "Primary School", href: "/academics/primary" },
      { label: "Secondary School", href: "/academics/secondary" },
    ],
  },
  {
    label: "Admissions",
    href: "/admissions",
    /* Overview and Procedure are one page now, so the procedure half is an
       anchor. Uniform keeps a route of its own — it was a slider buried at
       the bottom of the procedure page, where nobody would find it. */
    children: [
      { label: "Admission Overview", href: "/admissions" },
      { label: "Admission Procedure", href: "/admissions#procedure" },
      { label: "What to Bring", href: "/admissions#what-to-bring" },
      { label: "Uniform", href: "/admissions/uniform" },
    ],
  },
  { label: "Student Life", href: "/student-life" },
  { label: "Facilities", href: "/facilities" },
  { label: "Contact", href: "/contact" },
];

/** The blue utility strip on the current site, folded into the menu overlay. */
export const utilityLinks: NavLink[] = [
  { label: "Staff Webmail", href: "http://www.avi-cenna.com/webmail" },
  { label: "Edmodo Login", href: "https://new.edmodo.com/login" },
  { label: "Microsoft 365", href: "https://www.office.com/" },
];

/* -------------------------------------------------------------- HERO ---- */

export type Slide = {
  id: string;
  eyebrow: string;
  /** Split across lines in the markup — each string is one display line. */
  headline: [string, string];
  body: string;
  primary: Cta;
  secondary: Cta;
  /** `focal` is the object-position, so faces survive the blob's tight crop. */
  image: { src: string; alt: string; focal: string };
  /** Small proof line under the buttons. */
  proof: string;
};

export const slides: Slide[] = [
  {
    id: "results",
    eyebrow: "Cambridge International",
    headline: ["Consistently top", "performers."],
    body: "Year after year, Cambridge recognises our students among the strongest IGCSE candidates in the region — taught by people who know each of them by name.",
    primary: { label: "Book a visit", href: site.bookVisit },
    secondary: { label: "Take the tour", action: "tour" },
    image: {
      src: "/images/IMG_0435-2-scaled.jpg",
      alt: "Four Avi-Cenna secondary students working together around a laptop in the school grounds",
      focal: "50% 58%",
    },
    proof: "Recognised by Cambridge Assessment International Education",
  },
  {
    id: "community",
    eyebrow: "Day & boarding · Ages 2½ to 16",
    headline: ["A warm, friendly", "place to grow."],
    body: "An independent, secular school where creativity is valued, bullying has no room, and every child's progress is measured against their own ability — never against someone else's.",
    primary: { label: "Book a visit", href: site.bookVisit },
    secondary: { label: "Take the tour", action: "tour" },
    image: {
      src: "/images/Av-web-pic-411-1536x1020.jpg",
      alt: "Avi-Cenna students talking and laughing together outside on the school grounds",
      focal: "55% 40%",
    },
    proof: "An open-door policy — come and see us any time",
  },
  {
    id: "explore",
    eyebrow: "Student life & facilities",
    headline: ["Room to", "explore."],
    body: "A wide spectrum of co-curricular activities, from the International Award for Young People to sport, music and drama — because a school day should be bigger than a timetable.",
    primary: { label: "Take the tour", action: "tour" },
    secondary: { label: "Book a visit", href: site.bookVisit },
    image: {
      src: "/images/IMG_1885-scaled.jpg",
      alt: "Avi-Cenna students together during a celebration in the school library",
      focal: "50% 52%",
    },
    proof: "Delivery partner for the International Award for Young People",
  },
];

/* ------------------------------------------------------------- STAGES ---- */

export const stages = [
  {
    label: "Early Years",
    age: "Age 2½ to 5",
    href: "/academics/early-years",
    blurb: "First steps, taken carefully.",
  },
  {
    label: "Primary School",
    age: "Age 6 to 10",
    href: "/academics/primary",
    blurb: "Curiosity, given structure.",
  },
  {
    label: "Secondary School",
    age: "Age 11 to 16",
    href: "/academics/secondary",
    blurb: "Ready for what comes next.",
  },
] as const;

/* ------------------------------------------------------ WHY CHOOSE US ---- */
/* The six reasons from the current site, given titles and room to breathe. */

export type Reason = {
  id: string;
  image: string;
  icon: "award" | "heart" | "spark" | "shield" | "chart" | "door";
  title: string;
  body: string;
};

export const reasons: Reason[] = [
  {
    id: "cambridge",
    image: "/images/why-choose/3dicons-notebook-dynamic-color.png",
    icon: "award",
    title: "Cambridge excellence",
    body: "Consistent recognition from Cambridge as top performers in the IGCSE examinations.",
  },
  {
    id: "welcome",
    image: "/images/why-choose/3dicons-gingerbread-dynamic-color.png",
    icon: "heart",
    title: "A warm welcome",
    body: "A friendly, welcoming atmosphere — you see it reflected in our students before anyone tells you about it.",
  },
  {
    id: "creativity",
    image: "/images/why-choose/3dicons-color-palette-dynamic-color.png",
    icon: "spark",
    title: "Creativity, valued",
    body: "Enhanced through a wide spectrum of co-curricular activities, not squeezed into the margins of the week.",
  },
  {
    id: "anti-bullying",
    image: "/images/why-choose/3dicons-shield-dynamic-color.png",
    icon: "shield",
    title: "A firm anti-bullying policy",
    body: "Clearly written, consistently enforced, and understood by every child in the school.",
  },
  {
    id: "progress",
    image: "/images/why-choose/3dicons-target-dynamic-color.png",
    icon: "chart",
    title: "Progress, measured personally",
    body: "Each child's progress is measured against their own ability, so no child is ever made to feel inadequate.",
  },
  {
    id: "open-door",
    image: "/images/why-choose/3dicons-chat-bubble-dynamic-color.png",
    icon: "door",
    title: "An open-door policy",
    body: "Come and see us for a tour of the school. No appointment theatre, no rehearsed version of the day.",
  },
];

/* ------------------------------------------------------------- TRUST ---- */

export type Accreditation = {
  id: string;
  mark: "cambridge" | "bsa" | "aisen" | "award";
  name: string;
  full: string;
  body: string;
};

export const accreditations: Accreditation[] = [
  {
    id: "cambridge",
    mark: "cambridge",
    name: "Cambridge International",
    full: "Cambridge Assessment International Education",
    body: "A registered Cambridge International School, delivering the IGCSE curriculum.",
  },
  {
    id: "bsa",
    mark: "bsa",
    name: "BSA",
    full: "Boarding Schools' Association",
    body: "A member school, held to the BSA's standards for boarding care and welfare.",
  },
  {
    id: "aisen",
    mark: "aisen",
    name: "AISEN",
    full: "Association of International School Educators of Nigeria",
    body: "Part of the national body for international school educators in Nigeria.",
  },
  {
    id: "award",
    mark: "award",
    name: "The International Award",
    full: "The International Award for Young People",
    body: "A licensed delivery partner, running the Award programme with our students.",
  },
];

/* ------------------------------------------------------- AFFILIATIONS ---- */
/* Real logo artwork, shown as a marquee. Rendered with `fill` + object-contain
   inside a fixed box, so the wildly different intrinsic sizes of these files
   don't need normalising by hand. */

export type Affiliation = { id: string; name: string; src: string };

export const affiliations: Affiliation[] = [
  {
    id: "cambridge",
    name: "Cambridge Assessment International Education",
    src: "/images/affiliations/Cambridge-logo.png",
  },
  {
    id: "bsa",
    name: "Boarding Schools' Association",
    src: "/images/affiliations/Boarding-Ass-logo.png",
  },
  {
    id: "aisen",
    name: "Association of International School Educators of Nigeria",
    src: "/images/affiliations/Aisen-1.png",
  },
  {
    id: "award",
    name: "The International Award for Young People",
    src: "/images/affiliations/INTERNATIONAL-AWARD-LOGO_1-300x107-1.jpg",
  },
];

/* ------------------------------------------------------------ FOOTER ---- */

/** The "Quick Links" column from the current site's footer. */
export const quickLinks: NavLink[] = [
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "PTA", href: "/pta" },
  { label: "School Anthem", href: "/about/school-anthem" },
  { label: "Excursions", href: "/student-life/excursions" },
  { label: "Events", href: "/student-life/events" },
  { label: "Awards", href: "/student-life/awards" },
];

/** The dated notice the current site carries on its homepage. */
export const termNotice = {
  eyebrow: "Next term",
  title: "Second Term Begins",
  date: "Monday 5 January",
  cta: { label: "Make an enquiry", href: site.bookVisit },
};

/** Links out to Google Maps rather than embedding an iframe — a third-party
    frame would be heavy and would not respect the palette. */
export const directions = {
  label: "Get directions",
  href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`,
};
