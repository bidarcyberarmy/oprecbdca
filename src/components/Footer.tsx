import Image from "next/image";
import Link from "next/link";
import { BDCA_LINKS } from "@/config/oprec.config";

export function Footer() {
  return (
    <footer className="bdca-defer-section border-t border-line bg-paper py-12">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <a
            href={BDCA_LINKS.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src="/assets/bdca-logo-full.webp"
              alt="Bina Darma Cyber Army"
              width={210}
              height={95}
              sizes="160px"
              className="h-auto w-40 object-contain"
            />
          </a>
          <p className="mt-3 text-sm text-muted">
            Universitas Bina Darma — Palembang, Indonesia
          </p>
          <p className="mt-1 text-xs text-muted">
            Portal Open Recruitment resmi Bina Darma Cyber Army.
          </p>
        </div>

        <nav aria-label="Navigasi halaman" className="flex flex-col text-sm">
          <h2 className="mb-2 text-xs font-bold tracking-[0.1em] text-ink uppercase">
            Halaman Ini
          </h2>
          <a
            href="#tentang"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            Tentang BDCA
          </a>
          <a
            href="#divisi"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            Eksplorasi Divisi
          </a>
          <Link
            href="/daftar"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            Formulir Pendaftaran
          </Link>
        </nav>

        <nav aria-label="Tautan resmi BDCA" className="flex flex-col text-sm">
          <h2 className="mb-2 text-xs font-bold tracking-[0.1em] text-ink uppercase">
            Ekosistem BDCA
          </h2>
          <a
            href={BDCA_LINKS.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            Situs Utama (bidarcyberarmy.org)
          </a>
          <a
            href={BDCA_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            Instagram
          </a>
          <a
            href={BDCA_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted hover:text-accent sm:min-h-9"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
