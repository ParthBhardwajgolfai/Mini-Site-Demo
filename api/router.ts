import { createRouter, publicQuery } from "./middleware";
import {
  getTournamentInfo,
  getLeaderboard,
  getField,
  getDraws,
  getPrizeMoney,
  getPastResults,
  getGallery,
} from "./queries/tournament";

const tournament = createRouter({
  info: publicQuery.query(() => getTournamentInfo()),
  leaderboard: publicQuery.query(() => getLeaderboard()),
  field: publicQuery.query(() => getField()),
  draws: publicQuery.query(() => getDraws()),
  prizeMoney: publicQuery.query(() => getPrizeMoney()),
  results: publicQuery.query(() => getPastResults()),
  gallery: publicQuery.query(() => getGallery()),
});

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  tournament,
});

export type AppRouter = typeof appRouter;
