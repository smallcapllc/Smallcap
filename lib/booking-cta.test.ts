import assert from "node:assert/strict";
import test from "node:test";
import { replaceBookingLinks } from "./booking-cta";
import { bookingUrl } from "./site";

test("BOOKING-LINK becomes the fit-call URL", () => {
  const input = "Talk it through: [book a call](BOOKING-LINK).\n\nBOOKING-LINK";
  assert.equal(
    replaceBookingLinks(input),
    `Talk it through: [book a call](${bookingUrl}).\n\n[Book a free 15-minute fit call](${bookingUrl})`,
  );
  assert.equal(bookingUrl, "https://smallcap.cc/book");
});
