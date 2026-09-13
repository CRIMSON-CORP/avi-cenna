/**
 * Events Data Model & Utilities
 *
 * Provides typed event structures, dynamic relative date generation so the
 * filter pills ("All", "Today", "This Week", "This Month", "This Year")
 * always show active events, and search/filter predicates.
 */

export type DateFilter = "all" | "today" | "this-week" | "this-month" | "this-year";

export type EventScheduleItem = {
  time: string;
  activity: string;
};

export type SchoolEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  details: string;
  startDate: string; // ISO string for reliable client-server hydration
  formattedDate: string;
  time: string;
  venue: string;
  organizer: string;
  image: string;
  schedule: EventScheduleItem[];
  targetAudience: string;
};

/**
 * Generates dynamic dates relative to current local time to ensure filter pills
 * (Today, This Week, This Month, This Year) are testable and vibrant anytime.
 */
function getRelativeDate(daysFromNow: number, hours = 10, minutes = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatDateString(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Seed events using authentic school assets from the Avi-Cenna media library.
 */
export function getInitialEvents(): SchoolEvent[] {
  const today = getRelativeDate(0, 14, 0);
  const tomorrow = getRelativeDate(1, 9, 30);
  const thisFriday = getRelativeDate(3, 16, 0);
  const nextWeek = getRelativeDate(8, 10, 0);
  const laterThisMonth = getRelativeDate(18, 11, 0);
  const laterThisYear = getRelativeDate(45, 15, 0);

  return [
    {
      id: "annual-sports-day",
      slug: "annual-inter-house-sports-day",
      title: "Annual Inter-House Sports Championship",
      description:
        "Track, field, and relay competitions between Red, Blue, Green, and Yellow houses, celebrating athletic prowess and team spirit across all grade levels.",
      details:
        "The Annual Inter-House Sports Day is one of Avi-Cenna's proudest traditions. Students from Early Years through Secondary compete in track and field events, sprint relays, tug of war, and team exhibitions. Parents and alumni are warmly invited to cheer from the pavilions. Refreshments and medical support will be available on-site.",
      startDate: today.toISOString(),
      formattedDate: `${formatDateString(today)} at 2:00 PM`,
      time: "2:00 PM – 5:30 PM",
      venue: "Avi-Cenna Main Sports Complex & Field",
      organizer: "Physical Education & Athletics Department",
      image: "/images/grades/secondary/Avi-30th-Sport-Day-2020-2590-scaled.jpg",
      targetAudience: "All Students, Parents, Alumni & Guests",
      schedule: [
        { time: "2:00 PM", activity: "Opening Parade of Houses & Anthem" },
        { time: "2:30 PM", activity: "Track Events: Sprints & Middle Distance" },
        { time: "4:00 PM", activity: "Inter-House Relays & Invitational Races" },
        { time: "5:00 PM", activity: "Trophy Presentation & Closing Remarks" },
      ],
    },
    {
      id: "cambridge-excellence-awards",
      slug: "cambridge-academic-excellence-awards",
      title: "Cambridge Academic Excellence & Prize Giving Day",
      description:
        "Honouring students who achieved top-tier distinctions in Cambridge IGCSE and Primary Checkpoint examinations, alongside departmental merit awards.",
      details:
        "Join school leadership, faculty, and honoured guests as we recognise our students' exceptional academic achievements. Special commendations will be awarded to Cambridge Outstanding Learner Award recipients, subject toppers, and distinguished educators. Formal attire is requested.",
      startDate: tomorrow.toISOString(),
      formattedDate: `${formatDateString(tomorrow)} at 9:30 AM`,
      time: "9:30 AM – 1:00 PM",
      venue: "Sir Harold Shodipo Memorial Hall",
      organizer: "Academic Directorate & Cambridge Examinations Board",
      image: "/images/grades/primary/PRICE-GIVING-DAY-PRI-26-(37).webp",
      targetAudience: "Awardees, Parents, Faculty & Trustees",
      schedule: [
        { time: "9:30 AM", activity: "Guest Arrival & Procession" },
        { time: "10:00 AM", activity: "Keynote Address by Guest Speaker" },
        { time: "10:45 AM", activity: "Presentation of Cambridge Distinctions" },
        { time: "12:15 PM", activity: "Principal's Commendation & Reception" },
      ],
    },
    {
      id: "steam-innovation-fair",
      slug: "annual-steam-science-innovation-expo",
      title: "STEAM & Science Innovation Expo",
      description:
        "An interactive showcase of student-engineered robotics, sustainable energy prototypes, computational models, and scientific research.",
      details:
        "Our young inventors, engineers, and scientists present working prototypes addressing real-world challenges in Nigeria and globally. Visitors will experience hands-on demonstrations, robotics trials, interactive science laboratories, and live judging by industry professionals.",
      startDate: thisFriday.toISOString(),
      formattedDate: `${formatDateString(thisFriday)} at 4:00 PM`,
      time: "4:00 PM – 7:00 PM",
      venue: "Secondary Science Quad & Innovation Lab",
      organizer: "Science, Design & Technology Department",
      image: "/images/grades/secondary/STEAM-26-291.webp",
      targetAudience: "Students, Parents, Prospective Families & Educators",
      schedule: [
        { time: "4:00 PM", activity: "Exhibition Doors Open & Prototype Walkthrough" },
        { time: "5:15 PM", activity: "Robotics Arena Demonstrations & Challenges" },
        { time: "6:15 PM", activity: "Judging Panel Feedback & Innovation Awards" },
      ],
    },
    {
      id: "international-cultural-day",
      slug: "international-cultural-heritage-day",
      title: "International Cultural & Heritage Day",
      description:
        "A vibrant festival celebrating global diversity, traditional attire, cultural gastronomy, music, and performing arts from around the world.",
      details:
        "With students and families representing over twenty nationalities, International Day is an extraordinary celebration of unity, heritage, and intercultural understanding. Each class hosts an interactive pavilion with authentic cuisines, arts, historical displays, and musical performances.",
      startDate: nextWeek.toISOString(),
      formattedDate: `${formatDateString(nextWeek)} at 10:00 AM`,
      time: "10:00 AM – 3:30 PM",
      venue: "Central Courtyard & Assembly Lawns",
      organizer: "Humanities & Modern Languages Faculty",
      image: "/images/grades/primary/Av-Intl-Day-2019-200-2048x1360.jpg",
      targetAudience: "Entire School Community & Invited Families",
      schedule: [
        { time: "10:00 AM", activity: "Parade of Nations in Traditional Attire" },
        { time: "11:00 AM", activity: "Pavilion Displays & International Food Tasting" },
        { time: "1:30 PM", activity: "Cultural Dance, Drama & Choral Performances" },
      ],
    },
    {
      id: "pta-general-meeting",
      slug: "termly-pta-general-assembly",
      title: "Termly PTA General Assembly & Forum",
      description:
        "An open forum for parents and educators to discuss curriculum updates, pastoral care enhancements, campus safety, and school initiatives.",
      details:
        "The Avi-Cenna Parent-Teacher Association meets once every term to foster transparent dialogue between parents and school leadership. This session covers academic benchmarks, the co-curricular roadmap, facility updates, and community outreach projects. An open Q&A follows the agenda.",
      startDate: laterThisMonth.toISOString(),
      formattedDate: `${formatDateString(laterThisMonth)} at 11:00 AM`,
      time: "11:00 AM – 1:30 PM",
      venue: "Avi-Cenna Conference Suite & Online Stream",
      organizer: "Parent-Teacher Association Executive Committee",
      image: "/images/pta.jpg",
      targetAudience: "All Avi-Cenna Parents & Guardians",
      schedule: [
        { time: "11:00 AM", activity: "Welcome Address by PTA Chairperson" },
        { time: "11:20 AM", activity: "School Executive Report by the Principal" },
        { time: "12:00 PM", activity: "Treasurer's Statement & Special Projects" },
        { time: "12:40 PM", activity: "Open Parent Q&A Session" },
      ],
    },
    {
      id: "valedictory-graduation-gala",
      slug: "secondary-valedictory-service-graduation-gala",
      title: "Valedictory Service & Secondary Graduation Gala",
      description:
        "A milestone celebration honouring the graduating Class of 2026 as they prepare to transition to prestigious universities worldwide.",
      details:
        "Celebrating years of diligence, growth, and excellence. The Valedictory Service highlights student speeches, induction into the Avi-Cenna Alumni Association, diploma conferral, and musical tributes from the school choir and orchestra.",
      startDate: laterThisYear.toISOString(),
      formattedDate: `${formatDateString(laterThisYear)} at 3:00 PM`,
      time: "3:00 PM – 7:00 PM",
      venue: "Avi-Cenna Grand Pavilion & Auditorium",
      organizer: "Senior Leadership Team & Alumni Relations",
      image: "/images/grades/secondary/SEC-GRAD-26-182.webp",
      targetAudience: "Graduating Students, Families & Faculty",
      schedule: [
        { time: "3:00 PM", activity: "Valedictory Service & Choral Introit" },
        { time: "4:15 PM", activity: "Valedictorian & Salutatorian Addresses" },
        { time: "5:00 PM", activity: "Conferral of Certificates & Medals" },
        { time: "6:00 PM", activity: "Graduation Reception & Alumni Welcome" },
      ],
    },
  ];
}

/**
 * Filter an array of events by the chosen DateFilter.
 */
export function filterEventsByDate(events: SchoolEvent[], filter: DateFilter): SchoolEvent[] {
  if (filter === "all") return events;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return events.filter((event) => {
    const eventDate = new Date(event.startDate);

    if (filter === "today") {
      return eventDate >= startOfToday && eventDate <= endOfToday;
    }

    if (filter === "this-week") {
      const currentDay = now.getDay();
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - currentDay);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      return eventDate >= startOfToday && eventDate <= endOfWeek;
    }

    if (filter === "this-month") {
      return (
        eventDate.getFullYear() === now.getFullYear() &&
        eventDate.getMonth() === now.getMonth()
      );
    }

    if (filter === "this-year") {
      return eventDate.getFullYear() === now.getFullYear();
    }

    return true;
  });
}

/**
 * Filter events by search keyword across title, venue, organizer, and description.
 */
export function searchEvents(events: SchoolEvent[], query: string): SchoolEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return events;

  return events.filter((e) => {
    return (
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q)
    );
  });
}
