import {
  mysqlTable,
  serial,
  varchar,
  text,
  int,
  bigint,
  json,
  timestamp,
} from "drizzle-orm/mysql-core";

export const tournaments = mysqlTable("tournaments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  edition: varchar("edition", { length: 64 }).notNull(),
  course: varchar("course", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  startDate: varchar("start_date", { length: 32 }).notNull(),
  endDate: varchar("end_date", { length: 32 }).notNull(),
  par: int("par").notNull(),
  yardage: int("yardage").notNull(),
  prizeFund: int("prize_fund").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("USD"),
  status: varchar("status", { length: 32 }).notNull().default("live"),
  currentRound: int("current_round").notNull().default(4),
  defendingChampion: varchar("defending_champion", { length: 255 }),
  tagline: text("tagline"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const players = mysqlTable("players", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  countryCode: varchar("country_code", { length: 8 }).notNull(),
  worldRanking: int("world_ranking"),
  age: int("age"),
  turnedPro: int("turned_pro"),
  wins: int("wins").notNull().default(0),
  entryType: varchar("entry_type", { length: 64 }).notNull().default("Invitational"),
});

export const scores = mysqlTable("scores", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  playerId: bigint("player_id", { mode: "number", unsigned: true }).notNull(),
  position: varchar("position", { length: 16 }).notNull(),
  r1: int("r1"),
  r2: int("r2"),
  r3: int("r3"),
  r4: int("r4"),
  thru: int("thru").notNull().default(0),
  today: int("today"),
  total: int("total").notNull(),
  strokes: int("strokes").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  // per-hole scorecards: { r1: number[18], r2: ..., ... } relative-to-par or raw strokes
  scorecards: json("scorecards"),
});

export const teeTimes = mysqlTable("tee_times", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  round: int("round").notNull(),
  teeTime: varchar("tee_time", { length: 16 }).notNull(),
  tee: varchar("tee", { length: 8 }).notNull().default("1"),
  playerNames: json("player_names").notNull(), // string[]
});

export const holes = mysqlTable("holes", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  hole: int("hole").notNull(),
  par: int("par").notNull(),
  yards: int("yards").notNull(),
  name: varchar("name", { length: 128 }),
  difficulty: int("difficulty").notNull(),
});

export const prizeMoney = mysqlTable("prize_money", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  position: varchar("position", { length: 16 }).notNull(),
  amount: int("amount").notNull(),
  points: int("points").notNull(),
});

export const pastResults = mysqlTable("past_results", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  year: int("year").notNull(),
  champion: varchar("champion", { length: 255 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  score: varchar("score", { length: 16 }).notNull(),
  margin: varchar("margin", { length: 32 }).notNull(),
  runnerUp: varchar("runner_up", { length: 255 }).notNull(),
});

export const galleryItems = mysqlTable("gallery_items", {
  id: serial("id").primaryKey(),
  tournamentId: bigint("tournament_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  kind: varchar("kind", { length: 16 }).notNull().default("photo"),
  src: varchar("src", { length: 512 }).notNull(),
  caption: text("caption"),
  span: varchar("span", { length: 16 }).notNull().default("wide"),
});
