/**
 * Content for /careers, rebuilt from the school's own Career page.
 *
 * Same rule as lib/site.ts and lib/about.ts: no component hardcodes a string,
 * so copy can be edited here without opening a .tsx file. The vacancy list in
 * particular is meant to be edited often — it is the one block on the site
 * that goes stale on its own.
 */

export const careersHero = {
  eyebrow: "Careers at Avi-Cenna",
  /** The school's own headline for this page. */
  headline: { light: "Be a part of a", bold: "winning team." },
  body: "Opportunities to join the staff at Avi-Cenna arise from time to time. Vacancies are usually advertised in the local press, and details of available positions are posted here.",
} as const;

/* ----------------------------------------------------------- INVITATION -- */

export const careersInvitation = {
  id: "working-here",
  eyebrow: "Who we are looking for",
  heading: "Experienced, creative and talented.",
  body: "We invite applications from experienced, creative and talented teaching and non-teaching specialists to join our team of dynamic and committed academic professionals.",
} as const;

/* --------------------------------------------------------- SAFEGUARDING -- */
/* Set apart rather than folded into the intro. It is the most consequential
   paragraph on the page — it tells a candidate what the school will ask of
   them before they apply, and it tells a parent what the school demands of
   the people it hires. */

export const careersSafeguarding = {
  eyebrow: "Safeguarding",
  body: "Avi-Cenna International School is committed to safeguarding and promoting the security and welfare of children, and we expect all staff to share this commitment.",
  requirement:
    "All applications must be supported by at least three referees who can offer a professional appraisal of a candidate’s suitability to work with children.",
} as const;

/* ---------------------------------------------------------------- ROLE -- */
/* Two lists, deliberately kept apart: one is what the job asks of you, the
   other is what you need before you can ask for the job. Merging them into a
   single bullet list loses that distinction. */

export const careersRole = {
  id: "the-role",
  expectations: {
    eyebrow: "What the role asks",
    heading: "The successful applicant will be expected to:",
    items: [
      "Establish a secure classroom atmosphere where high standards and an appropriate pace of work are set for children.",
      "Identify clear teaching objectives, content, lesson structures and sequences appropriate to the subject matter and the pupils being taught.",
      "Provide a stimulating and challenging environment.",
      "Promote the school’s aims positively, and use effective strategies to monitor motivation and morale.",
      "Establish and develop close relationships with parents and the community.",
    ],
  },
  requirements: {
    eyebrow: "What you will need",
    heading: "Requirements",
    items: [
      "Excellent interpersonal skills.",
      "Ability to work well as part of a team.",
      "Excellent ICT and modern technology skills, with the ability to use these in a professional position and to support teaching and learning.",
      "A degree or equivalent, plus a teaching qualification.",
      "Relevant experience of teaching the National Curriculum of England.",
    ],
  },
} as const;

/* ------------------------------------------------------------ VACANCIES -- */

export type VacancyCategory = "Teaching" | "Non-teaching" | "Boarding";
export type EmploymentType = "Full-time" | "Part-time";

export type Vacancy = {
  /** Stable identity. Applications are stored against this, so it must not
      change once a role has been advertised. */
  id: string;
  /** What appears in ?role= when someone shares a position. */
  slug: string;
  title: string;
  category: VacancyCategory;
  employmentType: EmploymentType;
  summary: string;
  requirements: string[];
  /** ISO date. Sorting and "posted 3 weeks ago" both read off this. */
  postedAt: string;
  isOpen: boolean;
};

/* DUMMY DATA — replace with the real table.
   The five titles come from the school's current Career page; the summaries
   and requirements are placeholders written to exercise the layout, and
   should be rewritten by whoever owns the role. Only `getVacancies` below
   knows this is a hardcoded array. */
const VACANCIES: Vacancy[] = [
  {
    id: "vac_01",
    slug: "igcse-english",
    title: "IGCSE English Teacher",
    category: "Teaching",
    employmentType: "Full-time",
    summary:
      "Teach English Language and Literature to IGCSE candidates in the secondary school.",
    requirements: [
      "A degree in English or a related field, plus a teaching qualification",
      "Experience teaching the Cambridge IGCSE syllabus",
    ],
    postedAt: "2026-07-14",
    isOpen: true,
  },
  {
    id: "vac_02",
    slug: "ict-teacher",
    title: "ICT Teacher",
    category: "Teaching",
    employmentType: "Full-time",
    summary:
      "Lead ICT across the secondary school and support colleagues in using technology well in their own teaching.",
    requirements: [
      "Five years’ teaching experience",
      "A degree or equivalent, plus a teaching qualification",
    ],
    postedAt: "2026-07-14",
    isOpen: true,
  },
  {
    id: "vac_03",
    slug: "boarding-parent",
    title: "Boarding Parent",
    category: "Boarding",
    employmentType: "Full-time",
    summary:
      "Live-in pastoral care for boarders, working with the boarding team on welfare, routine and house life.",
    requirements: ["Muslim, male", "Experience in a residential or pastoral role"],
    postedAt: "2026-06-30",
    isOpen: true,
  },
  {
    id: "vac_04",
    slug: "laboratory-assistant",
    title: "Laboratory Assistant",
    category: "Non-teaching",
    employmentType: "Full-time",
    summary:
      "Prepare practicals, maintain equipment and keep the science laboratories safe and stocked.",
    requirements: ["Three years’ experience in a school or research laboratory"],
    postedAt: "2026-06-30",
    isOpen: true,
  },
  {
    id: "vac_05",
    slug: "music-teacher",
    title: "Music Teacher",
    category: "Teaching",
    employmentType: "Part-time",
    summary:
      "Teach class music across primary and secondary, and help run ensembles and school performances.",
    requirements: [
      "A degree or equivalent in music, plus a teaching qualification",
      "Confidence directing ensembles and performances",
    ],
    postedAt: "2026-08-04",
    isOpen: true,
  },
];

/* THE FETCH BOUNDARY.
   Every component goes through these two functions and none of them knows
   where a vacancy comes from, so swapping the array above for a database
   query means editing this block and nothing else. They are already async
   and already return plain objects, which is the shape a query will return. */

export async function getVacancies(): Promise<Vacancy[]> {
  return VACANCIES.filter((v) => v.isOpen).sort((a, b) =>
    b.postedAt.localeCompare(a.postedAt),
  );
}

export async function getVacancyBySlug(slug: string): Promise<Vacancy | null> {
  return VACANCIES.find((v) => v.slug === slug && v.isOpen) ?? null;
}

export const careersVacancies = {
  eyebrow: "Open positions",
  heading: "Choose a position.",
  /** Shown when nothing is open — a supported state, not an empty box. */
  emptyState:
    "There are no advertised vacancies at the moment. Applications from strong candidates are still welcome — email one to us and it will be kept on file.",
  /** Shown in place of the full list when someone arrives from a share link. */
  sharedLabel: "Shared with you",
  changeLabel: "Choose a different position",
} as const;

/* ---------------------------------------------------------------- APPLY -- */

export const careersApply = {
  id: "apply",
  eyebrow: "Apply",
  heading: "Send us your application.",
  body: "Pick the position you are applying for, tell us how to reach you, and attach your CV. There is no need to name the role again anywhere else — it travels with the application.",
  /** Copy for the two states the form can end in. */
  success: {
    heading: "Application sent.",
    body: "Thank you. Our HR team reviews every application and will be in touch if you are shortlisted.",
  },
  failure:
    "Something went wrong sending your application. Please try again, or email it to us directly.",
  /* The mailbox the school actually watches, and the one applications are
     delivered to. It is printed on the page as the address to use for a
     posted or hand-filled form, so it must be an inbox somebody opens. */
  email: "career@avi-cenna.com",
  /* Still served by the current site. Move the PDF into /public and change
     this to a local path when the new site takes over the domain. */
  form: {
    label: "Download the application form",
    href: "https://avi-cenna.com/storage/2020/12/Avi-Cenna-Employment-Application-Form.pdf",
  },
  reception: "6 Harold Shodipo Crescent, GRA, Ikeja, Lagos",
  /** Accepted CV formats, enforced on both the input and the server. */
  cv: {
    accept: ".pdf,.doc,.docx",
    maxBytes: 5 * 1024 * 1024,
    hint: "PDF or Word document, up to 5MB.",
  },
} as const;
