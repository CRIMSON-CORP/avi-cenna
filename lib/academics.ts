/**
 * Content for /academics and the three stage pages beneath it.
 *
 * Five pages from the current site: Academics Overview and School Programs
 * Overview fold into /academics, while Early Years, Primary and Secondary keep
 * pages of their own because each carries substantial curriculum detail.
 *
 * Same rule as lib/site.ts, lib/about.ts and lib/careers.ts: no component
 * hardcodes a string.
 */

/* --------------------------------------------------------- STAGE COLOUR --
   Each stage owns a colour, already established by the cards in
   StageStrip.tsx: Early Years blue, Primary gold, Secondary coral. A page
   sets these three variables once on its root and every themed component
   reads them, so a stage page is themed by data rather than by a chain of
   conditionals — and the colours themselves stay in the token file. */

export type StageId = "early" | "primary" | "secondary";

export const stageThemes: Record<StageId, React.CSSProperties> = {
  early: {
    "--stage": "var(--color-brand-500)",
    "--stage-ink": "var(--color-brand-700)",
    "--stage-tint": "var(--color-brand-50)",
  } as React.CSSProperties,
  primary: {
    "--stage": "var(--color-gold-500)",
    "--stage-ink": "var(--color-gold-600)",
    "--stage-tint": "var(--color-gold-50)",
  } as React.CSSProperties,
  secondary: {
    "--stage": "var(--color-accent-500)",
    "--stage-ink": "var(--color-accent-700)",
    "--stage-tint": "var(--color-accent-50)",
  } as React.CSSProperties,
};

/* ------------------------------------------------------------- HERO ----- */

export const academicsHero = {
  eyebrow: "Academics",
  headline: { light: "A British school,", bold: "from two to sixteen." },
  body: "Avi-Cenna International School is a British school. As a British school, we have adopted the national curriculum of England and Wales.",
  facts: [
    "National Curriculum of England & Wales",
    "EYFS to IGCSE",
    "Four Key Stages",
    "Benchmarked worldwide",
  ],
} as const;

/* -------------------------------------------------------- THE LADDER ----
   The page's spine, and the reason this page has one at all: the school's
   own copy says each school is separated "not just by a physical floor, but
   also by timetables". Age and altitude are the same axis here, so one
   vertical line carries both — you descend the building as you climb through
   the years.

   This is also the one place on the site where numbering is earned: Key
   Stages are a real sequence, and the order carries information a parent
   needs. */

export type KeyStage = { label: string; years: string };

export type Floor = {
  id: StageId;
  /** Ordinal in the building, shown as an oversized graphic mark. */
  floor: string;
  name: string;
  ages: string;
  keyStages: KeyStage[];
  /** How this floor is measured on the way out of it. */
  checkpoint: { label: string; note: string };
  blurb: string;
  href: string;
};

export const academicsLadder = {
  eyebrow: "Three schools, one building",
  heading: "Two to sixteen, floor by floor.",
  body: "Each school has its own floor and its own timetable, so the youngest children and the oldest students never share a corridor at the same moment. The curriculum climbs with them.",
  floors: [
    {
      id: "early",
      floor: "01",
      name: "Early Years",
      ages: "Ages 2 to 5",
      keyStages: [{ label: "EYFS", years: "Pre-School to Reception" }],
      checkpoint: {
        label: "No external examination",
        note: "The Early Years Foundation Stage is assessed by observation, continuously, as children play.",
      },
      blurb:
        "A buzzing hive of exploration and discovery, where children begin to gain the confidence to seek out their own answers.",
      href: "/academics/early-years",
    },
    {
      id: "primary",
      floor: "02",
      name: "Primary School",
      ages: "Years 1 to 6",
      keyStages: [
        { label: "KS1", years: "Years 1–2" },
        { label: "KS2", years: "Years 3–6" },
      ],
      checkpoint: {
        label: "KS2 SATs",
        note: "Sat at the end of Year 6, and marked against every British school in the world.",
      },
      blurb:
        "A broad, balanced curriculum across seven subject areas, promoting intellectual, moral, physical, spiritual and cultural development.",
      href: "/academics/primary",
    },
    {
      id: "secondary",
      floor: "03",
      name: "Secondary School",
      ages: "Years 7 to 11",
      keyStages: [
        { label: "KS3", years: "Years 7–9" },
        { label: "KS4", years: "Years 10–11" },
      ],
      checkpoint: {
        label: "Checkpoint, then IGCSE",
        note: "The Key Stage 3 Checkpoint at the end of Year 9, and Cambridge IGCSE at the end of Year 11.",
      },
      blurb:
        "A rigorous and effective education in an enabling environment — one which leaves students wanting to learn and to contribute.",
      href: "/academics/secondary",
    },
  ] satisfies Floor[],
} as const;

/* ---------------------------------------------------------- APPROACH ---- */

export const academicsApproach = {
  id: "approach",
  eyebrow: "Our approach",
  heading: "A love of learning.",
  lead: "A love of learning is the chord which ties our whole operation together. Students and teachers alike bring a diversity of knowledge, experiences, cultures, languages and accomplishments to our community. Each individual is unique and exceptional, but we find common ground in our curiosity and a collective hunger for knowledge.",
  /** The school's own four words. Set as a row, because they are a set. */
  words: ["Creativity", "Innovation", "Change", "Improvement"],
  wordsNote: "feature in every facet of school life.",
  body: "From Early Years all the way through to Year 11, our students are groomed to throw down the gauntlet in the face of new challenges — to face them head on, using tools they have acquired in and out of the classroom.",
  cards: [
    {
      title: "Separated by floor, and by timetable",
      body: "Avi-Cenna maintains a strict anti-bullying policy. Students are taught that each individual is unique and free to be who they desire to be, and a respect for the diverse views, ideologies and cultures of their peers is imparted from the moment they walk through our gates.",
    },
    {
      title: "Ready for a global society",
      body: "By the time our students walk through our gates for the very last time as students, they will have acquired the skills and attitudes that best prepare them for success in a global society.",
    },
  ],
} as const;

/* ======================================================== EARLY YEARS ==== */

export const earlyYears = {
  id: "early" as StageId,
  floor: "01",
  eyebrow: "Early Years · Ages 2 to 5",
  heading: { light: "A buzzing hive of", bold: "exploration and discovery." },
  intro:
    "Our Early Years begins to impart in our children the confidence to seek out their own answers. Our young discoverers are taught using the EYFS curriculum, in a captivating little world tucked away in a safe and purpose-designed section of the school.",

  /* THE ARRIVAL WALK. Four stops, in the order a child actually passes them,
     taken from the school's own sentence: "From the door, they make their way
     through a mini zoo and then take a walk down a high street, before
     arriving at their learning hub for the day." A real journey through a
     real place, which is why the page walks it rather than listing it. */
  walk: {
    eyebrow: "The way in",
    heading: "The walk to the learning hub.",
    note: "Every morning, in this order.",
    stops: [
      {
        label: "The door",
        body: "A warm reception at any point in the day — not just from the teachers, assistants and nannies, but from the students themselves.",
      },
      {
        label: "The mini zoo",
        body: "The first thing they pass on the way in. Discovery starts before the classroom does.",
      },
      {
        label: "The high street",
        body: "A walk down a street of their own, built at their scale, on the way to the day's learning.",
      },
      {
        label: "The learning hub",
        body: "Happy, smiling faces engrossed in various acts of discovery, soaking in every iota of knowledge their sponge-like minds can absorb.",
      },
    ],
  },

  themes: {
    eyebrow: "The four themes",
    heading: "What underpins the practice.",
    body: "The Early Years Foundation Stage applies from the beginning of Pre-School to the end of Reception. It incorporates four themes, each expressing a principle that underpins effective care, development and learning.",
    items: [
      {
        title: "A Unique Child",
        body: "We recognise that children develop in individual ways and at varying rates, and that children's attitudes to learning are influenced by our praise and encouragement. We value the diversity of individuals within the school and do not discriminate because of differences. All children are treated fairly regardless of race, religion or abilities, and all children and their families are valued.",
      },
      {
        title: "Positive Relationships",
        body: "Children should be encouraged to be strong and independent when required, forming the basis for the positive relationships they will go on to have. They should also be given the safety and security to bolster the relationships they have with those closest to them.",
      },
      {
        title: "Enabling Environments",
        body: "The environment plays a key role in supporting and extending development. We observe the children and assess their interests before planning challenging but achievable activities. The area is organised so children can explore within a secure space — places to be active, places to be quiet, resources within reach, labels with pictures for pre-readers. It has its own enclosed outdoor area, used every day.",
      },
      {
        title: "Learning and Development",
        body: "We value all areas of learning equally and understand they are interconnected. Play is a very important part of the EYFS curriculum: through play children make sense of the world, build ideas, learn to control themselves and understand the need for rules. Active learning happens when children are motivated and interested, with some independence and control over their own learning.",
      },
    ],
  },

  areas: {
    eyebrow: "Seven areas of learning",
    heading: "What they are learning, while they play.",
    items: [
      { name: "Communication and Language", detail: "Listening, attention and understanding; speaking" },
      { name: "Physical Development", detail: "Gross motor skills; fine motor skills" },
      {
        name: "Personal, Social and Emotional Development",
        detail: "Self-regulation; managing self; building relationships",
      },
      { name: "Literacy", detail: "Comprehension; word reading; writing" },
      { name: "Mathematics", detail: "Numbers; numerical patterns" },
      {
        name: "Understanding the World",
        detail: "Past and present; people, culture and communities; the natural world",
      },
      {
        name: "Expressive Arts and Design",
        detail: "Creating with materials; being imaginative and expressive",
      },
    ],
  },
} as const;

/* ============================================================ PRIMARY ==== */

export const primary = {
  id: "primary" as StageId,
  floor: "02",
  eyebrow: "Primary School · Years 1 to 6",
  heading: { light: "Excellence as the goal,", bold: "in every measure." },
  intro:
    "Our school values everyone equally. We encourage all our pupils to do their best by celebrating their successes, helping them grow in confidence, build self-esteem, develop independence, and be responsible and respectful towards each other.",
  values: [
    "We aim to make excellence our goal in standards, achievement, behaviour and attendance.",
    "The curriculum we offer is broad, balanced, creative, interesting and varied, to suit all learners. It promotes the intellectual, moral, physical, spiritual and cultural development of everyone.",
    "Our environment is inviting and secure, encouraging everyone to take pride in their surroundings.",
    "We support the training and development of all staff, so they are motivated to provide a high quality education.",
    "We welcome parents into the school, encouraging them in their role of supporting their child's education.",
  ],
  subjects: {
    eyebrow: "The curriculum",
    /* The school's page says "divided into seven subject areas" and then
       lists the eight below. The list is reproduced as published, but the
       heading does not repeat the count — a heading saying seven above eight
       visible cards reads as a bug in the site rather than in the source.
       Worth resolving with the school, then restoring the number. */
    heading: "What they study.",
    items: [
      "English",
      "Mathematics",
      "Science",
      "Languages (French / Arabic)",
      "History / Geography",
      "Technology",
      "Visual Arts",
      "Physical Education",
    ],
  },
  checkpoint: {
    eyebrow: "How it is measured",
    heading: "KS2 SATs, at the end of Year 6.",
    body: "All subjects are taught following the guidelines of the National Curriculum for England and Wales. At the end of Year 6, students sit the Key Stage 2 SAT examinations. This lets each student measure themselves against students in England and Wales, and in British international schools all over the world — but more importantly, it lets us benchmark the school against them.",
  },
} as const;

/* ========================================================== SECONDARY ==== */

export const secondary = {
  id: "secondary" as StageId,
  floor: "03",
  eyebrow: "Secondary School · Years 7 to 11",
  heading: { light: "We value all students for who they are,", bold: "and for what they can become." },
  intro:
    "We aim to provide a rigorous and effective education in an enabling environment — one which instils in students a desire to learn and to contribute, while feeling safe and confident.",

  keyStages: [
    {
      label: "Key Stage 3",
      years: "Years 7 to 9",
      heading: "Everything is compulsory.",
      body: "The first three years of secondary education. All subjects at this Key Stage are compulsory, and every student takes all of them.",
      subjects: [
        "English (Language and Literature)",
        "Mathematics",
        "Science",
        "French or Arabic",
        "Geography",
        "History",
        "Information and Communication Technology",
        "Music",
        "Personal, Social, Health and Citizenship Education",
        "Physical Education",
        "Art and Design",
      ],
      checkpoint:
        "At the end of Year 9, students sit the Key Stage 3 National Curriculum Test (Checkpoint), which benchmarks them against students in England and Wales and in British international schools worldwide.",
    },
    {
      label: "Key Stage 4",
      years: "Years 10 to 11",
      heading: "Cambridge IGCSE.",
      body: "The world's most popular international curriculum for 14 to 16 year olds. It develops skills in creative thinking, enquiry and problem solving, and gives students excellent preparation for the next stage of their education. It has wide recognition from higher education institutions and employers around the world.",
      subjects: [],
      checkpoint:
        "Some subjects are compulsory and students elect to take others as options. Students generally take eight subjects, and sit IGCSE examinations in all of them. Papers are set and conducted by the Cambridge International Exams syndicate in England, and are all marked externally.",
    },
  ],

  /* The IGCSE grade scale is a real, published artefact — it makes the
     abstraction of "externally marked" concrete at a glance. */
  grades: {
    eyebrow: "Graded",
    heading: "A* to G, marked in England.",
    scale: ["A*", "A", "B", "C", "D", "E", "F", "G"],
    note: "Examinations are set and conducted by Cambridge International Exams, and every paper is marked externally.",
  },
} as const;

/* ------------------------------------------------------------- SHARED --- */

export const stageCta = {
  heading: "Come and see it for yourself.",
  body: "We operate an open-door policy. Come and take a look around, on any ordinary school day.",
} as const;
