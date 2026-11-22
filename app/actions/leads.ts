"use server";

import { isHoneypot, parseBooking, parseContact, type LeadResult } from "@/lib/leads";
import { buildBookableDays, slotLabelMap } from "@/lib/slots";
import { insertLead } from "@/lib/supabase";

const GENERIC_ERROR = "Something went wrong sending that. Please try again.";

async function save(lead: Parameters<typeof insertLead>[0]): Promise<LeadResult> {
  try {
    const { error } = await insertLead(lead);
    if (error) {
      console.error("lead insert failed", error.code ?? "", error.message);
      return { ok: false, message: GENERIC_ERROR };
    }
    return { ok: true };
  } catch (error) {
    console.error("lead insert threw", error instanceof Error ? error.message : "unknown");
    return { ok: false, message: GENERIC_ERROR };
  }
}

export async function submitBooking(
  _previous: LeadResult | null,
  formData: FormData,
): Promise<LeadResult> {
  if (isHoneypot(formData)) return { ok: true };
  const parsed = parseBooking(formData, slotLabelMap(buildBookableDays()));
  if (!parsed.ok) return parsed;
  return save(parsed.lead);
}

export async function submitContact(
  _previous: LeadResult | null,
  formData: FormData,
): Promise<LeadResult> {
  if (isHoneypot(formData)) return { ok: true };
  const parsed = parseContact(formData);
  if (!parsed.ok) return parsed;
  return save(parsed.lead);
}
