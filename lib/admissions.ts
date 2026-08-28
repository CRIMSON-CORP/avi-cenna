/**
 * Content for /admissions and /admissions/uniform.
 *
 * Admission Overview and Admission Procedure fold into one route; Uniform gets
 * a page of its own, and the uniform slider that sat at the bottom of the
 * procedure page moves there with it.
 *
 * Same rule as the other content modules: no component hardcodes a string.
 */

import { site } from "./site";

/* --------------------------------------------------------------- HERO --- */

export const admissionsHero = {
  eyebrow: "Admissions",
  headline: { light: "Come and see us,", bold: "then let's begin." },
  body: "Admission forms are available on request. Every applicant sits an entrance examination designed to place them accurately, and successful students meet the Principal before an offer is made.",
  facts: ["Forms on request", "Entrance examination", "Interview with the Principal", "Open-door policy"],
} as const;

/* ------------------------------------------------------------- REASONS --
   The nine points from the school's Admission Overview page.

   Six of these also appear on the homepage's "Why choose us" section, which
   is a deliberate repeat: a parent arriving on /admissions from a search has
   very likely never seen the homepage, and the page has to give them a reason
   to apply before it explains how. The TREATMENT differs though — the
   homepage runs a navy panel with a travelling highlight, so repeating that
   device here as well would read as déjà vu rather than as reassurance. */

export const admissionsReasons = {
  id: "why",
  eyebrow: "Why choose Avi-Cenna",
  heading: "Nine reasons parents apply.",
  items: [
    "Avi-Cenna radiates a warm, friendly and welcoming atmosphere, which is reflected in our students.",
    "Our students have consistently received awards from Cambridge and the British Council as top performers in the IGCSE examinations.",
    "We are a truly international school with over 30 different nationalities represented. Our students emerge well-equipped to interact in our globalised world.",
    "Our team of highly capable, well-trained, Cambridge-accredited teachers are equipped to prepare students to excel in the IGCSE exams.",
    "All our classrooms are equipped with state-of-the-art audiovisual technology.",
    "Creativity is valued and enhanced through our wide spectrum of co-curricular activities.",
    "Avi-Cenna International School has a firm policy against bullying.",
    "Each child's progress is measured against his or her own ability, so no child feels inadequate.",
    "We have an open-door policy and value input from students, parents and other stakeholders.",
  ],
} as const;

/* ----------------------------------------------------------- PROCEDURE --
   The steps, tagged by who actually performs each one.

   That split is already in the school's own copy — you buy and submit the
   form, the Registrar schedules the examination, the Principal interviews,
   you pay the deposit — and it is the single most useful thing to show a
   parent, because it tells them what they are waiting on and when the ball is
   back in their court. */

export type Actor = "you" | "school";

export type Step = {
  actor: Actor;
  title: string;
  body: string;
};

export const admissionsProcedure = {
  id: "procedure",
  eyebrow: "How it works",
  heading: "What you do, and what we do.",
  body: "Seven steps from first enquiry to a reserved place. The school's part is shown alongside yours, so you always know whose turn it is.",
  lanes: { you: "You", school: "Avi-Cenna" },
  steps: [
    {
      actor: "you",
      title: "Request an admission form",
      body: "Forms are available on request at a cost of ₦50,000. Payment may be made by POS, bank transfer or direct deposit.",
    },
    {
      actor: "you",
      title: "Pay, and take the slip to the Registrar",
      body: "All cash payments should be paid directly into the school's account. The bank slip is submitted to the Registrar in exchange for the admission forms.",
    },
    {
      actor: "you",
      title: "Return the completed form",
      body: "Fully completed, and returned to the Registrar together with the four documents listed below.",
    },
    {
      actor: "school",
      title: "The Registrar sets an examination date",
      body: "Once your completed form is in, the Registrar arranges a date for the entrance examination.",
    },
    {
      actor: "you",
      title: "Your child sits the entrance examination",
      body: "The examination is designed to indicate a student's academic level, taking their age into account.",
    },
    {
      actor: "school",
      title: "Interview with the Principal, then an offer",
      body: "Successful students may be invited for an interview with the Principal. An offer of a place follows.",
    },
    {
      actor: "you",
      title: "Pay a deposit to reserve the place",
      body: "Once an offer has been made, a deposit secures your child's place.",
    },
  ] satisfies Step[],

  /* Set apart because it is a policy, not a step — and because it answers a
     question many parents arrive with. */
  policy: {
    title: "On year groups",
    body: "Based upon experience, Avi-Cenna considers it disadvantageous to a student to be placed in a year group above their age, and will not consider doing so.",
  },
} as const;

/* ----------------------------------------------------------- DOCUMENTS -- */

export const admissionsDocuments = {
  id: "what-to-bring",
  eyebrow: "What to bring",
  heading: "Four things, with the form.",
  items: [
    "One recent passport-size photograph",
    "A copy of the birth certificate",
    "A copy of the passport information page",
    "An academic transcript, or the last three full reports from the previous school",
  ],
} as const;

/* ------------------------------------------------------------- PAYMENT -- */

export const admissionsPayment = {
  eyebrow: "The fee",
  amount: "₦50,000",
  amountLabel: "for the admission form",
  methods: "POS, bank transfer or direct deposit",
  account: {
    name: "Jodar Avi-Cenna International Ltd",
    number: "1014076258",
    bank: "Zenith",
  },
  note: "Cash payments go directly into the school's account. Bring the bank slip to the Registrar to collect the forms.",
  enquire: { label: "Ask the Registrar", href: `mailto:${site.email}?subject=Admissions%20enquiry` },
} as const;

/* -------------------------------------------------------------- UNIFORM -- */

export type UniformSet = {
  id: string;
  stage: string;
  body: string;
  /** Optional until the photography lands — see the note on `sets` below. */
  image?: string;
};

export const uniform = {
  eyebrow: "Uniform",
  headline: { light: "Worn with", bold: "pride." },
  intro:
    "We believe that our distinctive uniform plays a valuable role in contributing to the ethos of the school and setting an appropriate tone. It helps to encourage in our students a sense of community spirit, personal pride and a common purpose, while also reinforcing positive behaviour.",
  expectation:
    "All students are expected to observe the school's dress code at all times, and to wear their uniform with pride. We actively encourage parents to reinforce standards of dress, and to ensure that students' uniform is consistent with school policy.",

  /* Photographs come from the slider that used to sit at the bottom of the
     admission procedure page.

     Files are matched to stages by what is actually in the photograph, not by
     filename order: uniform-1 is the blazer-and-tie senior uniform, uniform-2
     is the light blue primary shirt, and uniform-3 is the blue polo and
     shorts worn at sport — which is the PE kit described further down this
     file. Leave `image` off and the card falls back to a tinted plate rather
     than a broken frame, the same way leadership cards fall back to a
     monogram. */
  sets: {
    eyebrow: "The uniform",
    heading: "By stage.",
    items: [
      {
        id: "primary",
        stage: "Primary",
        body: "Worn Monday to Friday through the primary years.",
        image: "/images/uniforms/uniform-2.jpg",
      },
      {
        id: "secondary",
        stage: "Secondary",
        body: "Blazer, shirt and school tie, worn from Year 7 through to Year 11.",
        image: "/images/uniforms/uniform-1.jpg",
      },
      {
        id: "pe",
        stage: "PE kit",
        body: "House-colour polo and school shorts, for PE and every co-curricular activity.",
        image: "/images/uniforms/uniform-3.jpg",
      },
    ] as UniformSet[],
  },

  pe: {
    eyebrow: "Secondary PE kits",
    heading: "Three rules.",
    items: [
      "Only the school PE shorts may be worn.",
      "Polo shirts in House colour must be worn for PE and all co-curricular activities.",
      "Trainers with white sports socks must be worn.",
    ],
  },
} as const;

/* ----------------------------------------------------------------- CTA -- */

export const admissionsCta = {
  heading: "Start with a visit.",
  body: "We operate an open-door policy. Come and look around on an ordinary school day, before you fill in anything.",
} as const;
