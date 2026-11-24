"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BDCA_LINKS } from "@/config/oprec.config";
import { useRegistrationOpen } from "@/lib/use-registration-open";

const NAV_ITEMS = [
  { label: "Tentang", href: "#tentang", isRoute: false },
  { label: "Divisi", href: "#divisi", isRoute: false },
  { label: "Daftar", href: "/daftar", isRoute: true },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOpen = useRegistrationOpen();

  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex min-h-18 max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-3 font-bold tracking-[-0.04em] text-ink"
        >
          <Image
            src="/assets/bdca-emblem.webp"
            alt="Logo Bina Darma Cyber Army"
            width={36}
            height={36}
            sizes="36px"
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-[-0.04em]">BDCA</span>
            <span className="text-[11px] font-medium tracking-normal text-muted">
              Open Recruitment
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm font-medium text-[#344056] lg:flex"
        >
          {NAV_ITEMS.map((item) =>
            item.isRoute ? (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="py-2 transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            )
          )}
          <a
            href={BDCA_LINKS.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-2 text-muted transition-colors hover:text-accent"
          >
            <span>bidarcyberarmy.org</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isOpen ? (
            <Link
              href="/daftar"
              className="bdca-button-primary inline-flex min-h-11 items-center justify-center rounded-[0.6rem] px-5 text-sm font-bold"
            >
              Daftar Sekarang
            </Link>
          ) : (
            <Link
              href="/daftar"
              className="inline-flex min-h-11 items-center justify-center rounded-[0.6rem] border border-line bg-surface px-4 text-sm font-semibold text-muted"
            >
              Pendaftaran Ditutup
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isOpen && (
            <Link
              href="/daftar"
              className="bdca-button-primary inline-flex min-h-10 items-center justify-center rounded-[0.55rem] px-3.5 text-xs font-bold"
            >
              Daftar
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[0.55rem] border border-line bg-surface text-ink active:bg-surface-tint"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="border-t border-line bg-paper px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col divide-y divide-line">
            {NAV_ITEMS.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center text-sm font-semibold text-ink hover:text-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center text-sm font-semibold text-ink hover:text-accent"
                >
                  {item.label}
                </a>
              )
            )}
            <a
              href={BDCA_LINKS.mainSite}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center justify-between text-sm font-medium text-muted hover:text-accent"
            >
              <span>Kembali ke bidarcyberarmy.org</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-4">
            <Link
              href="/daftar"
              onClick={() => setMenuOpen(false)}
              className="bdca-button-primary flex min-h-11 w-full items-center justify-center rounded-[0.6rem] px-5 text-sm font-bold"
            >
              {isOpen ? "Daftar Sekarang" : "Lihat Status Pendaftaran"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
