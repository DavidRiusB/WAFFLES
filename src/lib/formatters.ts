// src/lib/formatters.ts

/**
 * Parse an ISO date string ("YYYY-MM-DD") as local time, not UTC.
 *
 * `new Date("2026-05-28")` parses as UTC midnight, which shifts the
 * date for any timezone west of UTC. Appending T00:00:00 keeps it
 * local.
 */
export function parseLocalDate(isoDate: string): Date {
  return new Date(isoDate + "T00:00:00");
}

/**
 * Format an ISO date string for display, in local time.
 *
 * Variants:
 *   "short" (default) → "Mon, May 28"
 *   "long"            → "Monday, May 28, 2026"
 */
export function formatDay(
  isoDate: string,
  variant: "short" | "long" = "short",
): string {
  const d = parseLocalDate(isoDate);

  if (variant === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Convert a Date to "YYYY-MM-DD" using local time (not UTC).
 *
 * For API requests, query filters, and anywhere you round-trip
 * a date without wanting timezone surprises.
 */
export function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Return a new Date offset from `base` by `days`.
 * Does not mutate `base`.
 */
export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Format an appointment slot for display.
 */
export function formatSlot(slot: string): string {
  const map = {
    morning: "Morning ☀️",
    afternoon: "Afternoon 🌤️",
    evening: "Evening 🌙",
  };
  return map[slot as keyof typeof map] || slot;
}
