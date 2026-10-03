import { getDb } from "../api/queries/connection";
import {
  tournaments,
  players,
  scores,
  teeTimes,
  holes,
  prizeMoney,
  pastResults,
  galleryItems,
} from "./schema";

// ---------- deterministic pseudo-random ----------
let s = 42;
function rnd() {
  s = (s * 1103515245 + 12345) % 2147483648;
  return s / 2147483648;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

const HOLES: { hole: number; par: number; yards: number; name: string }[] = [
  { hole: 1, par: 4, yards: 412, name: "Beacon" },
  { hole: 2, par: 4, yards: 438, name: "Dune Ridge" },
  { hole: 3, par: 3, yards: 178, name: "Seaward" },
  { hole: 4, par: 5, yards: 562, name: "The Kelp" },
  { hole: 5, par: 4, yards: 405, name: "Ailsa View" },
  { hole: 6, par: 3, yards: 196, name: "Hollow" },
  { hole: 7, par: 4, yards: 452, name: "Gullane" },
  { hole: 8, par: 4, yards: 388, name: "Signal" },
  { hole: 9, par: 5, yards: 571, name: "Turnhome" },
  { hole: 10, par: 4, yards: 423, name: "Lighthouse" },
  { hole: 11, par: 4, yards: 401, name: "Brae" },
  { hole: 12, par: 3, yards: 165, name: "Cove" },
  { hole: 13, par: 5, yards: 588, name: "Garrison" },
  { hole: 14, par: 4, yards: 374, name: "Whipin" },
  { hole: 15, par: 4, yards: 441, name: "Craigends" },
  { hole: 16, par: 3, yards: 208, name: "The Narrows" },
  { hole: 17, par: 4, yards: 456, name: "Valley" },
  { hole: 18, par: 4, yards: 449, name: "Aurora" },
];
const PARS = HOLES.map((h) => h.par);
const COURSE_PAR = PARS.reduce((a, b) => a + b, 0); // 71
const YARDAGE = HOLES.reduce((a, b) => a + b.yards, 0); // 7107

/** Build an 18-hole card of raw strokes whose total relative to par = rel. */
function buildCard(rel: number, holesPlayed = 18): number[] {
  const card = PARS.slice(0, holesPlayed);
  let remaining = rel;
  const order = [...Array(holesPlayed).keys()].sort(() => rnd() - 0.5);
  let i = 0;
  while (remaining !== 0) {
    const h = order[i % holesPlayed];
    const par = PARS[h];
    if (remaining <= -2 && par === 5 && rnd() < 0.25) {
      card[h] -= 2;
      remaining += 2; // eagle
    } else if (remaining < 0 && card[h] > par - 1) {
      card[h] -= 1;
      remaining += 1; // birdie
    } else if (remaining > 0) {
      card[h] += 1;
      remaining -= 1; // bogey
    }
    i++;
    if (i > 500) break;
  }
  return card;
}

const FIELD: {
  first: string;
  last: string;
  country: string;
  code: string;
  rank: number;
  age: number;
  pro: number;
  wins: number;
  entry: string;
}[] = [
  { first: "Callum", last: "Reyes", country: "Scotland", code: "SCO", rank: 4, age: 29, pro: 2016, wins: 14, entry: "Tournament Host" },
  { first: "Adrian", last: "Vale", country: "England", code: "ENG", rank: 7, age: 31, pro: 2014, wins: 11, entry: "Top 10 Exemption" },
  { first: "Marcus", last: "Whitfield", country: "United States", code: "USA", rank: 9, age: 27, pro: 2019, wins: 8, entry: "Top 10 Exemption" },
  { first: "Søren", last: "Halvorsen", country: "Norway", code: "NOR", rank: 12, age: 25, pro: 2020, wins: 5, entry: "GolfAI Order of Merit" },
  { first: "Tomás", last: "Lindqvist", country: "Sweden", code: "SWE", rank: 15, age: 33, pro: 2012, wins: 9, entry: "Past Champion" },
  { first: "Ryo", last: "Nakamura", country: "Japan", code: "JPN", rank: 18, age: 26, pro: 2019, wins: 6, entry: "GolfAI Order of Merit" },
  { first: "Ji-hoon", last: "Park", country: "South Korea", code: "KOR", rank: 21, age: 28, pro: 2017, wins: 4, entry: "GolfAI Order of Merit" },
  { first: "Étienne", last: "Rousseau", country: "France", code: "FRA", rank: 24, age: 30, pro: 2015, wins: 5, entry: "GolfAI Order of Merit" },
  { first: "Daniel", last: "O'Connell", country: "Ireland", code: "IRL", rank: 26, age: 34, pro: 2011, wins: 7, entry: "Past Champion" },
  { first: "Luca", last: "Moretti", country: "Italy", code: "ITA", rank: 29, age: 24, pro: 2021, wins: 3, entry: "Rookie Invitation" },
  { first: "Alejandro", last: "Vargas", country: "Spain", code: "ESP", rank: 33, age: 32, pro: 2013, wins: 6, entry: "GolfAI Order of Merit" },
  { first: "Pieter", last: "van der Merwe", country: "South Africa", code: "RSA", rank: 35, age: 36, pro: 2010, wins: 10, entry: "Past Champion" },
  { first: "Jack", last: "Thornton", country: "Australia", code: "AUS", rank: 38, age: 27, pro: 2018, wins: 4, entry: "GolfAI Order of Merit" },
  { first: "Emil", last: "Andersen", country: "Denmark", code: "DEN", rank: 41, age: 23, pro: 2022, wins: 2, entry: "Rookie Invitation" },
  { first: "Henrik", last: "Baumann", country: "Germany", code: "GER", rank: 44, age: 35, pro: 2011, wins: 5, entry: "Sponsor Invitation" },
  { first: "Cian", last: "Doyle", country: "Ireland", code: "IRL", rank: 47, age: 26, pro: 2020, wins: 2, entry: "Qualifier" },
  { first: "Noah", last: "Fitzgerald", country: "United States", code: "USA", rank: 52, age: 29, pro: 2016, wins: 3, entry: "GolfAI Order of Merit" },
  { first: "Tadasu", last: "Ishii", country: "Japan", code: "JPN", rank: 55, age: 30, pro: 2015, wins: 3, entry: "Sponsor Invitation" },
  { first: "Felix", last: "Bergström", country: "Sweden", code: "SWE", rank: 58, age: 22, pro: 2023, wins: 1, entry: "Rookie Invitation" },
  { first: "Angus", last: "McAllister", country: "Scotland", code: "SCO", rank: 61, age: 37, pro: 2009, wins: 6, entry: "Sponsor Invitation" },
  { first: "Sebastian", last: "Cole", country: "England", code: "ENG", rank: 64, age: 28, pro: 2017, wins: 2, entry: "Qualifier" },
  { first: "Min-jun", last: "Kim", country: "South Korea", code: "KOR", rank: 67, age: 25, pro: 2020, wins: 2, entry: "Qualifier" },
  { first: "Rafael", last: "Ortega", country: "Spain", code: "ESP", rank: 72, age: 31, pro: 2014, wins: 3, entry: "GolfAI Order of Merit" },
  { first: "Willem", last: "Botha", country: "South Africa", code: "RSA", rank: 76, age: 29, pro: 2016, wins: 2, entry: "Qualifier" },
  { first: "Oscar", last: "Lindgren", country: "Sweden", code: "SWE", rank: 81, age: 33, pro: 2012, wins: 4, entry: "Sponsor Invitation" },
  { first: "Harry", last: "Pemberton", country: "England", code: "ENG", rank: 85, age: 24, pro: 2021, wins: 1, entry: "Rookie Invitation" },
  { first: "Louis", last: "Marchand", country: "France", code: "FRA", rank: 89, age: 27, pro: 2018, wins: 1, entry: "Qualifier" },
  { first: "Dante", last: "Rossi", country: "Italy", code: "ITA", rank: 94, age: 30, pro: 2015, wins: 2, entry: "Qualifier" },
  { first: "Kaito", last: "Mori", country: "Japan", code: "JPN", rank: 99, age: 21, pro: 2024, wins: 0, entry: "Rookie Invitation" },
  { first: "Elias", last: "Nilsen", country: "Norway", code: "NOR", rank: 104, age: 26, pro: 2019, wins: 1, entry: "Qualifier" },
  { first: "Brodie", last: "Campbell", country: "Scotland", code: "SCO", rank: 112, age: 34, pro: 2012, wins: 2, entry: "Sponsor Invitation" },
  { first: "Julian", last: "Hartmann", country: "Germany", code: "GER", rank: 121, age: 28, pro: 2017, wins: 1, entry: "Qualifier" },
];

async function seed() {
  const db = getDb();
  console.log("Seeding GolfAI Championship database...");

  // clear (child tables first)
  await db.delete(galleryItems);
  await db.delete(pastResults);
  await db.delete(prizeMoney);
  await db.delete(holes);
  await db.delete(teeTimes);
  await db.delete(scores);
  await db.delete(players);
  await db.delete(tournaments);

  const [t] = await db
    .insert(tournaments)
    .values({
      name: "The GolfAI Championship",
      edition: "3rd Edition",
      course: "Aurora Links",
      location: "Ayrshire Coast",
      country: "Scotland",
      startDate: "2026-10-08",
      endDate: "2026-10-11",
      par: COURSE_PAR,
      yardage: YARDAGE,
      prizeFund: 9000000,
      currency: "USD",
      status: "live",
      currentRound: 4,
      defendingChampion: "Tomás Lindqvist",
      tagline: "Where the game meets its future.",
      description:
        "Set against the dunes of the Ayrshire coast, The GolfAI Championship brings thirty-two of the world's finest players to Aurora Links for four days of links golf at its purest — shaped by data, decided by nerve.",
    })
    .$returningId();
  const tid = t.id;

  // holes
  await db.insert(holes).values(
    HOLES.map((h, i) => ({
      tournamentId: tid,
      hole: h.hole,
      par: h.par,
      yards: h.yards,
      name: h.name,
      difficulty: i + 1,
    })),
  );

  // players
  const inserted = await db
    .insert(players)
    .values(
      FIELD.map((p) => ({
        tournamentId: tid,
        firstName: p.first,
        lastName: p.last,
        country: p.country,
        countryCode: p.code,
        worldRanking: p.rank,
        age: p.age,
        turnedPro: p.pro,
        wins: p.wins,
        entryType: p.entry,
      })),
    )
    .$returningId();
  const playerIds = inserted.map((r) => r.id);

  // scores — R1–R3 complete, R4 in progress
  const r1 = [-6, -5, -5, -4, -4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -1, -1, -1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6];
  const r2 = [-5, -6, -3, -2, -4, -5, -2, -3, -1, -4, -3, -2, -5, -1, -2, -3, 0, -1, -2, 1, 0, -2, -1, 0, 1, -1, 2, 0, 1, 2, 3, 1];
  const r3 = [-4, -3, -4, -5, -2, -3, -4, -1, -2, -3, -2, -1, -3, -2, 0, -1, -2, -3, 0, -1, 1, 0, -2, 1, 0, 2, -1, 1, 3, 0, 2, 4];
  const thruList = [18, 18, 18, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2];
  const todayRel = [-3, -4, -2, -2, -1, -3, -2, -1, 0, -2, -1, -1, 0, 1, -2, 0, -1, 1, 0, -1, 0, 1, -1, 0, 1, 0, 1, -1, 1, 0, 2, 1];

  type Row = {
    idx: number;
    rel54: number;
    thru: number;
    today: number;
    total: number;
    r4: number | null;
    cards: Record<string, number[]>;
    strokes: number;
  };
  const rows: Row[] = FIELD.map((_, i) => {
    const rel54 = r1[i] + r2[i] + r3[i];
    const thru = thruList[i];
    const today = todayRel[i];
    const finished = thru === 18;
    const cards: Record<string, number[]> = {
      r1: buildCard(r1[i]),
      r2: buildCard(r2[i]),
      r3: buildCard(r3[i]),
      r4: buildCard(today, thru),
    };
    const total = rel54 + today;
    return {
      idx: i,
      rel54,
      thru,
      today,
      total,
      r4: finished ? COURSE_PAR + today : null,
      cards,
      strokes:
        cards.r1.reduce((a, b) => a + b, 0) +
        cards.r2.reduce((a, b) => a + b, 0) +
        cards.r3.reduce((a, b) => a + b, 0) +
        cards.r4.reduce((a, b) => a + b, 0),
    };
  });

  // rank & positions with ties
  const sorted = [...rows].sort((a, b) => a.total - b.total || a.idx - b.idx);
  const posOf = new Map<number, string>();
  sorted.forEach((row, i) => {
    if (i > 0 && row.total === sorted[i - 1].total) {
      const prev = posOf.get(sorted[i - 1].idx)!;
      if (!prev.startsWith("T")) {
        posOf.set(sorted[i - 1].idx, `T${prev}`);
        posOf.set(row.idx, `T${prev}`);
      } else {
        posOf.set(row.idx, prev);
      }
    } else {
      posOf.set(row.idx, String(i + 1));
    }
  });

  await db.insert(scores).values(
    rows.map((row) => ({
      tournamentId: tid,
      playerId: playerIds[row.idx],
      position: posOf.get(row.idx)!,
      r1: COURSE_PAR + r1[row.idx],
      r2: COURSE_PAR + r2[row.idx],
      r3: COURSE_PAR + r3[row.idx],
      r4: row.r4,
      thru: row.thru,
      today: row.today,
      total: row.total,
      strokes: row.strokes,
      status: row.thru === 18 ? "finished" : "on course",
      scorecards: row.cards,
    })),
  );

  // tee times — R4 two-balls, leaders last; R3 for the draws archive
  const byStanding = [...rows].sort((a, b) => a.total - b.total).map((r) => r.idx);
  const name = (i: number) => `${FIELD[i].first} ${FIELD[i].last}`;
  const r4Groups: string[][] = [];
  const rev = [...byStanding].reverse();
  for (let i = 0; i < rev.length; i += 2) r4Groups.push(rev.slice(i, i + 2).map(name));
  const t0 = 8 * 60; // 08:00
  const r4Rows = r4Groups.map((g, gi) => ({
    tournamentId: tid,
    round: 4,
    teeTime: `${String(Math.floor((t0 + gi * 8) / 60)).padStart(2, "0")}:${String((t0 + gi * 8) % 60).padStart(2, "0")}`,
    tee: "1",
    playerNames: g,
  }));
  const r3Order = [...Array(32).keys()].sort(() => rnd() - 0.5);
  const r3Groups: string[][] = [];
  for (let i = 0; i < r3Order.length; i += 2) r3Groups.push(r3Order.slice(i, i + 2).map(name));
  const r3Rows = r3Groups.map((g, gi) => ({
    tournamentId: tid,
    round: 3,
    teeTime: `${String(Math.floor((t0 + gi * 8) / 60)).padStart(2, "0")}:${String((t0 + gi * 8) % 60).padStart(2, "0")}`,
    tee: "1",
    playerNames: g,
  }));
  await db.insert(teeTimes).values([...r4Rows, ...r3Rows]);

  // prize money ($9,000,000)
  const pct = [16.0, 10.4, 6.7, 5.0, 4.2, 3.6, 3.3, 3.0, 2.8, 2.6, 2.4, 2.2, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3];
  const pts = [1000, 700, 530, 430, 360, 310, 275, 245, 220, 200, 185, 170, 158, 146, 136, 126, 118, 110, 104, 98];
  await db.insert(prizeMoney).values(
    pct.map((p, i) => ({
      tournamentId: tid,
      position: String(i + 1),
      amount: Math.round((9000000 * p) / 100),
      points: pts[i],
    })),
  );

  // past results
  await db.insert(pastResults).values([
    { tournamentId: tid, year: 2025, champion: "Tomás Lindqvist", country: "Sweden", score: "-18", margin: "2 strokes", runnerUp: "Callum Reyes" },
    { tournamentId: tid, year: 2024, champion: "Daniel O'Connell", country: "Ireland", score: "-15", margin: "Playoff", runnerUp: "Pieter van der Merwe" },
    { tournamentId: tid, year: 2023, champion: "Pieter van der Merwe", country: "South Africa", score: "-21", margin: "4 strokes", runnerUp: "Adrian Vale" },
    { tournamentId: tid, year: 2022, champion: "Callum Reyes", country: "Scotland", score: "-16", margin: "1 stroke", runnerUp: "Marcus Whitfield" },
    { tournamentId: tid, year: 2021, champion: "Alejandro Vargas", country: "Spain", score: "-14", margin: "Playoff", runnerUp: "Henrik Baumann" },
  ]);

  // gallery
  await db.insert(galleryItems).values([
    { tournamentId: tid, title: "Golden Hour at the 18th", kind: "video", src: "/media/hero-loop.mp4", caption: "Sunday's final groups chase the low sun home across Aurora Links.", span: "wide" },
    { tournamentId: tid, title: "The Ayrshire Coastline", kind: "photo", src: "/media/course-aerial.png", caption: "Seven holes touch the sea. None of them forgive.", span: "wide" },
    { tournamentId: tid, title: "Into the Evening", kind: "photo", src: "/media/swing-dusk.png", caption: "The last tee shot of the day, sent into a burning sky.", span: "tall" },
    { tournamentId: tid, title: "Dew on the Dancefloor", kind: "photo", src: "/media/putt-macro.png", caption: "Morning rounds begin on glass.", span: "wide" },
    { tournamentId: tid, title: "The Aurora Trophy", kind: "photo", src: "/media/trophy.png", caption: "Thirty-two arrive. One name is engraved.", span: "tall" },
    { tournamentId: tid, title: "Escape from the Sand", kind: "photo", src: "/media/bunker.png", caption: "The revetted bunkers of the 14th claim their toll.", span: "wide" },
    { tournamentId: tid, title: "Sunday at the Last", kind: "photo", src: "/media/gallery-18th.png", caption: "The amphitheatre holds its breath.", span: "wide" },
    { tournamentId: tid, title: "Morning Walk", kind: "photo", src: "/media/fairway-mist.png", caption: "Before the roars, the quiet.", span: "wide" },
  ]);

  console.log("Done. Tournament id:", tid);
  process.exit(0);
}

seed();
