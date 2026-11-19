import Link from "next/link";
import { contactEmail, contactMailto, siteDescription } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contact" className="bg-secondary py-20 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 border border-primary flex items-center justify-center font-serif text-primary text-xs">
                SC
              </div>
              <span className="font-outfit font-bold uppercase tracking-tight">
                Small Cap <span className="text-primary font-light">Consulting</span>
              </span>
            </div>
            <p className="text-text-dim max-w-sm leading-relaxed text-sm">
              {siteDescription}
            </p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase text-text-dim">
              <li>
                <Link href="/philosophy" className="hover:text-primary transition-colors">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase text-text-dim">
              <li>
                <a
                  href={contactMailto}
                  className="normal-case tracking-normal text-sm text-primary transition-colors hover:text-accent"
                >
                  {contactEmail}
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-primary transition-colors">
                  Book a call
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
            © 2024 Small Cap Consulting. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] uppercase tracking-[0.2em] text-text-dim hover:text-primary transition-colors">
              Disclosures
            </a>
            <a href="#" className="text-[10px] uppercase tracking-[0.2em] text-text-dim hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
