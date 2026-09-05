/**
 * The chrome every Avi-Cenna email shares, plus the handful of helpers that
 * make writing one bearable.
 *
 * EMAIL HTML IS NOT WEB HTML. Everything here is deliberately twenty years
 * out of date — tables for layout, a style attribute on every element, no
 * stylesheet, no webfont, no flexbox and no grid — because Outlook lays out
 * through Word's rendering engine and Gmail discards most of a <style> block.
 * Anything that matters has to survive on inline attributes alone. The one
 * <style> block below carries mobile refinements only: the email must read
 * correctly with it thrown away, because for a good share of readers it will
 * be.
 *
 * The palette is a hand copy of the tokens in app/styles/theme.css. Custom
 * properties cannot be read from TypeScript, and would not survive a mail
 * client if they could, so this is the one place outside that file where
 * brand colours are written out. Change one there, change it here.
 */

import { site } from "@/lib/site";

export const palette = {
  navy: "#10365c", // brand-900, --color-ink
  navyDeep: "#0a2440", // brand-950
  blue: "#4a90d0", // brand-500
  blueSoft: "#dcedfb", // brand-100 — hairlines and tinted panels
  blueFaint: "#f0f7fd", // brand-50
  coral: "#f2795c", // accent-500
  page: "#eef5fb", // surface-alt
  card: "#ffffff",
  body: "#46586e", // ink-body
  muted: "#7b8ba0", // ink-muted
  onNavy: "#ffffff",
  onNavySoft: "#b9d3ea", // ink-invert-soft
} as const;

/** No webfont survives the trip, so this is the stack clients actually have.
    Plus Jakarta Sans is the site's face; in an inbox it is Segoe or SF. */
export const FONT =
  "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";

/** Absolute, because a mail client has no origin to resolve a path against.
    Set NEXT_PUBLIC_SITE_URL on the VPS; the fallback is the live domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://avi-cenna.com").replace(
  /\/$/,
  "",
);

/* ------------------------------------------------------------- escaping -- */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Everything a stranger typed goes through this before it reaches the markup.
 *
 * The application form is an unauthenticated text box pointed at the HR
 * inbox. A name of `<img src=x onerror=...>` has to arrive in that inbox as
 * characters on the page, not as markup — mail clients are far more hostile
 * to script than a browser is, but the same input also lands in webmail, in
 * previews, and eventually in whatever admin screen reads these back.
 */
export function esc(value: string) {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Escaped, with the line breaks someone typed into a textarea preserved. */
export function escLines(value: string) {
  return esc(value).replace(/\r?\n/g, "<br />");
}

/* ------------------------------------------------------------ formatting -- */

/** Human file size. Deliberately coarse: nobody reading an application needs
    the byte count, they need to know whether it is a document or a scan. */
export function bytes(n: number) {
  if (n < 1024) return `${n} bytes`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Lagos time, always, and labelled as such.
 *
 * The server's own clock is UTC and the people reading these are in Lagos, so
 * an unlabelled timestamp would quietly report a 9am application as 8am. West
 * Africa Time has no daylight saving, but the timezone is named rather than
 * assumed so this keeps working if the VPS is ever moved.
 */
export function lagos(iso: string) {
  const stamp = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
  return `${stamp} WAT`;
}

/* ---------------------------------------------------------------- shell -- */

export type ShellParts = {
  /** The hidden line the inbox lists after the subject. Write it as the
      sentence that decides whether someone opens this now or after lunch. */
  preheader: string;
  /** Small caps line in the navy band — what kind of email this is. */
  eyebrow: string;
  /** The one thing the email is about. Escaped here, so pass it raw. */
  title: string;
  /** The white card's contents. Already-escaped HTML. */
  body: string;
  /** Small print under the card. Already-escaped HTML. */
  footnote: string;
};

/**
 * Wraps a body in the school's letterhead.
 *
 * 600px is the width every mail client has agreed on for twenty years; the
 * `width` attribute rather than a CSS width because Outlook honours the
 * attribute and ignores a good deal of the CSS.
 */
export function shell({ preheader, eyebrow, title, body, footnote }: ShellParts) {
  return `<!doctype html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(title)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  /* Mobile refinements only. Everything above reads correctly without this. */
  @media only screen and (max-width: 620px) {
    .sm-full { width: 100% !important; }
    .sm-pad { padding-left: 22px !important; padding-right: 22px !important; }
    .sm-stack { display: block !important; width: 100% !important; padding-bottom: 2px !important; }
    .sm-stack-v { display: block !important; width: 100% !important; padding-bottom: 16px !important; }
    .sm-title { font-size: 25px !important; line-height: 1.15 !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; width:100%; background-color:${palette.page};">

  <!-- The inbox preview line, and enough invisible padding after it that the
       client cannot drag the first words of the body up to fill the space. -->
  <div style="display:none; max-height:0; max-width:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:${palette.page}; mso-hide:all;">${esc(preheader)}</div>
  <div style="display:none; max-height:0; max-width:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; mso-hide:all;">&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${palette.page};">
    <tr>
      <td align="center" style="padding:28px 12px 40px;">

        <table role="presentation" class="sm-full" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- ---------------------------------------------- letterhead -- -->
          <tr>
            <td class="sm-pad" style="background-color:${palette.navy}; border-radius:16px 16px 0 0; padding:26px 34px 24px;">
              <p style="margin:0; font-family:${FONT}; font-size:10px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:${palette.onNavySoft};">${esc(eyebrow)}</p>
              <h1 class="sm-title" style="margin:10px 0 0; font-family:${FONT}; font-size:28px; line-height:1.2; font-weight:800; letter-spacing:-0.02em; color:${palette.onNavy};">${esc(title)}</h1>
            </td>
          </tr>

          <!-- --------------------------------------------------- body -- -->
          <tr>
            <td class="sm-pad" style="background-color:${palette.card}; border-radius:0 0 16px 16px; padding:32px 34px 34px;">
${body}
            </td>
          </tr>

          <!-- ------------------------------------------------- footer -- -->
          <tr>
            <td class="sm-pad" style="padding:24px 34px 0;">
              <p style="margin:0 0 10px; font-family:${FONT}; font-size:12px; line-height:1.6; color:${palette.muted};">${footnote}</p>
              <p style="margin:0; font-family:${FONT}; font-size:12px; line-height:1.6; color:${palette.muted};">
                <strong style="color:${palette.body};">${esc(site.name)}</strong><br />
                ${esc(site.address)}<br />
                ${site.phones.map(esc).join(" &middot; ")}
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
