import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { tournament, pastResults } from "@/data/boulder-classic";

export default function Results() {
  const t = tournament;
  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="bg-ink">
        <PageHeader
          kicker="Honour Roll"
          title={
            <>
              The champions<span className="text-gold">.</span>
            </>
          }
          meta={<span>{t.name} · PGTI Tour</span>}
        />
      </div>
      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        {pastResults.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i * 0.05, 0.3)}>
            <div className="group grid grid-cols-[72px_1fr] items-baseline gap-5 border-b border-ink/10 py-8 transition-colors duration-300 md:grid-cols-[140px_1fr_160px_140px] md:gap-8 md:py-10">
              <p className="font-serif text-3xl font-light text-ink/35 transition-colors duration-300 group-hover:text-gold md:text-5xl">
                {r.year}
              </p>
              <div>
                <h3 className="font-serif text-2xl font-light leading-tight md:text-4xl">
                  {r.champion}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
                  {r.country}
                </p>
              </div>
              <p className="hidden font-mono text-xl tabular-nums text-fairway md:block">{r.score}</p>
              <div className="col-span-2 mt-2 md:col-span-1 md:mt-0 md:text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  Won by {r.margin}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/35">
                  Runners-up · {r.runnerUp}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.08em] text-ink/45">
            Official result · 72-hole stroke play at {t.course}, {t.location} ·{" "}
            {t.cutRule.replace(" after Round 2", " after 36 holes")}.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
