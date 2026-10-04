import { Link } from "react-router";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { fmtMoney, fmtToPar } from "@/lib/format";
import {
  tournament,
  pastResults,
  leaderboardEntries,
  prizeMoneyRows,
} from "@/data/boulder-classic";

/** 2026 champion spotlight — solo portrait + winning line, above the honour roll. */
function ChampionSpotlight() {
  const t = tournament;
  const champion = leaderboardEntries.find((e) => e.position === "1");
  const result = pastResults[0];
  const winnerShare = prizeMoneyRows[0];
  if (!champion || !result || !winnerShare) return null;

  const rounds = [champion.r1, champion.r2, champion.r3, champion.r4]
    .filter((r): r is number => r !== null)
    .join(" · ");
  const name = `${champion.player.firstName} ${champion.player.lastName}`;

  return (
    <Reveal>
      <div className="grid gap-8 border border-ink/10 bg-bone p-5 md:grid-cols-[280px_1fr] md:gap-12 md:p-10">
        <figure className="border border-ink/10 bg-white">
          <img
            src="/media/bc26-champion-portrait.jpg"
            alt={`${name}, the ${t.edition} Boulders Classic champion`}
            className="aspect-[4/5] w-full object-cover object-top"
            loading="eager"
          />
        </figure>
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[10px] uppercase tracking-mega text-gold md:text-[11px]">
            The champion
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-ink md:text-6xl">
            {name}
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50 md:text-[11px]">
            {champion.player.country} · {champion.strokes} strokes · {fmtToPar(champion.total)} ·
            won by {result.margin}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/70 md:text-[15px]">
            Rounds of {rounds} carried {champion.player.lastName} clear of the field at{" "}
            {t.course} — the {t.edition} title worth {fmtMoney(winnerShare.amount, t.currency)} and
            a place in PGTI history.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Runners-up · {result.runnerUp}
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              to="/scores"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-ink transition-colors duration-300 hover:text-gold"
            >
              View the scorecard
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/prize-money"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-ink transition-colors duration-300 hover:text-gold"
            >
              Prize money
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

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
        <ChampionSpotlight />
        <div className="mt-16 md:mt-20">
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
        </div>
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
