/**
 * A field no visitor can see, reach by keyboard, or hear read out.
 *
 * Automated form-fillers work from the HTML and fill in every input they find.
 * A person cannot fill this one, so anything arriving in it came from a script.
 * Costs nothing, needs no server configuration, and is unaffected by how many
 * proxies sit in front of the app.
 */

export const HONEYPOT = "website";

export function looksAutomated(form: FormData): boolean {
  const value = form.get(HONEYPOT);
  return typeof value === "string" && value.trim().length > 0;
}
