/**
 * The twelve questions from the old site's /faq page.
 *
 * They no longer have a page of their own. Every answer is a sentence or two,
 * and twelve sentences is a section, not a destination — so they run on the
 * homepage, where the questions are actually being asked: by someone who has
 * just arrived and is deciding whether this school is for their child.
 *
 * The three groups are not decoration. They are the three things a stranger
 * is weighing — what is taught, whether their child can get in, and what a day
 * here is actually like — and they let twelve rows be scanned in three looks
 * rather than read in twelve.
 *
 * Several answers also live on the page that owns them: the uniform outfitter
 * on /admissions/uniform, the entry rules on /admissions, the hours on each
 * stage page. Where that page has the fuller answer, the row links to it
 * rather than repeating it. Facts that appear in both places are defined once
 * and imported — see `uniformOutfitter` in lib/admissions.ts.
 */

import { uniformOutfitter } from "./admissions";

export type FaqItem = {
  q: string;
  /** The answer, in full. This is also what the structured data publishes. */
  a: string;
  /** Where the longer version of this answer lives, when there is one. */
  link?: { label: string; href: string };
};

export type FaqGroup = {
  label: string;
  items: FaqItem[];
};

export const faqIntro = {
  id: "questions",
  eyebrow: "Questions parents ask",
  heading: "The things you want to know first.",
  body: "The twelve questions we are asked most often, answered plainly. If yours is not here, the school's door is genuinely open — come and ask it.",
} as const;

export const faq: FaqGroup[] = [
  {
    label: "Curriculum and examinations",
    items: [
      {
        q: "What curriculum do you follow?",
        a: "The National Curriculum for England and Wales.",
        link: { label: "How we teach it", href: "/academics" },
      },
      {
        q: "Why do your students not write the SSCE/NECO examinations?",
        a: "We prepare our students for the IGCSE instead — the world's most popular international qualification for 14 to 16 year olds, tried, tested and trusted by schools worldwide.",
        link: { label: "Secondary School", href: "/academics/secondary" },
      },
      {
        q: "Are IGCSE results accepted by Nigerian universities?",
        a: "Yes. IGCSE results are widely accepted by universities both at home and abroad.",
      },
      {
        q: "Do you admit students into Year 11?",
        a: "No. The IGCSE syllabus begins in Year 10 and ends in Year 11 with the examinations themselves, so there is no way to join partway through it.",
        link: { label: "Admissions", href: "/admissions" },
      },
    ],
  },
  {
    label: "Joining us",
    items: [
      {
        q: "Does the school accept students throughout the school year?",
        a: "Yes. Students may join us at any point during the school year.",
        link: { label: "How to apply", href: "/admissions" },
      },
      {
        q: "Must my child speak fluent English before joining Avi-Cenna?",
        a: "No. We offer EAL (English as a Second Language) support for students who are new to learning the English language.",
      },
      {
        q: "From what age can my child come to the boarding school?",
        a: "From age 10.",
      },
      {
        q: "When and where can I get the school uniform?",
        a: `Our authorised outfitter is ${uniformOutfitter.name}. You can shop online at ${uniformOutfitter.site}, or call them on ${uniformOutfitter.phones.join(" or ")}.`,
        link: { label: "See the uniform", href: "/admissions/uniform" },
      },
    ],
  },
  {
    label: "Day to day",
    items: [
      {
        q: "What are the school hours?",
        a: "Pre-School runs 7:55am to 1:00pm; Nursery to Year 6, 7:55am to 2:15pm; Years 7 to 11, 7:55am to 3:15pm. None of those include co-curricular activities, which begin immediately after school and last an hour.",
        link: { label: "The three stages", href: "/academics" },
      },
      {
        q: "Does the school offer lunch?",
        a: "Yes. Students choose between two menu options daily.",
      },
      {
        q: "Is learning support available?",
        a: "Yes. We encourage self-paced learning, and our teachers provide additional support for students who learn at a different pace.",
      },
      {
        q: "Is Avi-Cenna a religious school?",
        a: "No. We are a secular and inclusive school.",
      },
    ],
  },
];

/** Flat list, for the structured data and for anything that needs a count. */
export const faqItems: FaqItem[] = faq.flatMap((group) => group.items);
