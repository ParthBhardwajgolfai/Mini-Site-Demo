import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { fmtToPar, cx } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { tournament, courseHoles, leaderboardEntries } from "@/data/boulder-classic";

type ScorecardMap = Record<string, number[]>;

function HoleCell({ strokes, par }: { strokes: number; par: number }) {
  const d = strokes - par;
  return (
    <span
      className={cx(
        "flex h-8 w-8 items-center justify-center font-mono text-sm tabular-nums md:h-9 md:w-9",
        d <= -2 && "rounded-full bg-gold text-ink font-semibold",
        d === -1 && "rounded-full border border-sprig text-sprig",
        d === 0 && "text-cream/80",
        d === 1 && "border border-cream/30 text-cream/60",
        d >= 2 && "bg-white/10 text-cream/50",
      )}
    >
      {strokes}
    </span>
  );
}

function CardGrid({
  card,
  holes,
  label,
}: {
  card: number[];
  holes: { hole: number; par: number; yards: number }[];
  label: string;
}) {
  const front = holes.slice(0, 9);
  const back = holes.slice(9, 18);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const played = card.length;
  const frontCard = card.slice(0, 9);
  const backCard = card.slice(9, played);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">{label}</p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/15">
              <th className="pb-3 pr-2 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">Hole</th>
              {holes.map((h) => (
                <th key={h.hole} className="pb-3 text-center font-mono text-[10px] uppercase tracking-widest text-cream/40">
                  {h.hole}
                </th>
              ))}
              <th className="pb-3 pl-2 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">Total</th>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-2.5 pr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">Par</td>
              {holes.map((h) => (
                <td key={h.hole} className="py-2.5 text-center font-mono text-xs tabular-nums text-cream/45">{h.par}</td>
              ))}
              <td className="py-2.5 pl-2 text-right font-mono text-xs tabular-nums text-cream/45">
                {sum(holes.map((h) => h.par))}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 pr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-soft">Score</td>
              {front.map((h, i) => (
                <td key={h.hole} className="py-3 text-center">
                  {i < played ? <HoleCell strokes={frontCard[i]} par={h.par} /> : <span className="font-mono text-sm text-cream/25">·</span>}
                </td>
              ))}
              {back.map((h, i) => (
                <td key={h.hole} className="py-3 text-center">
                  {i + 9 < played ? <HoleCell strokes={backCard[i]} par={h.par} /> : <span className="font-mono text-sm text-cream/25">·</span>}
                </td>
              ))}
              <td className="py-3 pl-2 text-right font-mono text-sm font-semibold tabular-nums text-cream">
                {played ? sum(card) : "—"}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
          <span>Out {played >= 9 ? sum(frontCard) : "—"}</span>
          <span>In {played > 9 ? sum(backCard) : "—"}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-gold" /> Eagle or better
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-sprig" /> Birdie
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border border-cream/30" /> Bogey
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Scores() {
  const entries = leaderboardEntries;
  const [sel, setSel] = useState<number | null>(null);
  const active = useMemo(
    () => entries.find((e) => e.id === sel) ?? entries[0],
    [entries, sel],
  );
  const [round, setRound] = useState<"r1" | "r2" | "r3" | "r4">("r4");

  const holes = courseHoles;
  const cards = (active?.scorecards ?? {}) as ScorecardMap;
  const t = tournament;

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="Hole by Hole"
        title={
          <>
            Scorecards<span className="text-gold">.</span>
          </>
        }
        meta={t && <><span>{t.course}</span><span>Par {t.par} · {t.yardage.toLocaleString()} yds</span></>}
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        {/* player strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {entries.map((e) => (
            <button
              key={e.id}
              onClick={() => setSel(e.id)}
              className={cx(
                "flex shrink-0 items-baseline gap-2.5 border px-4 py-3 transition-all duration-300",
                active?.id === e.id
                  ? "border-gold bg-gold/10 text-cream"
                  : "border-white/10 text-cream/55 hover:border-white/30 hover:text-cream",
              )}
            >
              <span className="font-mono text-[10px] tabular-nums text-gold">{e.position}</span>
              <span className="whitespace-nowrap font-serif text-base font-light">
                {e.player.lastName}
              </span>
              <span className="font-mono text-xs tabular-nums">{fmtToPar(e.total)}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              {/* player summary */}
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                    {active.position} · {active.player.country}
                  </p>
                  <h2 className="mt-2 font-serif text-4xl font-light text-cream md:text-6xl">
                    {active.player.firstName} {active.player.lastName}
                  </h2>
                </div>
                <div className="flex gap-8 md:gap-12">
                  {(["r1", "r2", "r3", "r4"] as const).map((r, i) => (
                    <button key={r} onClick={() => setRound(r)} className="text-left">
                      <p className={cx("font-mono text-[10px] uppercase tracking-[0.2em]", round === r ? "text-gold" : "text-cream/40")}>
                        Round {i + 1}
                      </p>
                      <p className={cx("mt-1 font-mono text-2xl font-light tabular-nums md:text-3xl", round === r ? "text-cream" : "text-cream/60")}>
                        {active[r] ?? (r === "r4" ? `${fmtToPar(active.today)} (${active.thru})` : "—")}
                      </p>
                    </button>
                  ))}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">Total</p>
                    <p className={cx("mt-1 font-mono text-2xl font-semibold tabular-nums md:text-3xl", active.total < 0 ? "text-sprig" : "text-cream")}>
                      {fmtToPar(active.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* selected round card */}
              <div className="mt-10">
                {holes.length === 18 && cards[round] ? (
                  <CardGrid
                    card={cards[round]}
                    holes={holes}
                    label={`Round ${round.slice(1)} · ${t?.course ?? ""}`}
                  />
                ) : (
                  <p className="font-mono text-sm text-cream/40">Scorecard unavailable.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {entries.length === 0 && <div className="mt-10 h-96 animate-pulse bg-white/5" />}
      </section>
    </main>
  );
}
