import { ArrowUpRight } from "lucide-react";
import { oprecConfig } from "@/config/oprec.config";

export function PortfolioSection() {
  return (
    <section
      id="portofolio"
      className="scroll-mt-20 border-t border-line bg-surface/60 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
              Portofolio &amp; Karya
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">
              Sistem, riset, dan kegiatan yang kami bangun bersama.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Setiap anggota didorong menghasilkan karya nyata — mulai dari
            aplikasi web, laboratorium keamanan siber, hingga edukasi terbuka di
            lingkungan kampus.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {oprecConfig.portfolios.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-[0.9rem] border border-line bg-surface-soft/75 p-6 sm:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <span className="rounded-[0.4rem] bg-surface px-2.5 py-1 text-accent">
                    {item.category}
                  </span>
                  <span className="font-mono text-muted">{item.year}</span>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                  {item.summary}
                </p>
              </div>

              {item.link && (
                <div className="mt-6 border-t border-line/80 pt-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline"
                  >
                    <span>Lihat referensi proyek</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
