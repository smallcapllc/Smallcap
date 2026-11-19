import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { contactEmail, contactMailto, pageSocial } from "@/lib/site";

const description =
  "Contact Tre Robinson at Small Cap Consulting. Email smallcapllc@gmail.com, or book a free 15-minute fit call.";

export const metadata = pageSocial("Contact", description, { path: "/contact" });

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-40 pb-32 px-6">
        <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2">
          <div className="animate-fade">
            <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Contact
            </span>
            <h1 className="mb-8 font-outfit text-5xl font-bold tracking-tighter text-white md:text-6xl">
              Send a note to <span className="text-primary italic">Tre.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-text-dim">
              Questions about operations, a manual workflow, or whether Small Cap Consulting is the right fit. If you
              already want to talk it through, book the call.
            </p>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Link href="/book" className="btn-premium">
                Book a call
              </Link>
              <a href={contactMailto} className="text-sm text-primary transition-colors hover:text-accent">
                {contactEmail}
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
