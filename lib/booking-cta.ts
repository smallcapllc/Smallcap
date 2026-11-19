import { bookingUrl } from "./site";

const PLACEHOLDER = "BOOKING-LINK";

/**
 * Future posts in content/blog can point a call to action at BOOKING-LINK.
 * A markdown link target is rewritten in place. A bare placeholder becomes a link.
 */
export function replaceBookingLinks(markdown: string): string {
  const linked = markdown.replaceAll(`](${PLACEHOLDER})`, `](${bookingUrl})`);
  const cta = `[Book a free 15-minute fit call](${bookingUrl})`;
  return linked.replaceAll(PLACEHOLDER, cta);
}
