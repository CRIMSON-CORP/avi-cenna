/**
 * Letterhead and building blocks shared by every email.
 *
 * Tables, inline styles, no stylesheet, no webfont — Outlook lays out through
 * Word and Gmail discards most of a <style> block. The one <style> here is
 * mobile-only and the email must read correctly without it.
 *
 * The palette is a hand copy of app/styles/theme.css; custom properties can
 * neither be read from TypeScript nor survive a mail client. Change one
 * there, change it here.
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

/** No webfont survives the trip. */
export const FONT =
  "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";

/** Absolute — a mail client has no origin to resolve a path against. */
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

/** Every value off a public form goes through this before it reaches the
    markup. */
export function esc(value: string) {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Escaped, with the line breaks someone typed into a textarea preserved. */
export function escLines(value: string) {
  return esc(value).replace(/\r?\n/g, "<br />");
}

/* ------------------------------------------------------------ formatting -- */

/** Coarse on purpose — document or scan, not a byte count. */
export function bytes(n: number) {
  if (n < 1024) return `${n} bytes`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Lagos time, labelled. The server runs UTC; an unlabelled stamp would
    report a 9am application as 8am. */
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

/* ----------------------------------------------------------- components -- */

/** "there" when empty — "Hello ," is worse than impersonal. */
export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

/** A small-caps section label. */
export function heading(text: string) {
  return `              <p style="margin:28px 0 14px; font-family:${FONT}; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:${palette.muted};">${esc(text)}</p>
`;
}

/** The one fact the email is about: the position, the date, the subject. */
export function panel({
  label,
  title,
  href,
  chips = [],
}: {
  label: string;
  title: string;
  href?: string;
  chips?: string[];
}) {
  const pills = chips
    .map(
      (chip) =>
        `<span style="display:inline-block; padding:5px 11px; margin:0 6px 6px 0; background-color:${palette.card}; border:1px solid ${palette.blueSoft}; border-radius:999px; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:0.04em; color:${palette.navy};">${esc(chip)}</span>`,
    )
    .join("");

  const titleHtml = href
    ? `<a href="${esc(href)}" style="color:${palette.navy}; text-decoration:none;">${esc(title)}</a>`
    : esc(title);

  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${palette.blueFaint}; border:1px solid ${palette.blueSoft}; border-radius:14px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px; font-family:${FONT}; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:${palette.muted};">${esc(label)}</p>
                    <p style="margin:0${pills ? " 0 12px" : ""}; font-family:${FONT}; font-size:19px; line-height:1.3; font-weight:800; letter-spacing:-0.01em; color:${palette.navy};">${titleHtml}</p>
                    ${pills}
                  </td>
                </tr>
              </table>
`;
}

/** Label/value pairs; the media query stacks them on a phone. Values are
    raw HTML — escape before passing. */
export function rows(pairs: [string, string][]) {
  const cells = pairs
    .map(
      ([label, value]) => `                <tr>
                  <td class="sm-stack" width="120" style="width:120px; padding:0 0 14px; vertical-align:top; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:${palette.muted};">${esc(label)}</td>
                  <td class="sm-stack-v" style="padding:0 0 14px; vertical-align:top; font-family:${FONT}; font-size:15px; line-height:1.5; color:${palette.body};">${value}</td>
                </tr>`,
    )
    .join("\n");

  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${cells}
              </table>
`;
}

/** <button> does nothing in mail. Padding on the anchor so the whole pill
    is the tap target where display:inline-block is ignored. */
export function button(href: string, label: string) {
  return `              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
                <tr>
                  <td style="background-color:${palette.coral}; border-radius:999px;">
                    <a href="${esc(href)}" style="display:inline-block; padding:13px 26px; font-family:${FONT}; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">${esc(label)}</a>
                  </td>
                </tr>
              </table>
`;
}

/** Someone else's words, escaped, line breaks kept. */
export function quote(text: string) {
  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:2px 0 2px 18px; border-left:3px solid ${palette.blueSoft}; font-family:${FONT}; font-size:15px; line-height:1.7; color:${palette.body};">${escLines(text)}</td>
                </tr>
              </table>
`;
}


export function mailtoLink(address: string) {
  return `<a href="${esc(`mailto:${address}`)}" style="color:${palette.blue}; font-weight:600; text-decoration:underline;">${esc(address)}</a>`;
}

export function telLink(phone: string) {
  return `<a href="${esc(`tel:${phone.replace(/[^\d+]/g, "")}`)}" style="color:${palette.blue}; font-weight:600; text-decoration:underline;">${esc(phone)}</a>`;
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

/** 600px via the width attribute, which Outlook honours where it ignores
    the CSS. */
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
  /* Mobile only. */
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

  <!-- Preview line, then padding so the client cannot pull body text up. -->
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
