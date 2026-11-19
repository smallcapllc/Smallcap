"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/philosophy", label: "Philosophy" },
  { href: "/blog", label: "Blog" },
  { href: "/#services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-20 flex items-center">
      <div className="mx-auto max-w-7xl w-full px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 border border-primary flex items-center justify-center font-serif text-primary font-bold group-hover:scale-110 transition-transform">
            SC
          </div>
          <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-white font-outfit uppercase whitespace-nowrap">
            Small Cap <span className="text-primary tracking-widest font-light ml-1">Consulting</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                pathname === item.href ? "text-primary" : "text-text-dim hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2"></div>
          <Link href="/book" className="btn-outline px-6 py-2.5 !text-[10px]">
            Book a call
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-20 left-0 right-0 glass border-b border-white/5 px-6 py-6 flex flex-col gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                pathname === item.href ? "text-primary" : "text-text-dim hover:text-primary"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="btn-outline px-6 py-2.5 !text-[10px] text-center"
            onClick={() => setOpen(false)}
          >
            Book a call
          </Link>
        </div>
      )}
    </header>
  );
}
