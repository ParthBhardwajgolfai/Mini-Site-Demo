import { Link } from "react-router";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { cx, fmtMoney, fmtToPar } from "@/lib/format";
import { motion } from "framer-motion";
import {
  tournament,
  fieldPlayers,
  leaderboardEntries,
  pastResults,
  prizeMoneyRows,
} from "@/data/boulder-classic";

const STATUS_STYLES: Record<string, string> = {
  "Made Cut": "text-sprig",
  "Missed Cut": "text-ink/35",
  Retired: "text-ink/35",
};

export default function Field() {
  const t = tournament;
  const champion = leaderboardEntries[0];
  const result = pastResults[0];
  const prizeTop = prizeMoneyRows[0]?.amount ?? 0;
  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="bg-ink">
        <PageHeader
          kicker={`${t.fieldSize} Players · PGTI Tour`}
          title={
            <>
              The 132<span className="text-gold">.</span>
            </>
          }
          meta={<><span>{t.course}, {t.location}</span><span>{t.edition}</span></>}
        />
      </div>
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="max-w-xl text-base leading-relaxed text-ink/60">
            Order of Merit leaders, past PGTI winners and Qualifying School graduates — 132
            professionals earned their place in the field at Boulder Hills.
          </p>
        </Reveal>

        {champion && result && (
          <Reveal delay={0.05}>
            <div className="mt-12 grid gap-8 border border-ink/10 bg-bone p-6 md:grid-cols-[300px_1fr] md:gap-12 md:p-10">
              <img
                src="/media/bc26-champion-portrait.jpg"
                alt={`${champion.player.firstName} ${champion.player.lastName}, champion of the Boulders Classic ${t.edition}`}
                className="aspect-square w-full border border-ink/10 object-cover object-top"
                loading="lazy"
              />
              <div className="flex flex-col justify-center">
                <p className="font-mono text-[11px] uppercase tracking-mega text-gold">
                  The Champion
                </p>
                <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">
                  {champion.player.firstName} {champion.player.lastName}
                </h2>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/50">
                  {champion.player.country} · {champion.strokes} strokes ·{" "}
                  {fmtToPar(champion.total)} · won by {result.margin}
                </p>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/65">
                  Rounds of {champion.r1} · {champion.r2} · {champion.r3} · {champion.r4} carried{" "}
                  {champion.player.lastName} clear of the field at Boulder Hills — the {t.edition}{" "}
                  title worth {fmtMoney(prizeTop, t.currency)} and a place in PGTI history.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  Runners-up · {result.runnerUp}
                </p>
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                  <Link
                    to="/scores"
                    className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fairway transition-colors hover:text-gold"
                  >
                    View the scorecard
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                  <Link
                    to="/prize-money"
                    className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fairway transition-colors hover:text-gold"
                  >
                    Prize money
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {fieldPlayers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-4% 0px" }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.02, 0.4), ease: [0.22, 1, 0.36, 1] }}
              className="group bg-cream p-6 transition-colors duration-500 hover:bg-bone md:p-7"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  {p.code}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  {p.countryCode}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl font-light leading-tight transition-colors duration-300 group-hover:text-fairway">
                {p.firstName}
                <br />
                {p.lastName}
              </h3>
              <div className="mt-6 space-y-1.5 border-t border-ink/10 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
                <p>
                  {p.country}
                  {p.city ? ` · ${p.city}` : ""}
                  {p.age !== null ? ` · ${p.age}` : ""}
                </p>
                <p className="text-gold">{p.entryType}</p>
                <p className={cx("uppercase", STATUS_STYLES[p.status] ?? "text-ink/35")}>
                  {p.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
