import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { RegistrationForm } from "@/components/RegistrationForm";
import { oprecConfig } from "@/config/oprec.config";

export const metadata: Metadata = {
  title: `Formulir Pendaftaran — Open Recruitment BDCA ${oprecConfig.periodLabel}`,
  description:
    "Isi formulir pendaftaran Open Recruitment Bina Darma Cyber Army (BDCA) Universitas Bina Darma.",
  alternates: {
    canonical: "/daftar",
  },
};

export default function DaftarPage() {
  return (
    <div className="bdca-daftar-bg min-h-dvh">
      <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-paper lg:static lg:border-b-0 lg:bg-transparent">
        <div className="mx-auto flex min-h-15 max-w-[1220px] items-center justify-between gap-4 px-4 sm:px-8 lg:min-h-20">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2.5 font-bold tracking-[-0.03em] text-ink"
            >
              <Image
                src="/assets/bdca-emblem.webp"
                alt="Logo Bina Darma Cyber Army"
                width={32}
                height={32}
                sizes="32px"
                className="h-8 w-8 object-contain"
                priority
              />
              <span className="text-base font-bold">BDCA</span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c7ddf9] bg-[#e6f1fe]/90 px-3 py-1.5 text-xs font-semibold text-accent-deep">
            <Calendar className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="hidden sm:inline">BDCA</span>
            <span>{oprecConfig.periodLabel}</span>
          </div>
        </div>
      </header>

      <main className="pb-safe pt-5 sm:pt-6 lg:pt-4 lg:pb-16">
        <RegistrationForm />
      </main>
    </div>
  );
}
