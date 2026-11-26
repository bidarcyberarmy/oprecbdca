"use client";

import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { oprecConfig } from "@/config/oprec.config";
import { useRegistrationOpen } from "@/lib/use-registration-open";

export function HeroSection() {
  const isOpen = useRegistrationOpen();

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto max-w-[1280px] px-5 pt-12 pb-14 sm:px-8 sm:pt-18 sm:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-2.5 rounded-[0.55rem] border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink">
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-emerald-600" : "bg-amber-600"
              }`}
              aria-hidden="true"
            />
            <span>
              {isOpen ? "Pendaftaran Dibuka" : "Pendaftaran Ditutup"}
            </span>
            <span className="text-line" aria-hidden="true">
              |
            </span>
            <span className="text-muted">{oprecConfig.periodLabel}</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-[3.75rem] lg:leading-[1.06]">
            Open Recruitment{" "}
            <span className="bdca-display-accent">Bina Darma Cyber Army</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Bergabung bersama komunitas keamanan siber dan pengembangan teknologi
            mahasiswa Universitas Bina Darma. Belajar terstruktur dari dasar,
            bangun proyek nyata, dan berkembang bersama lintas divisi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
            {isOpen ? (
              <Link
                href="/daftar"
                className="bdca-button-primary inline-flex min-h-12 w-full items-center justify-center rounded-[0.6rem] px-6 text-sm font-bold sm:w-auto sm:text-[15px]"
              >
                Daftar Sekarang
              </Link>
            ) : (
              <Link
                href="/daftar"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[0.6rem] border border-line bg-surface px-6 text-sm font-bold text-ink hover:border-accent sm:w-auto"
              >
                Informasi Penutupan
              </Link>
            )}
            <a
              href="#divisi"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[0.6rem] border border-line bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent active:bg-surface-tint sm:w-auto"
            >
              Lihat Divisi yang Dibuka
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-gradient-to-r from-[#f4f8fe] via-[#f8fbff] to-[#edf6fe]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 text-xs text-muted sm:px-8 sm:text-sm">
          <div className="inline-flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              Batas pendaftaran:{" "}
              <strong className="font-semibold text-ink">
                {oprecConfig.registrationDeadline}
              </strong>
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Universitas Bina Darma, Palembang</span>
          </div>
          <div>
            <strong className="font-semibold text-ink">
              {oprecConfig.divisions.length} Divisi Aktif
            </strong>{" "}
            — Terbuka untuk semua prodi &amp; pemula
          </div>
        </div>
      </div>
    </section>
  );
}
