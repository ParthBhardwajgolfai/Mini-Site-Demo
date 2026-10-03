import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { fmtMoney } from "@/lib/format";
import { motion } from "framer-motion";
import { tournament, prizeMoneyRows } from "@/data/boulder-classic";

export default function PrizeMoney() {
  const t = tournament;
  const breakdown = prizeMoneyRows;
  const top = breakdown[0];

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
      />

      {/* winner's share hero */}
      {top && (
        <section className="border-b border-white/10 bg-pine/60">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-5 py-14 md:px-10 md:py-20">
            <Reveal>
              <p className="kicker">Winner's share</p>
              <p className="mt-4 font-serif text-6xl font-light text-cream md:text-8xl">
                {fmtMoney(top.amount, t.currency)}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                + counts toward the PGTI Order of Merit
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-xs text-sm leading-relaxed text-cream/55">
                The champion's cheque at Boulder Hills Golf Club — alongside the trophy and a
                place in PGTI history.
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="kicker">Full breakdown · {t.madeCut} finishers</p>
        </Reveal>
        <div className="mt-10">
          {breakdown.map((p, i) => {
            const width = top ? (p.amount / top.amount) * 100 : 0;
            return (
              <Reveal key={p.id} delay={Math.min(i * 0.02, 0.3)}>
                <div className="group relative grid grid-cols-[52px_1fr_auto] items-center gap-4 overflow-hidden border-b border-white/8 py-4 md:grid-cols-[64px_1fr_180px_120px] md:gap-8">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: `${width}%` }}
                    className="absolute left-0 top-0 h-full origin-left bg-gold/[0.07]"
                  />
                  <span className="relative pl-2 font-mono text-sm tabular-nums text-gold">
                    {p.tied ? `T${p.position}` : p.position}
                  </span>
                  <span className="relative h-px bg-white/10" />
                  <span className="relative pr-1 text-right font-mono text-sm font-semibold tabular-nums text-cream md:text-base">
                    {fmtMoney(p.amount, t.currency)}
                    {p.tied && (
                      <span className="mt-0.5 block font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-cream/40 md:hidden">
                        {p.sharedBy} sharing
                      </span>
                    )}
                  </span>
                  <span className="relative hidden text-right font-mono text-xs tabular-nums text-cream/45 md:block">
                    {p.tied ? `${p.sharedBy} sharing` : "—"}
                  </span>
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
