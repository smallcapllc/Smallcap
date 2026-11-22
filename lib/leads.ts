import { slotLabelMap, type BookableDay } from "./slots";

export const TRADES = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Fire protection",
  "General contracting",
  "Distribution/wholesale",
  "Other",
] as const;

export type Trade = (typeof TRADES)[number];

export type PreferredTime = {
  iso: string;
  label: string;
};

export type LeadInsert = {
  kind: "booking" | "contact";
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  trade: string | null;
  message: string | null;
  preferred_times: PreferredTime[] | null;
  source_page: string;
};

export type FieldName =
  | "name"
  | "email"
  | "company"
  | "phone"
  | "trade"
  | "message"
  | "preferred_times";

export type FieldErrors = Partial<Record<FieldName, string>>;

export type LeadResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export type ParseResult =
  | { ok: true; lead: LeadInsert }
  | { ok: false; message: string; fieldErrors: FieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALIDATION_MESSAGE = "Please fix the fields below.";

function cleanLine(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

function cleanMessage(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

function readLine(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? cleanLine(value) : "";
}

function readMessage(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? cleanMessage(value) : "";
}

export function isHoneypot(formData: FormData): boolean {
  const value = formData.get("company_website");
  if (typeof value === "string") return value.trim() !== "";
  return value != null;
}

function optionalBounded(
  value: string,
  max: number,
  tooLong: string,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (!value) return { ok: true, value: null };
  if (value.length > max) return { ok: false, error: tooLong };
  return { ok: true, value };
}

function parsePhone(value: string): { ok: true; value: string | null } | { ok: false; error: string } {
  if (!value) return { ok: true, value: null };
  if (value.length > 40) return { ok: false, error: "Enter a shorter phone number." };
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return { ok: false, error: "Enter a phone number we can dial." };
  }
  return { ok: true, value };
}

function sharedFields(formData: FormData): {
  errors: FieldErrors;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
} {
  const errors: FieldErrors = {};
  const name = readLine(formData, "name");
  const email = readLine(formData, "email").toLowerCase();
  if (!name) errors.name = "Enter your name.";
  else if (name.length > 120) errors.name = "Name is too long.";

  if (!email) errors.email = "Enter your email.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = "Enter a valid email.";

  const company = optionalBounded(readLine(formData, "company"), 160, "Company name is too long.");
  if (!company.ok) errors.company = company.error;

  const phone = parsePhone(readLine(formData, "phone"));
  if (!phone.ok) errors.phone = phone.error;

  return {
    errors,
    name,
    email,
    company: company.ok ? company.value : null,
    phone: phone.ok ? phone.value : null,
  };
}

function readPreferredIsos(raw: string): string[] | null {
  if (!raw) return [];
  if (raw.length > 2000) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length > 3) return null;
  const isos: string[] = [];
  for (const item of parsed) {
    if (typeof item !== "string" || item.length === 0 || item.length > 40) return null;
    if (!isos.includes(item)) isos.push(item);
  }
  return isos;
}

export function parseBooking(formData: FormData, allowed: Map<string, string>): ParseResult {
  const shared = sharedFields(formData);
  const errors = shared.errors;
  const tradeRaw = readLine(formData, "trade");
  let trade: string | null = null;
  if (tradeRaw) {
    if (!(TRADES as readonly string[]).includes(tradeRaw)) {
      errors.trade = "Choose a trade from the list.";
    } else {
      trade = tradeRaw;
    }
  }

  const messageResult = optionalBounded(readMessage(formData, "message"), 4000, "That note is too long.");
  const message = messageResult.ok ? messageResult.value : null;
  if (!messageResult.ok) errors.message = messageResult.error;

  const isos = readPreferredIsos(readLine(formData, "preferred_times"));
  let preferred: PreferredTime[] | null = null;
  if (isos === null) {
    errors.preferred_times = "Choose up to 3 times from the list.";
  } else if (isos.some((iso) => !allowed.has(iso))) {
    errors.preferred_times = "One of those times is no longer open. Pick another.";
  } else if (isos.length > 0) {
    preferred = isos.map((iso) => ({ iso, label: allowed.get(iso) ?? "" }));
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: VALIDATION_MESSAGE, fieldErrors: errors };
  }

  return {
    ok: true,
    lead: {
      kind: "booking",
      name: shared.name,
      email: shared.email,
      company: shared.company,
      phone: shared.phone,
      trade,
      message,
      preferred_times: preferred,
      source_page: "/book",
    },
  };
}

export function parseContact(formData: FormData): ParseResult {
  const shared = sharedFields(formData);
  const errors = shared.errors;
  const message = readMessage(formData, "message");
  if (!message) errors.message = "Enter a message.";
  else if (message.length > 4000) errors.message = "That message is too long.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: VALIDATION_MESSAGE, fieldErrors: errors };
  }

  return {
    ok: true,
    lead: {
      kind: "contact",
      name: shared.name,
      email: shared.email,
      company: shared.company,
      phone: shared.phone,
      trade: null,
      message,
      preferred_times: null,
      source_page: "/contact",
    },
  };
}

export function allowedSlots(days: BookableDay[]): Map<string, string> {
  return slotLabelMap(days);
}
