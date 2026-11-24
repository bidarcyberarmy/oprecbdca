import { oprecConfig } from "@/config/oprec.config";
import { getInitials } from "@/lib/format";

export function MembersSection() {
  return (
    <section id="pengurus" className="scroll-mt-20 border-t border-line py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
              Pengurus &amp; Anggota Aktif
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">
              Kenali struktur pengurus periode {oprecConfig.periodLabel}.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Pengurus inti dan koordinator divisi yang siap membimbing proses
            adaptasi, sesi belajar, dan kolaborasi proyek bagi anggota baru.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {oprecConfig.members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col overflow-hidden rounded-[0.9rem] border border-line bg-surface"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#e7f3fc] via-[#dce9fc] to-[#cfe3fa] px-4">
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt={`Foto ${member.name}`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-16 w-16 items-center justify-center rounded-[0.8rem] border border-white/70 bg-night text-lg font-bold tracking-tight text-white"
                  >
                    {getInitials(member.name)}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-[#1b3661] to-night px-4 py-4 text-white">
                <div>
                  <p className="text-base font-bold tracking-[-0.02em] leading-snug">
                    {member.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#d8e7fb]">
                    {member.role}
                  </p>
                </div>
                <p className="mt-3 border-t border-white/15 pt-2.5 text-[11px] font-semibold tracking-[0.04em] text-[#9fc2f5] uppercase">
                  {member.division}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
