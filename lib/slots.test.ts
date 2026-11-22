import assert from "node:assert/strict";
import test from "node:test";
import { buildBookableDays } from "./slots";

function labels(now: string) {
  return buildBookableDays(new Date(now)).map((day) => day.label);
}

test("offers the next 10 weekdays with 30-minute Eastern slots from 9:00 AM to 4:30 PM", () => {
  const days = buildBookableDays(new Date("2026-01-05T12:00:00.000Z"));
  assert.equal(days.length, 10);
  assert.deepEqual(
    days.map((day) => day.key),
    [
      "2026-01-05",
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
      "2026-01-12",
      "2026-01-13",
      "2026-01-14",
      "2026-01-15",
      "2026-01-16",
    ],
  );
  assert.equal(days[0]?.slots.length, 16);
  assert.equal(days[0]?.slots[0]?.time, "9:00 AM");
  assert.equal(days[0]?.slots[0]?.label, "Monday, January 5 · 9:00 AM ET");
  assert.equal(days[0]?.slots[0]?.iso, "2026-01-05T14:00:00.000Z");
  assert.equal(days[0]?.slots.at(-1)?.time, "4:30 PM");
  assert.equal(days[0]?.slots.at(-1)?.label, "Monday, January 5 · 4:30 PM ET");
  assert.equal(days[0]?.slots.at(-1)?.iso, "2026-01-05T21:30:00.000Z");
});

test("a summer slot is stored in Eastern Daylight Time", () => {
  const days = buildBookableDays(new Date("2026-07-06T12:00:00.000Z"));
  assert.equal(days[0]?.slots[0]?.iso, "2026-07-06T13:00:00.000Z");
  assert.equal(days[0]?.slots[0]?.label, "Monday, July 6 · 9:00 AM ET");
});

test("slots that have already started today are left off", () => {
  const days = buildBookableDays(new Date("2026-01-05T15:00:00.000Z"));
  assert.equal(days[0]?.key, "2026-01-05");
  assert.equal(days[0]?.slots[0]?.time, "10:30 AM");
  assert.equal(days[0]?.slots.some((slot) => slot.time === "9:00 AM"), false);
  assert.equal(days[0]?.slots.some((slot) => slot.time === "10:00 AM"), false);
});

test("a finished Friday and the weekend roll forward to the next 10 weekdays", () => {
  assert.deepEqual(labels("2026-01-09T22:30:00.000Z").slice(0, 2), [
    "Monday, January 12",
    "Tuesday, January 13",
  ]);
  assert.deepEqual(labels("2026-01-10T15:00:00.000Z").slice(0, 1), ["Monday, January 12"]);
  for (const label of labels("2026-01-10T15:00:00.000Z")) {
    assert.equal(/Saturday|Sunday/.test(label), false);
  }
});
