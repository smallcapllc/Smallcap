"use client";

import { useActionState, useMemo, useState } from "react";
import { submitBooking } from "@/app/actions/leads";
import { Confirmation, controlClass, Field, FormError, Honeypot } from "@/components/FormControls";
import { TRADES, type FieldErrors } from "@/lib/leads";
import type { BookableDay } from "@/lib/slots";

const CONFIRMATION = "Got it. Tre will confirm a time by email within one business day.";
const MAX_TIMES = 3;

function describedBy(id: string, error?: string): string | undefined {
  return error ? `${id}-error` : undefined;
}

export default function BookForm({ days }: { days: BookableDay[] }) {
  const [state, formAction, pending] = useActionState(submitBooking, null);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(days[0]?.key ?? "");
  const errors: FieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const slotsByIso = useMemo(() => {
    const map = new Map<string, { label: string }>();
    for (const day of days) {
      for (const slot of day.slots) map.set(slot.iso, slot);
    }
    return map;
  }, [days]);
  const day = days.find((entry) => entry.key === activeDay) ?? days[0];
  const full = selected.length >= MAX_TIMES;

  function toggle(iso: string) {
    setSelected((current) => {
      if (current.includes(iso)) return current.filter((item) => item !== iso);
      if (current.length >= MAX_TIMES) return current;
      return [...current, iso];
    });
  }

  if (state?.ok) return <Confirmation message={CONFIRMATION} />;

  return (
    <form action={formAction} aria-busy={pending} className="glass relative rounded-2xl p-8 md:p-10">
      <Honeypot id="booking-company-website" />
      <div className="space-y-5">
        <Field id="booking-name" label="Name" error={errors.name}>
          <input
            id="booking-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("booking-name", errors.name)}
            className={controlClass(Boolean(errors.name))}
          />
        </Field>
        <Field id="booking-email" label="Email" error={errors.email}>
          <input
            id="booking-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("booking-email", errors.email)}
            className={controlClass(Boolean(errors.email))}
          />
        </Field>
        <Field id="booking-company" label="Company" optional error={errors.company}>
          <input
            id="booking-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={160}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={describedBy("booking-company", errors.company)}
            className={controlClass(Boolean(errors.company))}
          />
        </Field>
        <Field id="booking-phone" label="Phone" optional error={errors.phone}>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("booking-phone", errors.phone)}
            className={controlClass(Boolean(errors.phone))}
          />
        </Field>
        <Field id="booking-trade" label="Trade / industry" optional error={errors.trade}>
          <select
            id="booking-trade"
            name="trade"
            defaultValue=""
            aria-invalid={errors.trade ? true : undefined}
            aria-describedby={describedBy("booking-trade", errors.trade)}
            className={`${controlClass(Boolean(errors.trade))} scheme-dark`}
          >
            <option value="">Select a trade</option>
            {TRADES.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="booking-message"
          label="What's the biggest manual headache right now?"
          optional
          error={errors.message}
        >
          <textarea
            id="booking-message"
            name="message"
            rows={4}
            maxLength={4000}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("booking-message", errors.message)}
            className={controlClass(Boolean(errors.message))}
          />
        </Field>

        <div>
          <p id="preferred-times-label" className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Preferred times
            <span className="ml-2 font-normal normal-case tracking-normal text-white/40">Optional</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-dim" aria-live="polite">
            {selected.length} of {MAX_TIMES} selected. Times are 30 minutes, 9:00 AM–4:30 PM Eastern (ET), on the next{" "}
            {days.length} business days.
          </p>
          {days.length === 0 ? (
            <p className="mt-4 text-sm text-text-dim">No open times right now. Send a note from the contact page.</p>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Business days">
                {days.map((entry) => {
                  const active = entry.key === day?.key;
                  const picked = entry.slots.some((slot) => selected.includes(slot.iso));
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveDay(entry.key)}
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 text-text-dim hover:border-primary/40 hover:text-white"
                      }`}
                    >
                      {entry.label}
                      {picked ? <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" /> : null}
                    </button>
                  );
                })}
              </div>
              {day ? (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tabpanel" aria-labelledby="preferred-times-label">
                  {day.slots.map((slot) => {
                    const on = selected.includes(slot.iso);
                    return (
                      <button
                        key={slot.iso}
                        type="button"
                        aria-pressed={on}
                        aria-label={slot.label}
                        disabled={!on && full}
                        onClick={() => toggle(slot.iso)}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30 ${
                          on
                            ? "border-primary bg-primary text-background"
                            : "border-white/10 text-white/80 hover:border-primary/50"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {selected.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {selected.map((iso) => (
                    <li key={iso} className="flex items-center justify-between gap-3 text-sm text-white">
                      <span>{slotsByIso.get(iso)?.label ?? iso}</span>
                      <button
                        type="button"
                        onClick={() => toggle(iso)}
                        className="text-[10px] uppercase tracking-widest text-text-dim hover:text-primary"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
          <input type="hidden" name="preferred_times" value={JSON.stringify(selected)} />
          {errors.preferred_times ? (
            <p id="preferred-times-error" className="mt-2 text-xs text-red-300">
              {errors.preferred_times}
            </p>
          ) : null}
        </div>

        <FormError message={state && !state.ok ? state.message : undefined} />
        <button type="submit" className="btn-premium w-full text-center" disabled={pending}>
          {pending ? "Sending…" : "Request the call"}
        </button>
      </div>
    </form>
  );
}
