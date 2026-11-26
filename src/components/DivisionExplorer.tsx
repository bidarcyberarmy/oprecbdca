"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, GraduationCap, Headphones } from "lucide-react";
import { BDCA_LINKS, oprecConfig, type Division } from "@/config/oprec.config";
import { useRegistrationOpen } from "@/lib/use-registration-open";

function DivisionDetailContent({
  division,
  isOpen,
}: {
  division: Division;
  isOpen: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-[-0.03em] text-ink sm:text-2xl">
          {division.name}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-[15px]">
          {division.description}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="rounded-[0.75rem] border border-line bg-surface-tint/80 p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
            <h4>Tugas &amp; Aktivitas</h4>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {division.responsibilities.map((task) => (
              <li key={task} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[0.75rem] border border-line bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" />
            <h4>Cocok Untuk Siapa</h4>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {division.idealFor}
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-line pt-5">
          <Link
            href={`/daftar?divisi=${encodeURIComponent(division.name)}`}
            className="bdca-button-primary inline-flex min-h-12 w-full items-center justify-center rounded-[0.6rem] px-6 text-sm font-bold sm:w-auto"
          >
            Daftar ke Divisi {division.name}
          </Link>
        </div>
      )}
    </div>
  );
}

export function DivisionExplorer() {
  const divisions = oprecConfig.divisions;
  const [activeId, setActiveId] = useState<string>(divisions[0]?.id ?? "");
  const isRegistrationActive = useRegistrationOpen();

  const activeDivision =
    divisions.find((division) => division.id === activeId) ?? divisions[0];

  return (
    <section
      id="divisi"
      className="bdca-defer-section scroll-mt-20 border-t border-line bg-surface/70 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
              Eksplorasi Divisi
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">
              Pilih divisi sesuai minat belajarmu.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Lihat fokus kerja dan aktivitas tiap divisi. Pemula tetap diterima.
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="mt-10 hidden md:block">
          <div
            role="tablist"
            aria-label="Daftar divisi BDCA"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {divisions.map((division) => {
              const isSelected = division.id === activeDivision?.id;
              return (
                <button
                  key={division.id}
                  role="tab"
                  type="button"
                  id={`tab-${division.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${division.id}`}
                  onClick={() => setActiveId(division.id)}
                  className={`flex min-h-16 cursor-pointer flex-col justify-center rounded-[0.75rem] border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-accent bg-night text-white"
                      : "border-line bg-surface text-ink hover:border-accent/60 hover:bg-surface-tint"
                  }`}
                >
                  <span className="text-sm font-bold leading-snug">
                    {division.name}
                  </span>
                  <span
                    className={`mt-1 line-clamp-1 text-xs ${
                      isSelected ? "text-[#c7dcfb]" : "text-muted"
                    }`}
                  >
                    {division.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {activeDivision && (
            <div
              role="tabpanel"
              id={`panel-${activeDivision.id}`}
              aria-labelledby={`tab-${activeDivision.id}`}
              className="mt-5 rounded-[0.95rem] border border-line bg-surface p-7 sm:p-8"
            >
              <DivisionDetailContent
                division={activeDivision}
                isOpen={isRegistrationActive}
              />
            </div>
          )}
        </div>

        {/* Mobile Accordion */}
        <div className="mt-8 space-y-3 md:hidden">
          {divisions.map((division) => {
            const isOpen = division.id === activeId;
            return (
              <div
                key={division.id}
                className="overflow-hidden rounded-[0.85rem] border border-line bg-surface"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`mobile-panel-${division.id}`}
                  onClick={() => setActiveId(isOpen ? "" : division.id)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors ${
                    isOpen ? "bg-night text-white" : "bg-surface text-ink"
                  }`}
                >
                  <div>
                    <span className="block text-sm font-bold leading-snug">
                      {division.name}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        isOpen ? "text-[#c7dcfb]" : "text-muted"
                      }`}
                    >
                      {division.tagline}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`mobile-panel-${division.id}`}
                    className="border-t border-line p-5"
                  >
                    <DivisionDetailContent
                      division={division}
                      isOpen={isRegistrationActive}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-[0.85rem] border border-line bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-accent">
              <Headphones className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted">
              Kendala pendaftaran? Hubungi panitia via WhatsApp.
            </p>
          </div>
          <a
            href={BDCA_LINKS.panitiaWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-[0.55rem] border border-line bg-surface-tint px-4 text-xs font-bold text-accent transition-colors hover:border-accent sm:text-sm"
          >
            Hubungi {BDCA_LINKS.panitiaWhatsappDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
