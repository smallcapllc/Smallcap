import assert from "node:assert/strict";
import test from "node:test";
import { isPostLive, isPublishedDate, newYorkDateString, normalizePostDate } from "./publish-date";

test("newYorkDateString uses the America/New_York calendar day", () => {
  // 2026-11-18 04:30 UTC is still 2026-11-17 23:30 EST (UTC-5).
  assert.equal(newYorkDateString(new Date("2026-11-18T04:30:00.000Z")), "2026-11-17");
  // Midnight EST.
  assert.equal(newYorkDateString(new Date("2026-11-18T05:00:00.000Z")), "2026-11-18");
  // 2026-07-15 03:30 UTC is still 2026-07-14 23:30 EDT (UTC-4).
  assert.equal(newYorkDateString(new Date("2026-07-15T03:30:00.000Z")), "2026-07-14");
  // Midnight EDT.
  assert.equal(newYorkDateString(new Date("2026-07-15T04:00:00.000Z")), "2026-07-15");
});

test("a post is live on its New York date and hidden before that", () => {
  assert.equal(isPublishedDate("2026-11-18", "2026-11-18"), true);
  assert.equal(isPublishedDate("2026-11-17", "2026-11-18"), true);
  assert.equal(isPublishedDate("2026-11-19", "2026-11-18"), false);
  assert.equal(isPublishedDate("", "2026-11-18"), false);
  assert.equal(isPublishedDate("2026-11-18", ""), false);
  assert.equal(isPublishedDate("November 18, 2026", "2026-11-18"), false);
  assert.equal(isPublishedDate("2026-1-18", "2026-11-18"), false);

  const beforeMidnight = new Date("2026-11-18T04:30:00.000Z");
  const atMidnight = new Date("2026-11-18T05:00:00.000Z");
  assert.equal(isPostLive("2026-11-18", beforeMidnight), false);
  assert.equal(isPostLive("2026-11-17", beforeMidnight), true);
  assert.equal(isPostLive("2026-11-18", atMidnight), true);
  assert.equal(isPostLive("2026-11-19", atMidnight), false);
});

test("normalizePostDate keeps the calendar day from strings and YAML dates", () => {
  assert.equal(normalizePostDate("2026-11-09"), "2026-11-09");
  assert.equal(normalizePostDate(" 2026-11-09 "), "2026-11-09");
  assert.equal(normalizePostDate("2026-11-09T00:00:00.000Z"), "2026-11-09");
  assert.equal(normalizePostDate(new Date("2026-11-09T00:00:00.000Z")), "2026-11-09");
  assert.equal(normalizePostDate(null), "");
  assert.equal(normalizePostDate("not-a-date"), "");
});
