"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/leads";
import { Confirmation, controlClass, Field, FormError, Honeypot } from "@/components/FormControls";
import type { FieldErrors } from "@/lib/leads";

const CONFIRMATION = "Got it. Tre will reply by email within one business day.";

function describedBy(id: string, error?: string): string | undefined {
  return error ? `${id}-error` : undefined;
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, null);
  const errors: FieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  if (state?.ok) return <Confirmation message={CONFIRMATION} />;

  return (
    <form action={formAction} aria-busy={pending} className="glass relative rounded-2xl p-8 md:p-10">
      <Honeypot id="contact-company-website" />
      <div className="space-y-5">
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("contact-name", errors.name)}
            className={controlClass(Boolean(errors.name))}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("contact-email", errors.email)}
            className={controlClass(Boolean(errors.email))}
          />
        </Field>
        <Field id="contact-company" label="Company" optional error={errors.company}>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={160}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={describedBy("contact-company", errors.company)}
            className={controlClass(Boolean(errors.company))}
          />
        </Field>
        <Field id="contact-phone" label="Phone" optional error={errors.phone}>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("contact-phone", errors.phone)}
            className={controlClass(Boolean(errors.phone))}
          />
        </Field>
        <Field id="contact-message" label="Message" error={errors.message}>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            maxLength={4000}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("contact-message", errors.message)}
            className={controlClass(Boolean(errors.message))}
          />
        </Field>
        <FormError message={state && !state.ok ? state.message : undefined} />
        <button type="submit" className="btn-premium w-full text-center" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
