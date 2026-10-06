// Turns a case's most recent docket entries into a short, estimated stage label.
// Rules are keyword-based and checked in priority order against the latest few entries,
// so the label reflects where the case appears to be now. It is an estimate, not legal advice.

const LOOKBACK = 6; // how many recent entries to read

// [label, pattern, criminal-only?]. Earlier rules win.
const RULES = [
  ["Settling / dismissing", /\b(stipulation|notice) of (voluntary )?dismissal|voluntar(il)?y dismiss|order of discontinuance|30[- ]day order|notice of settlement|(have|has) (reached a )?settle(d|ment)|settlement (has been|was) reached/],
  ["Stayed", /\b(order (granting )?(a )?stay|stay(ing)? (of )?(this |the )?(case|action|proceedings?|discovery)|(case|action) (is )?(hereby )?stayed)\b/],
  ["On appeal", /\bnotice of (interlocutory )?appeal\b/],
  ["Sentencing", /\bsentenc(e|ed|ing)\b/, true],
  ["Plea", /\b(plea agreement|change of plea|plea hearing|guilty plea|pleaded guilty|plea of guilty)\b/, true],
  ["Trial", /\b(jury trial|bench trial|trial (is )?(set|scheduled|held|began|commenced)|jury selection|final pretrial|joint pretrial order|motions? in limine|voir dire)\b/],
  ["Summary judgment", /\bsummary judgment\b/],
  ["Class certification", /\bclass certification\b/],
  ["Motion to dismiss", /\bmotion to dismiss|judgment on the pleadings|\b12\(b\)/],
  ["Habeas petition", /\bhabeas\b/],
  ["Default", /\b(default judgment|certificate of default)\b/],
  ["Pre-trial (criminal)", /\b(indictment|arraignment|detention|bail|bond|initial appearance|superseding|speedy trial|exclud(e|ing) time)\b/, true],
  ["Discovery", /\b(discovery|deposition|case management plan|scheduling order|protective order|initial pretrial conference|interrogator)/],
  ["Pleadings / service", /\b(complaint|summons|answer|waiver of service|affidavit of service|notice of appearance|civil cover sheet)\b/],
];

export function entryText(e) {
  const parts = [e.description, ...(e.recap_documents ?? []).map((d) => d.description)];
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/** @param entries newest first; @param criminal true for "-cr-" dockets */
export function classify(entries, criminal) {
  if (!entries.length) return "No entries yet";
  const texts = entries.slice(0, LOOKBACK).map((e) => entryText(e).toLowerCase());
  for (const [label, re, crimOnly] of RULES) {
    if (crimOnly && !criminal) continue;
    if (texts.some((t) => re.test(t))) return label;
  }
  return "Other / unclear";
}
