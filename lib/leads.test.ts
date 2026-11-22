import assert from "node:assert/strict";
import test from "node:test";
import { isHoneypot, parseBooking, parseContact } from "./leads";
import { insertLead, type LeadWriter } from "./supabase";

const open = new Map<string, string>([
  ["2026-01-05T14:00:00.000Z", "Monday, January 5 · 9:00 AM ET"],
  ["2026-01-05T14:30:00.000Z", "Monday, January 5 · 9:30 AM ET"],
  ["2026-01-06T14:00:00.000Z", "Tuesday, January 6 · 9:00 AM ET"],
]);

function form(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

const bookingBase = {
  name: "Ada Owner",
  email: "Ada@Example.com",
  company: "North Roofing",
  phone: "(555) 010-0199",
  trade: "Roofing",
  message: "Estimates are still on paper.",
  preferred_times: JSON.stringify(["2026-01-05T14:00:00.000Z", "2026-01-06T14:00:00.000Z"]),
};

test("a booking stores server labels for the chosen Eastern slots", () => {
  const parsed = parseBooking(form(bookingBase), open);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.lead.kind, "booking");
  assert.equal(parsed.lead.email, "ada@example.com");
  assert.equal(parsed.lead.trade, "Roofing");
  assert.equal(parsed.lead.source_page, "/book");
  assert.deepEqual(parsed.lead.preferred_times, [
    { iso: "2026-01-05T14:00:00.000Z", label: "Monday, January 5 · 9:00 AM ET" },
    { iso: "2026-01-06T14:00:00.000Z", label: "Tuesday, January 6 · 9:00 AM ET" },
  ]);
});

test("booking validation rejects a missing name, a bad trade, and a fourth time", () => {
  const missing = parseBooking(form({ ...bookingBase, name: "  " }), open);
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.equal(missing.fieldErrors.name, "Enter your name.");

  const trade = parseBooking(form({ ...bookingBase, trade: "Landscaping" }), open);
  assert.equal(trade.ok, false);
  if (!trade.ok) assert.match(trade.fieldErrors.trade ?? "", /list/);

  const times = parseBooking(
    form({
      ...bookingBase,
      preferred_times: JSON.stringify([
        "2026-01-05T14:00:00.000Z",
        "2026-01-05T14:30:00.000Z",
        "2026-01-06T14:00:00.000Z",
        "2026-01-06T14:30:00.000Z",
      ]),
    }),
    open,
  );
  assert.equal(times.ok, false);
  if (!times.ok) assert.match(times.fieldErrors.preferred_times ?? "", /3/);
});

test("an unknown slot is rejected and an empty selection is allowed", () => {
  const stale = parseBooking(
    form({ ...bookingBase, preferred_times: JSON.stringify(["2026-01-05T20:00:00.000Z"]) }),
    open,
  );
  assert.equal(stale.ok, false);

  const none = parseBooking(form({ ...bookingBase, preferred_times: "[]", company: "", phone: "" }), open);
  assert.equal(none.ok, true);
  if (!none.ok) return;
  assert.equal(none.lead.preferred_times, null);
  assert.equal(none.lead.company, null);
  assert.equal(none.lead.phone, null);
});

test("contact requires a message and ignores booking-only fields", () => {
  const missing = parseContact(form({ name: "Ada", email: "ada@example.com" }));
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.equal(missing.fieldErrors.message, "Enter a message.");

  const parsed = parseContact(
    form({
      name: "Ada Owner",
      email: "ada@example.com",
      company: "North Roofing",
      phone: "555-010-0199",
      message: "Can you look at our service board?",
      trade: "Roofing",
      preferred_times: JSON.stringify(["2026-01-05T14:00:00.000Z"]),
    }),
  );
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.lead.kind, "contact");
  assert.equal(parsed.lead.source_page, "/contact");
  assert.equal(parsed.lead.trade, null);
  assert.equal(parsed.lead.preferred_times, null);
  assert.equal(parsed.lead.message, "Can you look at our service board?");
});

test("a filled honeypot is detected and a blank one is not", () => {
  assert.equal(isHoneypot(form({ company_website: "" })), false);
  assert.equal(isHoneypot(form({ company_website: "https://spam.example" })), true);
  assert.equal(isHoneypot(form({})), false);
});

test("insert writes the row and does not read it back", async () => {
  const calls: string[] = [];
  const writer: LeadWriter = {
    from(table) {
      assert.equal(table, "leads");
      return {
        insert(row) {
          calls.push("insert");
          assert.equal(row.kind, "contact");
          const result = Promise.resolve({ error: null });
          return Object.assign(result, {
            select() {
              calls.push("select");
              return result;
            },
          });
        },
      };
    },
  };

  const { error } = await insertLead(
    {
      kind: "contact",
      name: "Ada Owner",
      email: "ada@example.com",
      company: null,
      phone: null,
      trade: null,
      message: "Hello",
      preferred_times: null,
      source_page: "/contact",
    },
    writer,
  );
  assert.equal(error, null);
  assert.deepEqual(calls, ["insert"]);
});
