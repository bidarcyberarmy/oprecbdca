"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { oprecConfig } from "@/config/oprec.config";
import { formatWibDateTime } from "@/lib/format";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { RegistrationRecord } from "@/lib/validation";

interface AdminDashboardClientProps {
  registrations: RegistrationRecord[];
  userEmail: string;
  loadError: string | null;
}

function buildWhatsappReminderUrl(record: RegistrationRecord): string {
  const message = `Halo ${record.full_name}, kami dari panitia Open Recruitment Bina Darma Cyber Army (BDCA). Terima kasih sudah mendaftar di divisi ${record.division}. Berikut informasi dan pengingat untuk tahap selanjutnya:`;
  return `https://wa.me/${record.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function AdminDashboardClient({
  registrations,
  userEmail,
  loadError,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");
  const [selectedRecord, setSelectedRecord] =
    useState<RegistrationRecord | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportExcel(records: RegistrationRecord[], filter: string) {
    setIsExporting(true);
    try {
      const { exportRegistrationsToExcel } = await import("@/lib/export");
      exportRegistrationsToExcel(records, filter);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportCsv(records: RegistrationRecord[], filter: string) {
    setIsExporting(true);
    try {
      const { exportRegistrationsToCsv } = await import("@/lib/export");
      exportRegistrationsToCsv(records, filter);
    } finally {
      setIsExporting(false);
    }
  }

  useEffect(() => {
    if (!selectedRecord) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedRecord(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRecord]);

  const divisionNames = useMemo(() => {
    const configured = oprecConfig.divisions.map((division) => division.name);
    const fromRecords = registrations.map((item) => item.division);
    return Array.from(new Set([...configured, ...fromRecords]));
  }, [registrations]);

  const divisionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const name of divisionNames) {
      counts.set(name, 0);
    }
    for (const item of registrations) {
      counts.set(item.division, (counts.get(item.division) ?? 0) + 1);
    }
    return divisionNames.map((name) => ({
      name,
      count: counts.get(name) ?? 0,
    }));
  }, [divisionNames, registrations]);

  const divisionFilteredRecords = useMemo(() => {
    if (divisionFilter === "ALL") return registrations;
    return registrations.filter((item) => item.division === divisionFilter);
  }, [registrations, divisionFilter]);

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return divisionFilteredRecords;

    return divisionFilteredRecords.filter(
      (item) =>
        item.full_name.toLowerCase().includes(query) ||
        item.nim.toLowerCase().includes(query)
    );
  }, [divisionFilteredRecords, searchQuery]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex min-h-16 max-w-[1360px] flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/bdca-emblem.webp"
              alt="Logo BDCA"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <div>
              <h1 className="text-base font-bold tracking-[-0.02em] text-ink">
                Dashboard Panitia Oprec BDCA
              </h1>
              <p className="text-xs text-muted">
                {oprecConfig.periodLabel} · {userEmail}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-[0.55rem] border border-line bg-paper px-3.5 text-xs font-semibold text-ink hover:border-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Muat Ulang</span>
            </button>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-[0.55rem] border border-line bg-paper px-3.5 text-xs font-semibold text-ink hover:border-accent"
            >
              <span>Halaman Publik</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-[0.55rem] border border-red-200 bg-red-50 px-3.5 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-5 py-8 sm:px-8">
        {loadError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-[0.75rem] border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-900"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              aria-hidden="true"
            />
            <span>{loadError}</span>
          </div>
        )}

        {/* Summary Metrics */}
        <section aria-label="Ringkasan statistik pendaftar">
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-[0.85rem] border border-accent/30 bg-night p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#c7dcfb]">
                  Total Pendaftar
                </p>
                <Users className="h-4 w-4 text-[#9fc2f5]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-3xl font-bold">
                {registrations.length}
              </p>
              <p className="mt-1 text-xs text-[#b7cceb]">
                Semua divisi tercatat
              </p>
            </div>

            {divisionCounts.map((item) => {
              const isActive = divisionFilter === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setDivisionFilter(isActive ? "ALL" : item.name)
                  }
                  className={`rounded-[0.85rem] border p-5 text-left transition-colors ${
                    isActive
                      ? "border-accent bg-surface-soft"
                      : "border-line bg-surface hover:border-accent/60"
                  }`}
                >
                  <p className="line-clamp-2 min-h-8 text-xs font-semibold text-muted">
                    {item.name}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-bold text-ink">
                    {item.count}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-accent">
                    {isActive ? "Filter aktif (klik reset)" : "Klik untuk filter"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Controls & Export Bar */}
        <section
          aria-label="Filter dan ekspor data"
          className="mt-7 rounded-[0.9rem] border border-line bg-surface p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 sm:max-w-sm">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Cari berdasarkan nama atau NIM"
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-[0.55rem] border border-line bg-paper py-2.5 pr-3.5 pl-10 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none"
                />
              </div>

              <select
                aria-label="Filter berdasarkan divisi"
                value={divisionFilter}
                onChange={(event) => setDivisionFilter(event.target.value)}
                className="rounded-[0.55rem] border border-line bg-paper px-3.5 py-2.5 text-sm font-medium text-ink focus:border-accent focus:bg-surface focus:outline-none"
              >
                <option value="ALL">
                  Semua Divisi ({registrations.length})
                </option>
                {divisionCounts.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} ({item.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={visibleRecords.length === 0 || isExporting}
                onClick={() => handleExportExcel(visibleRecords, divisionFilter)}
                className="bdca-button-primary inline-flex min-h-10 items-center gap-2 rounded-[0.55rem] px-4 text-xs font-bold sm:text-sm"
              >
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isExporting
                    ? "Menyiapkan..."
                    : `Export Excel (.xlsx)${
                        divisionFilter !== "ALL" || searchQuery.trim()
                          ? ` (${visibleRecords.length})`
                          : ""
                      }`}
                </span>
              </button>

              <button
                type="button"
                disabled={visibleRecords.length === 0 || isExporting}
                onClick={() => handleExportCsv(visibleRecords, divisionFilter)}
                className="inline-flex min-h-10 items-center gap-2 rounded-[0.55rem] border border-line bg-paper px-4 text-xs font-bold text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Export CSV</span>
              </button>

              {divisionFilter !== "ALL" && registrations.length > 0 && (
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExportExcel(registrations, "ALL")}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[0.55rem] border border-line bg-surface-tint px-3.5 text-xs font-semibold text-accent hover:border-accent disabled:opacity-50"
                >
                  <span>Export Semua ({registrations.length})</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Table */}
        <section aria-label="Tabel data pendaftar" className="mt-5">
          <div className="overflow-hidden rounded-[0.9rem] border border-line bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-tint text-xs font-bold text-muted">
                    <th className="px-4 py-3.5">Waktu Daftar (WIB)</th>
                    <th className="px-4 py-3.5">Nama Lengkap</th>
                    <th className="px-4 py-3.5">NIM</th>
                    <th className="px-4 py-3.5">Prodi &amp; Semester</th>
                    <th className="px-4 py-3.5">No. WhatsApp</th>
                    <th className="px-4 py-3.5">Divisi</th>
                    <th className="px-4 py-3.5">Alasan Bergabung</th>
                    <th className="px-4 py-3.5">Pengalaman</th>
                    <th className="px-4 py-3.5 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visibleRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-sm text-muted"
                      >
                        {registrations.length === 0
                          ? "Belum ada data pendaftar yang masuk. Data akan muncul otomatis setelah calon anggota mengisi formulir pendaftaran."
                          : "Tidak ada pendaftar yang cocok dengan kata kunci atau filter divisi saat ini."}
                      </td>
                    </tr>
                  ) : (
                    visibleRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="align-top transition-colors hover:bg-paper/70"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-muted">
                          {formatWibDateTime(record.created_at)}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-ink">
                          {record.full_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-ink">
                          {record.nim}
                        </td>
                        <td className="px-4 py-3.5 text-muted">
                          <div>{record.major}</div>
                          {record.semester && (
                            <div className="mt-0.5 text-xs text-muted/80">
                              {record.semester}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <a
                            href={buildWhatsappReminderUrl(record)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Kirim reminder via WhatsApp"
                            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline"
                          >
                            <span>{record.whatsapp}</span>
                            <ExternalLink
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </a>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded-[0.4rem] bg-surface-soft px-2.5 py-1 text-xs font-semibold text-ink">
                            {record.division}
                          </span>
                        </td>
                        <td className="max-w-[200px] px-4 py-3.5 text-xs text-muted">
                          <span className="line-clamp-2">
                            {record.reason?.trim() || "-"}
                          </span>
                        </td>
                        <td className="max-w-[180px] px-4 py-3.5 text-xs text-muted">
                          <span className="line-clamp-2">
                            {record.experience?.trim() || "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="inline-flex items-center gap-1 rounded-[0.45rem] border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Lihat</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/55 p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1rem] border border-line bg-surface p-6 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <h2
                  id="detail-modal-title"
                  className="text-xl font-bold tracking-[-0.02em] text-ink"
                >
                  {selectedRecord.full_name}
                </h2>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  NIM {selectedRecord.nim} ·{" "}
                  {formatWibDateTime(selectedRecord.created_at)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup detail pendaftar"
                onClick={() => setSelectedRecord(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[0.5rem] border border-line bg-paper text-ink hover:border-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Jurusan / Program Studi
                </dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {selectedRecord.major}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Semester</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {selectedRecord.semester || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Divisi Pilihan
                </dt>
                <dd className="mt-0.5 font-semibold text-accent">
                  {selectedRecord.division}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Nomor WhatsApp
                </dt>
                <dd className="mt-0.5">
                  <a
                    href={buildWhatsappReminderUrl(selectedRecord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-accent hover:underline"
                  >
                    <span>{selectedRecord.whatsapp}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4 border-t border-line pt-5">
              <div>
                <h3 className="text-xs font-bold tracking-[0.06em] text-muted uppercase">
                  Alasan Bergabung
                </h3>
                <p className="mt-1.5 whitespace-pre-wrap rounded-[0.65rem] border border-line bg-paper p-3.5 text-sm leading-relaxed text-ink">
                  {selectedRecord.reason?.trim() || "-"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.06em] text-muted uppercase">
                  Pengalaman
                </h3>
                <p className="mt-1.5 whitespace-pre-wrap rounded-[0.65rem] border border-line bg-paper p-3.5 text-sm leading-relaxed text-ink">
                  {selectedRecord.experience?.trim() || "-"}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-[0.06em] text-muted uppercase">
                  Riwayat Organisasi
                </h3>
                <p className="mt-1.5 whitespace-pre-wrap rounded-[0.65rem] border border-line bg-paper p-3.5 text-sm leading-relaxed text-ink">
                  {selectedRecord.organization?.trim() || "-"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="inline-flex min-h-10 items-center rounded-[0.55rem] border border-line bg-paper px-4 text-sm font-semibold text-ink hover:border-accent"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
