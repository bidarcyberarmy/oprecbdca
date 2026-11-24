import { oprecConfig } from "@/config/oprec.config";

export function AboutSection() {
  return (
    <section id="tentang" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
              Tentang BDCA
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl lg:leading-[1.1]">
              {oprecConfig.about.headline}
            </h2>
          </div>

          <div className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              {oprecConfig.about.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Berdiri sejak 2009",
                "Lintas Program Studi",
                "Belajar dari Fundamental",
                "Berbasis Proyek & Riset",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-[0.45rem] border border-line bg-surface-tint px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-12 grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {oprecConfig.about.pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className="border-b border-line py-7 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span className="font-mono text-xs font-bold text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]">
                {pillar.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
