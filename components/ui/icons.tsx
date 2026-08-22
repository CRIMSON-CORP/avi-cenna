/**
 * Inline SVG icons. Kept as a local module rather than an icon dependency —
 * there are only a dozen, and they inherit `currentColor` and stroke width
 * from their container so they restyle with the tokens.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/* ------------------------------------------------- Why Choose Us icons --- */

export function AwardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.5 13.6 8 21.5l4-2.2 4 2.2-1.5-7.9" />
      <path d="m12 6.2 1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2L8.8 8.5 11 8.2z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.4s-7.6-4.6-7.6-9.8A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.6 2.6c0 5.2-7.6 9.8-7.6 9.8Z" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.8 13.9 9 20 10.9 13.9 12.8 12 19l-1.9-6.2L4 10.9 10.1 9z" />
      <path d="M18.5 3v3M20 4.5h-3M5.5 17v2.6M6.8 18.3H4.2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.8 4.8 5.7v5.6c0 4.4 3 8.3 7.2 9.9 4.2-1.6 7.2-5.5 7.2-9.9V5.7z" />
      <path d="m9.2 11.9 2 2 3.6-3.8" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h16M4 20V4" />
      <path d="m7.5 15.5 3.2-4 2.7 2.4 4.6-6" />
      <circle cx="7.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.7" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="13.4" cy="13.9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="7.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 21V4.2a1 1 0 0 0-1.2-1L6.4 4.6a1 1 0 0 0-.8 1V21" />
      <path d="M3.6 21h16.8M17.4 21V8.6h3" />
      <circle cx="11.6" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const reasonIcons = {
  award: AwardIcon,
  heart: HeartIcon,
  spark: SparkIcon,
  shield: ShieldIcon,
  chart: ChartIcon,
  door: DoorIcon,
} as const;

/* ------------------------------------------------------------- UI icons -- */

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="m12 3.4 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 8.5V7c0-.8.2-1.2 1.4-1.2h1.5V3h-2.5C11.4 3 10.4 4.4 10.4 6.8v1.7H8.6V11h1.8v10H14V11h2.3l.4-2.5z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* -------------------------------------------------- Accreditation marks -- */
/* Simplified emblems standing in for the official logos. Replace each with
   the real artwork (they exist on the current site) when the files land — the
   card layout in CommunityTrust.tsx expects a 40×40 mark and nothing else. */

export function CambridgeMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
      <path
        d="M20 4 6.5 10.2v10.4c0 7.4 5.6 13.4 13.5 15.4 7.9-2 13.5-8 13.5-15.4V10.2z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path d="M20 11.5v17M13.2 15v10M26.8 15v10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function BsaMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
      <path d="M7 30V14.5L20 6l13 8.5V30z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M7 30h26" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <rect x="15.5" y="20" width="9" height="10" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function AisenMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth={2} />
      <path d="M6 20h28M20 6c4 4.2 6 8.9 6 14s-2 9.8-6 14c-4-4.2-6-8.9-6-14s2-9.8 6-14Z" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function AwardMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
      <circle cx="20" cy="15" r="9.5" stroke="currentColor" strokeWidth={2} />
      <path d="M13.5 22.5 11 36l9-4.6 9 4.6-2.5-13.5" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="m20 10 1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

export const accreditationMarks = {
  cambridge: CambridgeMark,
  bsa: BsaMark,
  aisen: AisenMark,
  award: AwardMark,
} as const;
