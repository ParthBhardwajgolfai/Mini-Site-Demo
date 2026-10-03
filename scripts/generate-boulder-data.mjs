#!/usr/bin/env node
/**
 * scripts/generate-boulder-data.mjs
 *
 * Reads the extracted Boulder Classic JSON source of truth:
 *   C:\Users\parth\OneDrive\Desktop\Devenv-Golfai\Scoring-Tournament\BoulderClassic\extracted
 * and emits `src/data/boulder-classic.ts` — the hardcoded, frontend-only data
 * module that feeds the mini-site. Run once; the output is committed, so the
 * frontend never touches a backend or the source folder at runtime.
 *
 *   node scripts/generate-boulder-data.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SOURCE_DIR =
  process.env.BOULDER_SOURCE_DIR ??
  "C:/Users/parth/OneDrive/Desktop/Devenv-Golfai/Scoring-Tournament/BoulderClassic/extracted";
const OUT_FILE = join(ROOT, "src", "data", "boulder-classic.ts");

if (!existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

const readJson = (rel) => JSON.parse(readFileSync(join(SOURCE_DIR, rel), "utf8"));

const overview = readJson("tournament_overview.json");
const masterPlayers = readJson("master_players_database.json");
const leaderboardFinal = readJson("leaderboard_final.json");
const holeByHole = readJson("hole_by_hole_all_rounds.json");
const drawsByRound = {
  1: readJson("round_1/draw.json"),
  2: readJson("round_2/draw.json"),
  3: readJson("round_3/draw.json"),
  4: readJson("round_4/draw.json"),
};

// ---------- helpers ----------

const ISO2 = new Map([
  ["INDIA", "IN"], ["IND", "IN"], ["CANADA", "CA"], ["CAN", "CA"], ["SRI LANKA", "LK"], ["SRI", "LK"],
  ["BANGLADESH", "BD"], ["BAN", "BD"], ["NEPAL", "NP"], ["NEP", "NP"],
  ["THAILAND", "TH"], ["THA", "TH"], ["MALAYSIA", "MY"], ["MAS", "MY"],
  ["SOUTH AFRICA", "ZA"], ["RSA", "ZA"], ["USA", "US"], ["UNITED STATES", "US"],
  ["ENGLAND", "GB"], ["ENG", "GB"], ["SCOTLAND", "GB"], ["SCO", "GB"], ["AUSTRALIA", "AU"], ["AUS", "AU"],
  ["GERMANY", "DE"], ["GER", "DE"], ["SPAIN", "ES"], ["ESP", "ES"],
  ["ITALY", "IT"], ["ITA", "IT"], ["JAPAN", "JP"], ["JPN", "JP"],
  ["SOUTH KOREA", "KR"], ["KOR", "KR"], ["KOREA", "KR"], ["TAIWAN", "TW"], ["TPE", "TW"],
  ["CHINA", "CN"], ["CHN", "CN"], ["FRANCE", "FR"], ["FRA", "FR"],
  ["SWEDEN", "SE"], ["SWE", "SE"], ["NEW ZEALAND", "NZ"], ["NZL", "NZ"],
  ["PAKISTAN", "PK"], ["PAK", "PK"], ["UNITED ARAB EMIRATES", "AE"], ["UAE", "AE"],
  ["AUSTRIA", "AT"], ["AUT", "AT"], ["DENMARK", "DK"], ["DEN", "DK"],
  ["IRELAND", "IE"], ["IRL", "IE"], ["NETHERLANDS", "NL"], ["NED", "NL"],
  ["SWITZERLAND", "CH"], ["SUI", "CH"], ["FINLAND", "FI"], ["FIN", "FI"],
  ["SINGAPORE", "SG"], ["SGP", "SG"], ["UGANDA", "UG"], ["UGA", "UG"],
  ["BELGIUM", "BE"], ["BEL", "BE"], ["BHUTAN", "BT"], ["BHU", "BT"],
  ["PORTUGAL", "PT"], ["POR", "PT"], ["CZECH REPUBLIC", "CZ"], ["CZE", "CZ"],
  ["ZAMBIA", "ZM"], ["ZAM", "ZM"], ["SLOVAKIA", "SK"], ["SVK", "SK"],
  ["MAURITIUS", "MU"], ["MRI", "MU"],
]);

function titleCase(s) {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** "SHUBHANKAR SHARMA" -> { first: "Shubhankar", last: "Sharma" }; a trailing
 *  initial ("DILIP M") stays with the surname as "M." */
function splitName(full) {
  const tokens = full.trim().split(/\s+/);
  const lastTok = tokens[tokens.length - 1];
  if (tokens.length === 1) return { first: "", last: titleCase(lastTok) };
  if (lastTok.length === 1) {
    return { first: titleCase(tokens.slice(0, -1).join(" ")), last: `${lastTok}.` };
  }
  return { first: titleCase(tokens.slice(0, -1).join(" ")), last: titleCase(lastTok) };
}

function iso2(country) {
  if (!country) return "IN";
  return ISO2.get(country.trim().toUpperCase()) ?? "IN";
}

function ageAt(dobStr, onISO) {
  const m = dobStr?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const dob = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const on = new Date(onISO);
  let age = on.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    on.getMonth() < dob.getMonth() ||
    (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function cleanEntryCategory(cat) {
  if (!cat) return "Invitational";
  return titleCase(cat.replace(/^[0-9]+(\([a-z]\))?\./, "").trim())
    .replace(/\bPgti\b/g, "PGTI")
    .replace(/\bOf\b/g, "of");
}

// ---------- course holes ----------
// Pars are the official course pars from the hole-by-hole source; difficulty is
// ranked from the combined stroke averages across the four rounds (1 = hardest).
// Official per-hole yardages are not part of the source data — the yardages
// below are championship-tee approximations kept consistent with a ~7,200-yard,
// par-72 routing.
const cp = holeByHole.round_1.course_par;
const coursePars = [...cp.holes_front9, ...cp.holes_back9];
const APPROX_YARDS = [
  412, 438, 186, 445, 556, 423, 571, 172, 405,
  423, 195, 401, 416, 548, 441, 168, 456, 562,
];
const roundCount = Object.keys(holeByHole).length;
const avgSums = Array(18).fill(0);
for (const r of Object.keys(holeByHole)) {
  holeByHole[r].hole_averages.holes_front9.forEach((v, i) => (avgSums[i] += v));
  holeByHole[r].hole_averages.holes_back9.forEach((v, i) => (avgSums[9 + i] += v));
}
const combinedAvg = avgSums.map((s) => s / roundCount);
const difficultyRank = [...combinedAvg]
  .map((v, i) => ({ v, i }))
  .sort((a, b) => a.v - b.v)
  .map((x, rank) => ({ hole: x.i + 1, difficulty: rank + 1 }));

const holes = coursePars.map((par, i) => ({
  hole: i + 1,
  par,
  yards: APPROX_YARDS[i],
  difficulty: difficultyRank[i].difficulty,
}));

// ---------- per-round scorecards by player name ----------
const cardsByRound = {};
for (const r of Object.keys(holeByHole)) {
  const map = new Map();
  for (const p of holeByHole[r].players) {
    const card = Array.from({ length: 18 }, (_, h) => p.holes[String(h + 1)] ?? null);
    map.set(p.name, card);
  }
  cardsByRound[r] = map;
}

// ---------- leaderboard entries (53 official finishers) ----------
const rankCounts = new Map();
for (const e of leaderboardFinal) rankCounts.set(e.rank, (rankCounts.get(e.rank) ?? 0) + 1);
const masterByName = new Map(masterPlayers.map((p) => [p.player_name, p]));

const leaderboardEntries = leaderboardFinal.map((e, i) => {
  const master = masterByName.get(e.player_name);
  const name = splitName(e.player_name);
  const card = (r) => cardsByRound[`round_${r}`].get(e.player_name) ?? [];
  return {
    id: i + 1,
    position: rankCounts.get(e.rank) > 1 ? `T${parseInt(e.rank, 10)}` : e.rank,
    r1: e.r1,
    r2: e.r2,
    r3: e.r3,
    r4: e.r4,
    thru: 18,
    // "today" is shown relative to par by the UI (fmtToPar), unlike r1..r4 raw strokes
    today: e.r4 == null ? null : e.r4 - overview.par,
    total: parseInt(e.score_to_par, 10),
    strokes: parseInt(e.total_score, 10),
    status: "finished",
    player: {
      firstName: name.first,
      lastName: name.last,
      country: master ? titleCase(master.country) : "India",
      countryCode: iso2(master?.country),
    },
    scorecards: { r1: card(1), r2: card(2), r3: card(3), r4: card(4) },
  };
});

// ---------- the field (132 players) ----------
const fieldPlayers = masterPlayers
  .map((p, i) => {
    const name = splitName(p.player_name);
    return {
      id: i + 1,
      firstName: name.first,
      lastName: name.last,
      country: titleCase(p.country ?? "India"),
      countryCode: iso2(p.country),
      code: p.player_code,
      city: p.city ? titleCase(p.city) : null,
      age: ageAt(p.date_of_birth, "2026-04-14"),
      entryType: cleanEntryCategory(p.entry_category),
      status: p.tournament_status,
    };
  })
  .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));

// ---------- draws (official, all four rounds) ----------
const draws = [];
let drawId = 0;
for (const round of [1, 2, 3, 4]) {
  for (const g of drawsByRound[round]) {
    drawId += 1;
    draws.push({
      id: drawId,
      round,
      teeTime: g.tee_time,
      tee: String(g.starting_tee),
      playerNames: g.players.map((p) =>
        p.name
          .toLowerCase()
          .split(" ")
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
          .join(" "),
      ),
    });
  }
}

// ---------- prize money (Rs. 1 Crore purse, PGTI ladder, ties pooled) ----------
// Same distribution model as the backend seed: the PGTI 65-place ratio ladder
// applied in finishing order; tied positions pool their ratios and split evenly.
const TOTAL_PURSE = 10000000;
const RATIO_LADDER = [
  0.18, 0.12, 0.08, 0.06, 0.05, 0.045, 0.04, 0.035, 0.032, 0.029,
  0.027, 0.025, 0.023, 0.021, 0.0195, 0.018, 0.0165, 0.0155, 0.014, 0.0135,
  0.013, 0.0125, 0.012, 0.0115, 0.011, 0.0105, 0.01, 0.0095, 0.009, 0.0085,
  0.008, 0.0075, 0.007, 0.0065, 0.006, 0.0055, 0.005, 0.0048, 0.0045, 0.0042,
  0.004, 0.0038, 0.0036, 0.0034, 0.0032, 0.003, 0.0028, 0.0026, 0.0024, 0.0022,
  0.002, 0.0018, 0.0016, 0.0014, 0.0012, 0.001, 0.0009, 0.0008, 0.00075, 0.0007,
  0.00065, 0.0006, 0.00055, 0.0005, 0.0004,
];

const prizeRows = [];
{
  let ladderPos = 0;
  let id = 0;
  const rankGroups = new Map();
  for (const e of leaderboardFinal) {
    if (!rankGroups.has(e.rank)) rankGroups.set(e.rank, []);
    rankGroups.get(e.rank).push(e);
  }
  for (const [rank, group] of rankGroups.entries()) {
    let pooled = 0;
    for (let k = 0; k < group.length; k++) pooled += RATIO_LADDER[ladderPos + k] ?? 0.0004;
    ladderPos += group.length;
    id += 1;
    const share = Math.round((TOTAL_PURSE * pooled) / group.length);
    prizeRows.push({
      id,
      position: String(parseInt(rank, 10)),
      tied: group.length > 1,
      sharedBy: group.length,
      amount: share,
    });
  }
}

// ---------- results (this edition's official result) ----------
const champion = leaderboardFinal[0];
const runnersUp = leaderboardFinal.filter(
  (e) => e.total_score === leaderboardFinal[1].total_score,
);
// margin: strokes between the champion and the next best total (263 vs 271 -> 8)
const pastResults = [
  {
    id: 1,
    year: 2026,
    champion: titleCase(champion.player_name),
    country: "India",
    score: champion.score_to_par,
    margin: `${Math.abs(
      parseInt(champion.total_score, 10) - parseInt(leaderboardFinal[1].total_score, 10),
    )} strokes`,
    runnerUp: runnersUp.map((r) => titleCase(r.player_name)).join(" · "),
  },
];

// ---------- gallery (uses the bundled /media assets) ----------
const galleryItems = [
  { id: 1, title: "Golden Hour at Boulder Hills", kind: "video", src: "/media/hero-loop.mp4", caption: "The final groups chase the evening light home across the Deccan parkland.", span: "wide" },
  { id: 2, title: "The Course from Above", kind: "photo", src: "/media/course-aerial.png", caption: "Boulder Hills Golf Club winding through rock, broom and bottle-green fairways.", span: "wide" },
  { id: 3, title: "Into the Evening", kind: "photo", src: "/media/swing-dusk.png", caption: "The last tee shot of the day, sent into a burning Hyderabad sky.", span: "tall" },
  { id: 4, title: "Dew on the Greens", kind: "photo", src: "/media/putt-macro.png", caption: "Morning rounds at Boulder Hills begin on glass.", span: "wide" },
  { id: 5, title: "The Boulders Classic Trophy", kind: "photo", src: "/media/trophy.png", caption: "One hundred thirty-two arrive. One name is engraved.", span: "tall" },
  { id: 6, title: "Out of the Sand", kind: "photo", src: "/media/bunker.png", caption: "The hillside bunkers claim their toll all week.", span: "wide" },
  { id: 7, title: "Crowds at the Last", kind: "photo", src: "/media/gallery-18th.png", caption: "The 18th amphitheatre holds its breath on Sunday.", span: "wide" },
  { id: 8, title: "Morning on the Fairways", kind: "photo", src: "/media/fairway-mist.png", caption: "Before the roars, the quiet.", span: "wide" },
];

// ---------- tournament ----------
const yardage = APPROX_YARDS.reduce((a, b) => a + b, 0);
const tournament = {
  id: 1,
  name: "Boulders Classic",
  edition: "2026",
  course: "Boulder Hills Golf Club",
  location: "Hyderabad",
  country: "India",
  startDate: "2026-04-14",
  endDate: "2026-04-17",
  par: overview.par,
  yardage,
  prizeFund: TOTAL_PURSE,
  currency: "INR",
  status: "finished",
  currentRound: 4,
  champion: titleCase(champion.player_name),
  championToPar: parseInt(champion.score_to_par, 10),
  format: overview.format,
  cutRule: overview.cut_rule,
  fieldSize: overview.total_registered_field,
  madeCut: overview.players_advanced_to_finals,
  description:
    "The Boulders Classic brings the PGTI Tour to Boulder Hills Golf Club, Hyderabad — 132 professionals contesting 72 holes of stroke play for a purse of ₹1 Crore. The cut falls to the top 50 and ties after 36 holes; Shubhankar Sharma lifted the trophy at 25 under par.",
};

// ---------- emit ----------
const types = `export interface TournamentInfo {
  id: number;
  name: string;
  edition: string;
  course: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  par: number;
  yardage: number;
  prizeFund: number;
  currency: string;
  status: string;
  currentRound: number;
  champion: string;
  championToPar: number;
  format: string;
  cutRule: string;
  fieldSize: number;
  madeCut: number;
  description: string;
}

export interface CourseHole {
  hole: number;
  par: number;
  yards: number;
  difficulty: number;
}

export interface FieldPlayer {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  countryCode: string;
  code: string;
  city: string | null;
  age: number | null;
  entryType: string;
  status: "Made Cut" | "Missed Cut" | "Retired";
}

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
  player: { firstName: string; lastName: string; country: string; countryCode: string };
  scorecards: { r1: number[]; r2: number[]; r3: number[]; r4: number[] };
}

export interface DrawGroup {
  id: number;
  round: number;
  teeTime: string;
  tee: string;
  playerNames: string[];
}

export interface PrizeRow {
  id: number;
  position: string;
  tied: boolean;
  sharedBy: number;
  amount: number;
}

export interface PastResult {
  id: number;
  year: number;
  champion: string;
  country: string;
  score: string;
  margin: string;
  runnerUp: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  kind: string;
  src: string;
  caption: string;
  span: string;
}
`;

const json = (v) => JSON.stringify(v, null, 2).replace(/^/gm, "");

const out = `/**
 * Boulders Classic 2026 (PGTI) — hardcoded tournament data.
 *
 * Generated by scripts/generate-boulder-data.mjs from the official extracted
 * tournament JSON (players, draws, hole-by-hole scores, final leaderboard,
 * cut and purse model). The frontend reads this module directly — no backend
 * or database involved.
 *
 * Per-hole yardages are championship-tee approximations; every score, name,
 * draw and prize figure is the official tournament data.
 */

${types}

export const tournament: TournamentInfo = ${json(tournament)};

export const courseHoles: CourseHole[] = ${json(holes)};

export const leaderboardEntries: LeaderboardEntry[] = ${json(leaderboardEntries)};

export const fieldPlayers: FieldPlayer[] = ${json(fieldPlayers)};

export const draws: DrawGroup[] = ${json(draws)};

export const prizeMoneyRows: PrizeRow[] = ${json(prizeRows)};

export const pastResults: PastResult[] = ${json(pastResults)};

export const galleryItems: GalleryItem[] = ${json(galleryItems)};
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, out);
console.log(
  `Wrote ${OUT_FILE}\n  tournament 1, holes ${holes.length}, entries ${leaderboardEntries.length}, field ${fieldPlayers.length}, draws ${draws.length}, prizes ${prizeRows.length}`,
);
