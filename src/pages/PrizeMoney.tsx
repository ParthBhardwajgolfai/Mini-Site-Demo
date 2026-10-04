import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { fmtMoney, fmtToPar } from "@/lib/format";
import { motion } from "framer-motion";
import {
  tournament,
  prizeMoneyRows,
  leaderboardEntries,
  type LeaderboardEntry,
} from "@/data/boulder-classic";

export default function PrizeMoney() {
  const t = tournament;
  const breakdown = prizeMoneyRows;
  const top = breakdown[0];

  // Map each finishing position to every player who earned it (ties included).
  const playersByPosition = useMemo(() => {
    const map = new Map<number, LeaderboardEntry[]>();
    for (const e of leaderboardEntries) {
      const pos = parseInt(e.position.replace("T", ""), 10);
      const list = map.get(pos);
      if (list) list.push(e);
      else map.set(pos, [e]);
    }
    return map;
  }, []);

  const champion = playersByPosition.get(1)?.[0];

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="The Purse"
        title={
          <>
            Prize money<span className="text-gold">.</span>
          </>
        }
        meta={<><span>Total fund {fmtMoney(t.prizeFund, t.currency)}</span><span>PGTI Order of Merit</span></>}
        image="/media/bc26-trophy-presentation.jpg"
        imageAlt="Shubhankar Sharma receives the Boulders Classic 2026 trophy"
        imageCaption="The champion with the Boulders Classic trophy"
      />

      {/* winner's share hero */}
      {top && (
        <section className="border-b border-white/10 bg-pine/60">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 md:grid-cols-2 md:px-10 md:py-20">
            <Reveal>
              <p className="kicker">Winner's share</p>
              <p className="mt-4 font-serif text-6xl font-light text-cream md:text-7xl">
                {fmtMoney(top.amount, t.currency)}
              </p>
              {champion && (
                <p className="mt-4 font-serif text-2xl font-light text-gold-soft md:text-3xl">
                  {champion.player.firstName} {champion.player.lastName}
                  <span className="ml-4 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50">
                    {champion.strokes} strokes · {fmtToPar(champion.total)}
                  </span>
                </p>
              )}
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                + counts toward the PGTI Order of Merit
              </p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/55">
                The champion's cheque, presented at Boulder Hills on April 17 alongside
                the trophy — ₹15,00,000 to Shubhankar Sharma for a 25-under-par week.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <figure>
                <div className="border border-white/10 bg-pine/40 p-2">
                  <img
                    src="/media/bc26-winner-cheque.png"
                    alt="Official PGTI result card: Shubhankar Sharma, position 1, 263 strokes, 25 under par, ₹15,00,000"
                    className="w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                  <span>Official PGTI result · Round 4, April 17</span>
                  <span className="text-gold/70">pgtofindia.com</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="kicker">Full breakdown · {t.madeCut} finishers</p>
        </Reveal>
        <div className="mt-10">
          <div className="grid grid-cols-[44px_1fr_auto] gap-x-4 border-b border-white/15 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40 md:grid-cols-[64px_1fr_190px] md:gap-x-8">
            <span className="pl-2">Pos</span>
            <span>Players</span>
            <span className="pr-1 text-right">Prize</span>
          </div>
          {breakdown.map((p, i) => {
            const width = top ? (p.amount / top.amount) * 100 : 0;
            const players = playersByPosition.get(parseInt(p.position, 10)) ?? [];
            return (
              <Reveal key={p.id} delay={Math.min(i * 0.02, 0.3)}>
                <div className="group relative overflow-hidden border-b border-white/8 py-4">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: `${width}%` }}
                    className="absolute left-0 top-0 h-full origin-left bg-gold/[0.07]"
                  />
                  <div className="relative grid grid-cols-[44px_1fr_auto] items-baseline gap-x-4 md:grid-cols-[64px_1fr_190px] md:gap-x-8">
                    <span className="pl-2 font-mono text-sm tabular-nums text-gold">
                      {p.tied ? `T${p.position}` : p.position}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-light leading-snug text-cream/90 md:text-lg">
                        {players.length
                          ? players
                              .map((e) => `${e.player.firstName} ${e.player.lastName}`)
                              .join(" · ")
                          : "—"}
                      </p>
                      {p.tied && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                          Split {p.sharedBy} ways · {fmtMoney(p.amount, t.currency)} each
                        </p>
                      )}
                    </div>
                    <span className="pr-1 text-right font-mono text-sm font-semibold tabular-nums text-cream md:text-base">
                      {fmtMoney(p.amount, t.currency)}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.15}>
          <p className="mt-10 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-cream/40">
            Official purse of {fmtMoney(t.prizeFund, t.currency)}, distributed on the PGTI prize
            ladder to every player who made the cut — {t.cutRule}. In the event of ties, prize
            money for the relevant positions is combined and divided equally.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
