import { HONEYPOT } from "@/lib/spam";

/**
 * Positioned off-screen rather than hidden with `display:none`, because the
 * better bots skip inputs they can tell are hidden. `aria-hidden` and
 * `tabIndex={-1}` keep it away from screen readers and the tab order, so no
 * real visitor can reach it either way.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor={HONEYPOT}>Website</label>
      <input id={HONEYPOT} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
