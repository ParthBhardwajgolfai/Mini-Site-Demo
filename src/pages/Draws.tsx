import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { cx } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { draws as allDraws } from "@/data/boulder-classic";

export default function Draws() {
  const rounds = useMemo(
    () => [...new Set(allDraws.map((d) => d.round))].sort((a, b) => b - a),
    [],
  );
  const [round, setRound] = useState<number | null>(null);
  const activeRound = round ?? rounds[0] ?? 4;
  const draws = allDraws.filter((d) => d.round === activeRound);
  const featureIdx = draws.length - 1; // leaders tee off last

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="Starting Times"
        title={
          <>
            The draw<span className="text-gold">.</span>
          </>
        }
        meta={<span>Official draw · All times local · Tees 1 &amp; 10</span>}
      />
      <section className="mx-auto max-w-[1100px] px-5 pb-28 md:px-10">
        <Reveal>
          <div className="flex gap-2">
            {rounds.map((r) => (
              <button
                key={r}
                onClick={() => setRound(r)}
                className={cx(
                  "border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300",
                  activeRound === r
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 text-cream/50 hover:border-white/30 hover:text-cream",
                )}
              >
                Round {r}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRound}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            {draws.map((d, i) => {
              const names = d.playerNames;
              const feature = i === featureIdx && activeRound === Math.max(...rounds);
              return (
                <Reveal key={d.id} delay={Math.min(i * 0.025, 0.35)}>
                  <div
                    className={cx(
                      "group grid grid-cols-[88px_1fr] items-center gap-5 border-b border-white/8 py-5 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-[120px_1fr_140px] md:gap-8",
                      feature && "bg-gold/[0.06]",
                    )}
                  >
                    <div className="pl-2">
                      <p className="font-mono text-xl font-light tabular-nums text-cream md:text-2xl">
                        {d.teeTime}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                        Tee {d.tee}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                      {names.map((n) => (
                        <span key={n} className="font-serif text-lg font-light text-cream/90 md:text-xl">
                          {n}
                        </span>
                      ))}
                    </div>
                    {feature && (
                      <p className="col-span-2 pl-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gold md:col-span-1 md:pl-0 md:text-right">
                        Feature group
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
