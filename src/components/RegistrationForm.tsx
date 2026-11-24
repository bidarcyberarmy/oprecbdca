"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Headphones,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import {
  BDCA_LINKS,
  SEMESTER_OPTIONS,
  UBD_MAJOR_GROUPS,
  oprecConfig,
  type Division,
} from "@/config/oprec.config";
import { useRegistrationOpen } from "@/lib/use-registration-open";

interface RegistrationFormProps {
  initialDivision?: string;
}

interface SubmittedResult {
  id: string;
  full_name: string;
  nim: string;
  major: string;
  semester: string;
  whatsapp: string;
  division: string;
  created_at: string;
}

function HelpContactCard({ className = "" }: { className?: string }) {
  return (
    <a
      href={BDCA_LINKS.panitiaWhatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3.5 rounded-[1rem] border border-line/90 bg-surface p-4 shadow-[0_8px_24px_-14px_rgba(16,27,49,0.12)] transition-colors hover:border-accent ${className}`}
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-accent">
        <Headphones className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">Kendala?</span>
        <span className="mt-0.5 block text-xs font-semibold text-accent group-hover:underline">
          WA {BDCA_LINKS.panitiaWhatsappDisplay}
        </span>
      </span>
    </a>
  );
}

export function RegistrationForm({
  initialDivision = "",
}: RegistrationFormProps) {
  const isOpen = useRegistrationOpen();
  const [selectedDivision, setSelectedDivision] =
    useState<string>(initialDivision);
  const [fullName, setFullName] = useState("");
  const [nim, setNim] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [customMajor, setCustomMajor] = useState("");
  const [semester, setSemester] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState("");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [organization, setOrganization] = useState("");
  const [website, setWebsite] = useState(""); // honeypot field

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submittedResult, setSubmittedResult] =
    useState<SubmittedResult | null>(null);
  const [infoDivision, setInfoDivision] = useState<Division | null>(null);

  useEffect(() => {
    if (initialDivision) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("divisi");
    if (
      requested &&
      oprecConfig.divisions.some((division) => division.name === requested)
    ) {
      setSelectedDivision(requested);
    }
  }, [initialDivision]);

  useEffect(() => {
    if (!submittedResult && !infoDivision) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSubmittedResult(null);
        setInfoDivision(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submittedResult, infoDivision]);

  function resetFormFields() {
    setFullName("");
    setNim("");
    setSelectedMajor("");
    setCustomMajor("");
    setSemester("");
    setWhatsapp("");
    setReason("");
    setExperience("");
    setOrganization("");
    setSelectedDivision("");
  }

  if (!isOpen) {
    return (
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-8">
          <div className="rounded-[1.1rem] border border-line bg-surface p-7 sm:p-9">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-[0.6rem] bg-surface-soft text-accent">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink">
              Pendaftaran {oprecConfig.periodLabel} Ditutup
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {oprecConfig.closedMessage}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BDCA_LINKS.panitiaWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bdca-button-primary inline-flex min-h-11 items-center gap-2 rounded-[0.6rem] px-5 text-sm font-bold"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp Panitia</span>
              </a>
              <a
                href={BDCA_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-[0.6rem] border border-line bg-surface-tint px-5 text-sm font-semibold text-ink hover:border-accent"
              >
                <span>@bidarcyberarmy</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const resolvedMajor =
      selectedMajor === "Lainnya" ? customMajor.trim() : selectedMajor;

    if (!resolvedMajor) {
      setErrorMessage("Mohon pilih atau isi Jurusan / Prodi.");
      setFieldErrors({ major: ["Jurusan / Prodi wajib diisi."] });
      return;
    }

    if (!semester) {
      setErrorMessage("Mohon pilih semester Anda saat ini.");
      setFieldErrors({ semester: ["Semester wajib dipilih."] });
      return;
    }

    if (!selectedDivision) {
      setErrorMessage("Mohon pilih salah satu divisi tujuan.");
      setFieldErrors({ division: ["Pilihan divisi wajib dipilih."] });
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          full_name: fullName,
          nim,
          major: resolvedMajor,
          semester,
          whatsapp,
          division: selectedDivision,
          reason,
          experience,
          organization,
          website,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(
          payload.error || "Pendaftaran belum berhasil. Silakan periksa data Anda."
        );
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        return;
      }

      setSubmittedResult(payload.data as SubmittedResult);
      resetFormFields();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage(
          "Permintaan terlalu lama karena jaringan sedang lambat. Silakan coba kirim ulang."
        );
      } else {
        setErrorMessage(
          "Koneksi ke server terganggu. Periksa jaringan internet Anda lalu coba kirim ulang."
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-[1220px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(230px,270px)_minmax(0,1fr)] lg:items-start lg:gap-12">
          {/* Left Column (Compact intro on mobile, Sticky sidebar on desktop) */}
          <aside className="lg:sticky lg:top-10 lg:pt-4">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink leading-[1.12] sm:text-4xl">
              Formulir
              <br className="hidden lg:inline" /> Pendaftaran
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Tutup{" "}
              <strong className="font-semibold text-ink">
                {oprecConfig.registrationDeadline}
              </strong>
            </p>

            <div
              aria-hidden="true"
              className="mt-6 hidden h-[2.5px] w-12 rounded-full bg-accent/70 lg:block"
            />

            {/* Desktop Help Card */}
            <HelpContactCard className="mt-7 hidden lg:flex" />
          </aside>

          {/* Right Column: Spacious Form Card */}
          <div>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[1.25rem] border border-line/90 bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(16,27,49,0.09)] sm:p-8 lg:p-10"
            >
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-[0.7rem] border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-900"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                    aria-hidden="true"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                {/* Row 1: Identitas Dasar */}
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block text-sm font-semibold text-ink"
                    >
                      Nama Lengkap <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder="Nama lengkap"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                    />
                    {fieldErrors.full_name?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.full_name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="nim"
                      className="block text-sm font-semibold text-ink"
                    >
                      NIM <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="nim"
                      name="nim"
                      type="text"
                      inputMode="numeric"
                      enterKeyHint="next"
                      required
                      placeholder="8–12 digit NIM"
                      value={nim}
                      onChange={(event) =>
                        setNim(event.target.value.replace(/[^\d\s]/g, ""))
                      }
                      className="mt-2 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 font-mono text-base text-ink placeholder:font-sans placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                    />
                    {fieldErrors.nim?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.nim[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-sm font-semibold text-ink"
                    >
                      Nomor WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      required
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 font-mono text-base text-ink placeholder:font-sans placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                    />
                    {fieldErrors.whatsapp?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.whatsapp[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Akademik */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="major"
                      className="block text-sm font-semibold text-ink"
                    >
                      Jurusan / Prodi <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="major"
                      name="major"
                      required
                      value={selectedMajor}
                      onChange={(event) => setSelectedMajor(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base text-ink focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                    >
                      <option value="">Pilih jurusan / prodi</option>
                      {UBD_MAJOR_GROUPS.map((group) => (
                        <optgroup key={group.faculty} label={group.faculty}>
                          {group.majors.map((major) => (
                            <option key={major} value={major}>
                              {major}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Lainnya">Lainnya</option>
                    </select>

                    {selectedMajor === "Lainnya" && (
                      <input
                        type="text"
                        required
                        aria-label="Tuliskan nama Jurusan atau Prodi"
                        placeholder="Nama jurusan / prodi"
                        value={customMajor}
                        onChange={(event) => setCustomMajor(event.target.value)}
                        className="mt-2.5 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                      />
                    )}
                    {fieldErrors.major?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.major[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="semester"
                      className="block text-sm font-semibold text-ink"
                    >
                      Semester <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      required
                      value={semester}
                      onChange={(event) => setSemester(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base text-ink focus:border-accent focus:bg-surface focus:outline-none sm:min-h-11 sm:text-sm"
                    >
                      <option value="">Pilih semester</option>
                      {SEMESTER_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.semester?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.semester[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Divisi */}
                <fieldset>
                  <legend className="block text-sm font-semibold text-ink">
                    Pilihan Divisi <span className="text-red-600">*</span>
                  </legend>
                  <div className="mt-2.5 grid gap-3.5 sm:grid-cols-2">
                    {oprecConfig.divisions.map((division) => {
                      const isChecked = selectedDivision === division.name;
                      return (
                        <div
                          key={division.id}
                          className={`flex min-h-14 items-center justify-between gap-2.5 rounded-[0.7rem] border px-4 py-2.5 transition-colors ${
                            isChecked
                              ? "border-accent bg-surface-soft/85"
                              : "border-line bg-paper hover:border-accent/50"
                          }`}
                        >
                          <label className="flex min-h-10 flex-1 cursor-pointer items-center gap-3">
                            <input
                              type="radio"
                              name="division"
                              value={division.name}
                              checked={isChecked}
                              onChange={() =>
                                setSelectedDivision(division.name)
                              }
                              className="h-4 w-4 shrink-0 accent-[#164fc2]"
                            />
                            <span className="text-sm font-semibold leading-snug text-ink">
                              {division.name}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setInfoDivision(division)}
                            aria-label={`Lihat informasi divisi ${division.name}`}
                            title="Lihat info divisi"
                            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[0.5rem] text-muted transition-colors hover:bg-surface hover:text-accent active:bg-surface"
                          >
                            <Info className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {fieldErrors.division?.[0] && (
                    <p className="mt-1.5 text-xs font-medium text-red-700">
                      {fieldErrors.division[0]}
                    </p>
                  )}
                </fieldset>

                {/* Row 4: Alasan + Opsional berdampingan */}
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="reason"
                      className="block text-sm font-semibold text-ink"
                    >
                      Alasan Bergabung <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows={3}
                      required
                      placeholder="Kenapa ingin gabung BDCA?"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      className="mt-2 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:text-sm"
                    />
                    {fieldErrors.reason?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.reason[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-semibold text-ink"
                    >
                      Pengalaman{" "}
                      <span className="font-normal text-muted">(Opsional)</span>
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      placeholder="Proyek, lomba, atau minat"
                      value={experience}
                      onChange={(event) => setExperience(event.target.value)}
                      className="mt-2 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:text-sm"
                    />
                    {fieldErrors.experience?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.experience[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="organization"
                      className="block text-sm font-semibold text-ink"
                    >
                      Organisasi{" "}
                      <span className="font-normal text-muted">(Opsional)</span>
                    </label>
                    <textarea
                      id="organization"
                      name="organization"
                      rows={3}
                      placeholder="Organisasi / komunitas"
                      value={organization}
                      onChange={(event) => setOrganization(event.target.value)}
                      className="mt-2 w-full rounded-[0.6rem] border border-line bg-paper px-3.5 py-2.5 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none sm:text-sm"
                    />
                    {fieldErrors.organization?.[0] && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {fieldErrors.organization[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-line/80 pt-6 sm:flex-row sm:items-center">
                  <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted sm:justify-start">
                    <Info
                      className="h-3.5 w-3.5 shrink-0 text-muted"
                      aria-hidden="true"
                    />
                    <span>Data digunakan khusus untuk proses seleksi BDCA.</span>
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bdca-button-primary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[0.65rem] px-7 text-sm font-bold sm:min-h-11 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>Kirim Pendaftaran</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile Help Card (below form so users see inputs immediately on phones) */}
            <HelpContactCard className="mt-5 lg:hidden" />
          </div>
        </div>
      </div>

      {/* Division Info Pop-up Modal (Bottom Sheet on Mobile) */}
      {infoDivision && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="division-info-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-night/60 sm:items-center sm:p-4"
          onClick={() => setInfoDivision(null)}
        >
          <div
            className="pb-safe max-h-[88dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.25rem] border border-line bg-surface p-6 shadow-xl sm:max-w-lg sm:rounded-[1rem] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-accent uppercase">
                  Info Divisi
                </p>
                <h3
                  id="division-info-title"
                  className="mt-1 text-xl font-bold tracking-[-0.02em] text-ink"
                >
                  {infoDivision.name}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup info divisi"
                onClick={() => setInfoDivision(null)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[0.5rem] border border-line bg-paper text-ink hover:border-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {infoDivision.description}
            </p>

            <div className="mt-5">
              <h4 className="text-xs font-bold tracking-[0.08em] text-ink uppercase">
                Tugas &amp; Aktivitas
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-muted">
                {infoDivision.responsibilities.map((task) => (
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

            <div className="mt-5 rounded-[0.7rem] border border-line bg-surface-tint p-4">
              <h4 className="text-xs font-bold tracking-[0.08em] text-ink uppercase">
                Cocok Untuk Siapa
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {infoDivision.idealFor}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setInfoDivision(null)}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-[0.55rem] border border-line bg-paper px-4 text-sm font-semibold text-ink hover:border-accent"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDivision(infoDivision.name);
                  setInfoDivision(null);
                }}
                className="bdca-button-primary inline-flex min-h-11 cursor-pointer items-center rounded-[0.55rem] px-5 text-sm font-bold"
              >
                Pilih Divisi Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Pop-up Modal (Bottom Sheet on Mobile) */}
      {submittedResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-success-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-night/60 sm:items-center sm:p-4"
          onClick={() => setSubmittedResult(null)}
        >
          <div
            className="pb-safe max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.25rem] border border-line bg-surface p-6 shadow-xl sm:max-w-lg sm:rounded-[1rem] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-[0.45rem] bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Pendaftaran Berhasil</span>
              </div>
              <button
                type="button"
                aria-label="Tutup pop-up konfirmasi"
                onClick={() => setSubmittedResult(null)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[0.5rem] border border-line bg-paper text-ink hover:border-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3
              id="registration-success-title"
              className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink"
            >
              Terima kasih, {submittedResult.full_name}!
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pendaftaranmu sudah kami terima. Panitia BDCA akan menghubungimu
              via WhatsApp di{" "}
              <span className="font-mono font-semibold text-ink">
                {submittedResult.whatsapp}
              </span>{" "}
              untuk pengingat dan info tahap selanjutnya.
            </p>

            <dl className="mt-5 grid gap-3 rounded-[0.75rem] border border-line bg-surface-tint p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-muted">Nama</dt>
                <dd className="mt-0.5 font-bold text-ink">
                  {submittedResult.full_name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">NIM</dt>
                <dd className="mt-0.5 font-mono font-bold text-ink">
                  {submittedResult.nim}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Prodi / Semester
                </dt>
                <dd className="mt-0.5 font-bold text-ink">
                  {submittedResult.major} ({submittedResult.semester})
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Divisi</dt>
                <dd className="mt-0.5 font-bold text-accent">
                  {submittedResult.division}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSubmittedResult(null)}
                className="bdca-button-primary inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[0.6rem] px-6 text-sm font-bold sm:w-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
