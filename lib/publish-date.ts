export const PUBLISH_TIME_ZONE = "America/New_York";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

/** Calendar date in America/New_York, as YYYY-MM-DD. */
export function newYorkDateString(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PUBLISH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error(`Could not format a date in ${PUBLISH_TIME_ZONE}`);
  }
  return `${year}-${month}-${day}`;
}

/**
 * Frontmatter dates are calendar days. Quoted YAML stays a string; unquoted
 * YAML is parsed as a Date at UTC midnight, so the UTC calendar fields are
 * the day the author wrote.
 */
export function normalizePostDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const match = ISO_DATE_PREFIX.exec(String(value ?? "").trim());
  return match ? match[1] : "";
}

/** A post is live on its date and afterward. A later date stays unpublished. */
export function isPublishedDate(postDate: string, today: string): boolean {
  return ISO_DATE.test(postDate) && ISO_DATE.test(today) && postDate <= today;
}

export function isPostLive(postDate: string, now: Date = new Date()): boolean {
  return isPublishedDate(normalizePostDate(postDate), newYorkDateString(now));
}
