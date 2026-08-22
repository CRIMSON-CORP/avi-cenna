import Link from "next/link";
import { directions, navigation, quickLinks, site, termNotice } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, FacebookIcon, InstagramIcon } from "@/components/ui/icons";
import { Logo } from "./Logo";

/**
 * Site footer — light, structured, on the brand's pale blue.
 *
 * Carries everything the current site's footer does (contact, quick links,
 * socials, copyright) plus the dated term notice that currently sits marooned
 * on its homepage, and a directions link. Directions go out to Google Maps
 * rather than embedding an iframe: a third-party frame would be a heavy,
 * unstyleable box that fights the palette for no real gain over a link.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-surface-alt">
      {/* ------------------------------------------------- term notice --- */}
      <div className="shell">
        <div className="flex flex-col gap-5 border-b border-brand-200/70 py-8 sm:flex-row sm:items-center sm:justify-between lg:py-10">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-brand-500 text-white"
            >
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-brand-500">
                {termNotice.eyebrow}
              </p>
              <p className="mt-1 font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
                {termNotice.title}
              </p>
              <p className="text-[0.9rem] font-medium text-ink-body">{termNotice.date}</p>
            </div>
          </div>

          <Button href={termNotice.cta.href} variant="outline" size="sm" arrow>
            {termNotice.cta.label}
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------- columns --- */}
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
        {/* brand + contact */}
        <div className="lg:col-span-4">
          <Logo />

          <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-ink-body">
            An independent, secular day and boarding school for boys and girls
            aged 2½ to 16 in Ikeja, Lagos.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Avi-Cenna on Facebook"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-surface text-brand-600 shadow-soft transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-brand-500 hover:text-white"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Avi-Cenna on Instagram"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-surface text-brand-600 shadow-soft transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-brand-500 hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* contact details */}
        <div className="lg:col-span-3">
          <FooterHeading>Contact us</FooterHeading>
          <address className="mt-4 flex flex-col gap-3 not-italic">
            <span className="text-[0.9rem] leading-relaxed text-ink-body">
              {site.address}
            </span>
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="focus-ring w-fit text-[0.9rem] font-medium text-ink-body transition-colors duration-fast hover:text-brand-600"
              >
                {phone}
              </a>
            ))}
            <a
              href={`mailto:${site.email}`}
              className="focus-ring w-fit text-[0.9rem] font-medium text-ink-body transition-colors duration-fast hover:text-brand-600"
            >
              {site.email}
            </a>
            <a
              href={directions.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group mt-1 flex w-fit items-center gap-1.5 text-[0.9rem] font-bold text-brand-600 transition-colors duration-fast hover:text-brand-700"
            >
              {directions.label}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-base ease-out-expo group-hover:translate-x-1" />
            </a>
          </address>
        </div>

        {/* quick links */}
        <div className="lg:col-span-2">
          <FooterHeading>Quick links</FooterHeading>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* the school */}
        <div className="lg:col-span-3">
          <FooterHeading>The school</FooterHeading>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navigation
              .filter((section) => section.href !== "/")
              .map((section) => (
                <li key={section.href}>
                  <FooterLink href={section.href}>{section.label}</FooterLink>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* ------------------------------------------------- bottom bar --- */}
      <div className="border-t border-brand-200/70">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-[0.8rem] text-ink-muted">
            © 2002–{year} {site.name}. All rights reserved.
          </p>
          <p className="text-[0.8rem] font-medium text-brand-600">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------- pieces --- */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring w-fit text-[0.9rem] text-ink-body underline-offset-4 transition-colors duration-fast hover:text-brand-600 hover:underline"
    >
      {children}
    </Link>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.8h17M8.2 3.5v3M15.8 3.5v3" />
      <circle cx="8.6" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
