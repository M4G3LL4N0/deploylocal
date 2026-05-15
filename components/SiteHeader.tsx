"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/builder", label: "Builder" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.3em] text-white" onClick={() => setOpen(false)}>
          DEPLOYLOCAL.APP
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.slice(0, 2).map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-zinc-300 transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black">
            Login
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/builder" className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black" onClick={() => setOpen(false)}>
            Builder
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
            aria-expanded={open}
            aria-controls="deploylocal-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden>{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="deploylocal-mobile-nav"
          className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-3 text-sm text-zinc-300 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
