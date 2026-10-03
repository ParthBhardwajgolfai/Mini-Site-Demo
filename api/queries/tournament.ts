import { desc, asc, eq } from "drizzle-orm";
import { getDb } from "./connection";
import {
  tournaments,
  players,
  scores,
  teeTimes,
  holes,
  prizeMoney,
  pastResults,
  galleryItems,
} from "../../db/schema";

async function currentTournament() {
  const db = getDb();
  const rows = await db.select().from(tournaments).orderBy(desc(tournaments.id)).limit(1);
  if (!rows.length) throw new Error("No tournament seeded");
  return rows[0];
}

export async function getTournamentInfo() {
  const db = getDb();
  const t = await currentTournament();
  const courseHoles = await db
    .select()
    .from(holes)
    .where(eq(holes.tournamentId, t.id))
    .orderBy(asc(holes.hole));
  return { tournament: t, holes: courseHoles };
}

export async function getLeaderboard() {
  const db = getDb();
  const t = await currentTournament();
  const rows = await db
    .select({ score: scores, player: players })
    .from(scores)
    .innerJoin(players, eq(scores.playerId, players.id))
    .where(eq(scores.tournamentId, t.id));
  rows.sort((a, b) => {
    const pa = parseInt(String(a.score.position).replace("T", ""), 10);
    const pb = parseInt(String(b.score.position).replace("T", ""), 10);
    return pa - pb || a.player.lastName.localeCompare(b.player.lastName);
  });
  return { tournament: t, entries: rows.map((r) => ({ ...r.score, player: r.player })) };
}

export async function getField() {
  const db = getDb();
  const t = await currentTournament();
  const field = await db
    .select()
    .from(players)
    .where(eq(players.tournamentId, t.id))
    .orderBy(asc(players.worldRanking));
  return { tournament: t, field };
}

export async function getDraws() {
  const db = getDb();
  const t = await currentTournament();
  const draws = await db
    .select()
    .from(teeTimes)
    .where(eq(teeTimes.tournamentId, t.id))
    .orderBy(desc(teeTimes.round), asc(teeTimes.teeTime));
  return { tournament: t, draws };
}

export async function getPrizeMoney() {
  const db = getDb();
  const t = await currentTournament();
  const breakdown = await db
    .select()
    .from(prizeMoney)
    .where(eq(prizeMoney.tournamentId, t.id));
  breakdown.sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10));
  return { tournament: t, breakdown };
}

export async function getPastResults() {
  const db = getDb();
  const t = await currentTournament();
  const results = await db
    .select()
    .from(pastResults)
    .where(eq(pastResults.tournamentId, t.id))
    .orderBy(desc(pastResults.year));
  return { tournament: t, results };
}

export async function getGallery() {
  const db = getDb();
  const t = await currentTournament();
  const items = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.tournamentId, t.id))
    .orderBy(asc(galleryItems.id));
  return { tournament: t, items };
}
