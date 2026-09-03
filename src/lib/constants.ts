export const APP_NAME = "Evergreen";
export const APP_TAGLINE = "Set your bills once. Never forget one again.";

// Used only as the domain half of each VEVENT's UID (a stable, opaque
// identifier — it does not need to resolve). ".invalid" is the TLD RFC 2606
// reserves for exactly this kind of placeholder use.
export const ICS_UID_DOMAIN = "evergreen.invalid";

export const REMINDER_OFFSET_OPTIONS = [
  { days: 0, label: "Same day" },
  { days: 1, label: "1 day before" },
  { days: 2, label: "2 days before" },
  { days: 3, label: "3 days before" },
  { days: 7, label: "1 week before" },
] as const;

export const DEFAULT_REMINDER_TIME = "09:00";
