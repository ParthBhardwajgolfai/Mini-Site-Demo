import PageHeader from "@/components/PageHeader";
import LeaderboardTable from "@/components/LeaderboardTable";
import { Reveal } from "@/components/Reveal";
import { fmtDateRange } from "@/lib/format";
import { tournament, leaderboardEntries } from "@/data/boulder-classic";

export default function Leaderboard() {
  const t = tournament;
  return (
    <main className="bg-ink">
      <PageHeader
        kicker={`${t.name} · ${t.edition}`}
        title={
          <>
            Leaderboard<span className="text-gold">.</span>
          </>
        }
        meta={
          <>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Final · Round {t.currentRound}
            </span>
            <span>{t.course}</span>
            <span>{fmtDateRange(t.startDate, t.endDate)}</span>
            <span>Par {t.par}</span>
          </>
        }
        image="/media/bc26-rd1-drive.jpg"
        imageAlt="Round 1 tee shot on the 1st hole at Boulder Hills Golf Club"
        imageCaption="Round 1 · 1st tee, Boulder Hills"
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-4 md:px-10 md:pb-32">
        <Reveal>
          <LeaderboardTable entries={leaderboardEntries} live={false} />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.08em] text-cream/40">
            Positions shown to par. F denotes a finished round. Ties share position.{" "}
            {t.cutRule} — {t.madeCut} players advanced; the 36-hole totals of missed-cut
            players are not ranked.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
