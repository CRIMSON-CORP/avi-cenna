"use client";

import { useState } from "react";
import { careersVacancies, type Vacancy } from "@/lib/careers";
import { CheckIcon, ShareIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The position picker: a horizontally scrolling strip of cards, sitting
 * directly above the rest of the application form.
 *
 * These cards ARE the role field — each one is a real radio input with the
 * card as its label. That is why there is no separate dropdown repeating the
 * same choice: the position is stated exactly once, by picking it, and it
 * submits with the form like any other field. It also means arrow keys move
 * between positions and screen readers announce "Position, radio group, 2 of
 * 5" without any of that being reimplemented.
 *
 * SELECTING IS PRIVATE; SHARING IS DELIBERATE. Choosing a card changes local
 * state and nothing else — it does not rewrite the address bar. Someone
 * browsing the list is not publishing anything, and the URL they arrived on
 * stays the URL they can go back to. Sharing is its own button on each card,
 * which mints the link for THAT position whether or not it is the one
 * selected.
 *
 * A horizontal scroller's real hazard is that whatever sits past the right
 * edge is never discovered, so the count is stated in the legend, the last
 * card is deliberately cropped by the fade rather than aligned to it, and the
 * strip snaps so a half-scrolled card cannot come to rest looking like the end
 * of the list.
 *
 * Arriving with `?role=` shows only that position, because a share link is
 * about one job. The rest stay one button away rather than being lost.
 */
export function RolePicker({
  vacancies,
  role,
  onSelect,
  error,
  shared,
}: {
  vacancies: Vacancy[];
  role: string;
  onSelect: (slug: string) => void;
  error?: string;
  /** True when the role came in on the URL rather than from a click here. */
  shared: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const focused = shared && !expanded ? vacancies.filter((v) => v.slug === role) : vacancies;

  /* `window` is only ever touched inside this handler, never during render —
     the component is still rendered on the server, where it does not exist. */
  async function share(vacancy: Vacancy) {
    const url = `${window.location.origin}/careers?role=${vacancy.slug}`;

    /* On a phone this hands off to the OS share sheet, which is what someone
       actually wants; everywhere else, copying the link is the useful thing.
       A cancelled share sheet throws, and a cancellation is not an error. */
    if (navigator.share) {
      try {
        await navigator.share({ title: `${vacancy.title} at Avi-Cenna`, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(vacancy.slug);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* Clipboard access can be refused — an insecure origin, or a denied
         permission. There is no honest recovery from here, and a fake
         "Copied" would be worse than silence, so the button simply does not
         confirm. */
    }
  }

  return (
    /* min-w-0 on both the fieldset and the scroller's wrapper: a fieldset has
       an intrinsic min-width of its content, which would otherwise stretch to
       the full width of the card strip and push the page sideways. */
    <fieldset className="min-w-0" aria-describedby={error ? "role-error" : undefined}>
      <legend className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[0.82rem] font-semibold text-ink">Position</span>
        {shared && !expanded ? (
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
            {careersVacancies.sharedLabel}
          </span>
        ) : (
          <span className="text-[0.78rem] text-ink-muted">
            {vacancies.length} open — scroll for more
          </span>
        )}
      </legend>

      {/* overflow-hidden is load-bearing, not decoration. `overflow-x: auto`
          on the list below makes it scroll, but on narrow viewports the cards
          still contributed to the DOCUMENT's scrollable width and dragged a
          horizontal scrollbar onto the whole page. Clipping at this wrapper
          contains them; verified by measuring window.scrollX at 386px wide. */}
      <div className="relative min-w-0 overflow-hidden">
        <ul
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10",
            /* Room for the focus ring, which a tight overflow box would clip. */
            "px-1 pt-1",
          )}
        >
          {focused.map((vacancy) => {
            const checked = role === vacancy.slug;
            const justCopied = copied === vacancy.slug;

            return (
              <li key={vacancy.id} className="relative snap-start">
                <label
                  className={cn(
                    "group flex h-full w-[17rem] cursor-pointer flex-col rounded-card border p-5 transition-all duration-500 ease-out-expo sm:w-[19rem]",
                    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500",
                    checked
                      ? "border-brand-500 bg-surface-deep shadow-lift"
                      : "border-brand-200 bg-surface hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={vacancy.slug}
                    checked={checked}
                    onChange={() => onSelect(vacancy.slug)}
                    className="sr-only"
                  />

                  {/* pr-10 keeps the chips clear of the share button, which
                      sits outside this label so pressing it cannot select. */}
                  <span className="flex flex-wrap items-center gap-2 pr-10">
                    <span
                      className={cn(
                        "rounded-pill px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em]",
                        checked ? "bg-white/15 text-brand-200" : "bg-brand-50 text-brand-600",
                      )}
                    >
                      {vacancy.category}
                    </span>
                    <span
                      className={cn(
                        "text-[0.74rem] font-medium",
                        checked ? "text-ink-invert-soft" : "text-ink-muted",
                      )}
                    >
                      {vacancy.employmentType}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "mt-3 font-display text-[1.15rem] font-extrabold leading-snug tracking-[-0.02em]",
                      checked ? "text-white" : "text-ink",
                    )}
                  >
                    {vacancy.title}
                  </span>

                  <span
                    className={cn(
                      "mt-2 flex-1 text-[0.86rem] leading-relaxed",
                      checked ? "text-ink-invert-soft" : "text-ink-body",
                    )}
                  >
                    {vacancy.summary}
                  </span>

                  <span
                    className={cn(
                      "mt-4 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.1em]",
                      checked ? "text-gold-400" : "text-brand-500",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        checked ? "border-gold-400 bg-gold-400" : "border-brand-300",
                      )}
                    >
                      {checked && (
                        <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-brand-950">
                          <path d="M3.8 7.4 1.4 5l.9-.9 1.5 1.5L7.7 2l.9.9z" />
                        </svg>
                      )}
                    </span>
                    {checked ? "Selected" : "Select"}
                  </span>
                </label>

                {/* A sibling of the label, not a child: nested inside it, a
                    press would also activate the radio and silently change
                    the applicant's selection just because they shared a link. */}
                <button
                  type="button"
                  onClick={() => share(vacancy)}
                  aria-label={justCopied ? "Link copied" : `Share the ${vacancy.title} position`}
                  className={cn(
                    "focus-ring absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-base ease-out-expo",
                    checked
                      ? "bg-white/15 text-brand-200 hover:bg-white hover:text-brand-900"
                      : "bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white",
                  )}
                >
                  {justCopied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ShareIcon className="h-4 w-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Only meaningful while the strip can actually scroll. */}
        {focused.length > 1 && (
          <div
            aria-hidden
            /* Matches the form panel behind it, not the section, so the last
               card dissolves rather than sitting behind a grey smudge. */
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-surface to-transparent"
          />
        )}
      </div>

      {/* Copying gives no visual feedback a screen reader can see. */}
      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </p>

      {shared && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="focus-ring mt-1 text-[0.85rem] font-semibold text-brand-600 underline underline-offset-4 transition-colors hover:text-brand-700"
        >
          {expanded
            ? `Show only the shared position`
            : `${careersVacancies.changeLabel} (${vacancies.length - 1} more)`}
        </button>
      )}

      {error && (
        <p id="role-error" className="mt-2 text-[0.8rem] font-medium text-accent-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
