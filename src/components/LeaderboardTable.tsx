import { fmtToPar, cx } from "@/lib/format";
import { motion } from "framer-motion";

export interface LeaderboardEntry {
  id: number;
  position: string;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  thru: number;
  today: number | null;
  total: number;
  strokes: number;
  status: string;
  player: {
    firstName: string;
    lastName: string;
    country: string;
    countryCode: string;
  };
}

function TotalCell({ value, big }: { value: number; big?: boolean }) {
  return (
    <span
      className={cx(
        "font-mono font-semibold tabular-nums",
        big ? "text-lg md:text-xl" : "text-base",
        value < 0 ? "text-sprig" : value > 0 ? "text-cream/50" : "text-cream/80",
      )}
    >
      {fmtToPar(value)}
    </span>
  );
}

function RoundCell({ value }: { value: number | null }) {
  return (
    <span className="font-mono text-sm tabular-nums text-cream/60">
      {value === null ? "—" : value}
    </span>
  );
}

export default function LeaderboardTable({
  entries,
  limit,
  live = true,
}: {
  entries: LeaderboardEntry[];
  limit?: number;
  live?: boolean;
}) {
  const rows = limit ? entries.slice(0, limit) : entries;
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full md:min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-white/15 text-left">
            <th className="py-4 pr-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40">Pos</th>
            <th className="py-4 pr-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40">Player</th>
            <th className="hidden py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40 md:table-cell">R1</th>
            <th className="hidden py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40 md:table-cell">R2</th>
            <th className="hidden py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40 md:table-cell">R3</th>
            <th className="py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40 hidden sm:table-cell">R4</th>
            <th className="py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40 hidden sm:table-cell">Thru</th>
            <th className="py-4 pr-3 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40">Today</th>
            <th className="py-4 text-right font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e, i) => {
            const posNum = parseInt(e.position.replace("T", ""), 10);
            const isLeader = posNum === 1;
            const isTop3 = posNum <= 3;
            return (
              <motion.tr
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.5), ease: [0.22, 1, 0.36, 1] }}
                className={cx(
                  "group border-b border-white/8 transition-colors duration-300 hover:bg-white/[0.04]",
                  isLeader && "bg-gold/[0.07]",
                )}
              >
                <td className="relative py-4 pr-4 md:py-5">
                  {isLeader && <span className="absolute left-0 top-0 h-full w-[2px] bg-gold" />}
                  <span
                    className={cx(
                      "pl-2 font-mono text-sm tabular-nums",
                      isTop3 ? "text-gold" : "text-cream/50",
                    )}
                  >
                    {e.position}
                  </span>
                </td>
                <td className="py-4 pr-4 md:py-5">
                  <div className="flex items-baseline gap-3">
                    <span
                      className={cx(
                        "font-serif text-lg font-light tracking-tight md:text-xl",
                        isLeader ? "text-cream" : "text-cream/90",
                      )}
                    >
                      {e.player.firstName} {e.player.lastName}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                      {e.player.countryCode}
                    </span>
                  </div>
                </td>
                <td className="hidden py-4 pr-3 text-center md:table-cell"><RoundCell value={e.r1} /></td>
                <td className="hidden py-4 pr-3 text-center md:table-cell"><RoundCell value={e.r2} /></td>
                <td className="hidden py-4 pr-3 text-center md:table-cell"><RoundCell value={e.r3} /></td>
                <td className="hidden py-4 pr-3 text-center sm:table-cell">
                  {e.r4 !== null ? (
                    <RoundCell value={e.r4} />
                  ) : (
                    <span className="font-mono text-sm tabular-nums text-gold">
                      {fmtToPar(e.today)}
                    </span>
                  )}
                </td>
                <td className="hidden py-4 pr-3 text-center sm:table-cell">
                  <span className="font-mono text-xs tabular-nums text-cream/50">
                    {e.thru === 18 ? "F" : e.thru}
                  </span>
                </td>
                <td className="py-4 pr-3 text-center">
                  <span
                    className={cx(
                      "font-mono text-sm tabular-nums",
                      (e.today ?? 0) < 0 ? "text-sprig" : (e.today ?? 0) > 0 ? "text-cream/50" : "text-cream/60",
                    )}
                  >
                    {fmtToPar(e.today)}
                  </span>
                </td>
                <td className="py-4 text-right md:py-5">
                  <TotalCell value={e.total} big={isTop3} />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      {live ? (
        <div className="mt-5 flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-sprig animate-pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40">
            Live scoring · Round 4 in progress
          </span>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40">
            Official final result · 72 holes complete
          </span>
        </div>
      )}
    </div>
  );
}
