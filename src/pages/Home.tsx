import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, ImageReveal, EditorialHeading } from "@/components/Reveal";
import LeaderboardTable from "@/components/LeaderboardTable";
import { fmtDateRange, fmtMoney } from "@/lib/format";
import {
  tournament,
  leaderboardEntries,
  galleryItems,
} from "@/data/boulder-classic";

const EASE = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const t = tournament;

  const headline = ["Where the game", "meets its future."];
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-[1.08]">
        <video
          className="h-full w-full object-cover"
          src="/media/hero-loop.mp4"
          poster="/media/hero-poster.png"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-24 md:px-10 md:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="kicker flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span>{`${t.name} · ${t.edition}`}</span>
          <span className="hidden h-px w-10 bg-gold/60 md:block" />
          <span className="text-cream/70">
            {`${t.course}, ${t.location} — ${t.country}`}
          </span>
        </motion.p>

        <h1 className="mt-6 font-serif text-[13vw] font-light leading-[0.98] tracking-tight text-cream sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "italic text-gold-soft" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.45 + i * 0.14, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream">
              Final · 72 Holes Complete
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/60">
            {fmtDateRange(t.startDate, t.endDate)}
          </span>
          <Link
            to="/leaderboard"
            className="group flex items-center gap-3 border border-cream/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
          >
            Final Leaderboard
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-mega text-cream/50">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-cream/50 to-transparent" />
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Boulder Hills Golf Club",
    "Hyderabad · Telangana",
    `Par ${tournament.par} · ${tournament.yardage.toLocaleString()} Yards`,
    `${fmtMoney(tournament.prizeFund, tournament.currency)} Prize Fund`,
    `${tournament.fieldSize} Players`,
    "72-Hole Stroke Play",
    "April 14–17, 2026",
  ];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/25 bg-pine py-4">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft/80">
            {it}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ChampionshipIntro() {
  const t = tournament;
  const stats = [
    { label: "Par", value: String(t.par) },
    { label: "Yardage", value: t.yardage.toLocaleString() },
    { label: "Prize Fund", value: fmtMoney(t.prizeFund, t.currency) },
    { label: "Champion", value: t.champion },
  ];
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <EditorialHeading
              dark
              kicker="The Championship"
              title={
                <>
                  Parkland golf,
                  <br />
                  <span className="italic text-fairway">at its purest.</span>
                </>
              }
            />
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-ink/70">
                {t?.description}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-12 grid grid-cols-2 gap-px bg-ink/10">
                {stats.map((s) => (
                  <div key={s.label} className="bg-cream p-5 md:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">
                      {s.label}
                    </p>
                    <p className="mt-2 font-serif text-xl font-light md:text-2xl">{s.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ImageReveal
              src="/media/course-aerial.png"
              alt="Aerial view of Boulder Hills Golf Club, Hyderabad"
              className="h-[320px] overflow-hidden md:h-[560px] lg:ml-12"
            />
            <Reveal delay={0.2}>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45 lg:ml-12">
                Boulder Hills Golf Club · Hyderabad, Telangana
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderboardSnapshot() {
  return (
    <section className="bg-ink grain relative">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <EditorialHeading
            kicker="Final · Round 4"
            title={
              <>
                The leaderboard<span className="text-gold">.</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <Link
              to="/leaderboard"
              className="group mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/70 transition-colors hover:text-gold"
            >
              Full leaderboard
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-10">
          <LeaderboardTable entries={leaderboardEntries} limit={8} live={false} />
        </Reveal>
      </div>
    </section>
  );
}

function EditorialQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:grid-cols-12 md:px-10 md:py-36">
        <div className="relative md:col-span-4 md:col-start-1">
          <motion.div style={{ y }} className="relative h-[420px] overflow-hidden md:h-[560px]">
            <img
              src="/media/swing-dusk.png"
              alt="Golfer silhouetted against the evening sky"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
        <div className="flex flex-col justify-center md:col-span-7 md:col-start-6">
          <Reveal>
            <p className="kicker">The Final-Round Test</p>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="mt-8 font-serif text-3xl font-light leading-[1.2] text-cream md:text-5xl">
              “Every shot here is a decision.
              <span className="italic text-gold-soft"> Every decision is data.</span>
              <span> Every Sunday, a champion.”</span>
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50">
              — Boulders Classic · PGTI Tour
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  const items = galleryItems.filter((i) => i.kind === "photo").slice(0, 5);
  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <EditorialHeading
            dark
            kicker="From Boulder Hills"
            title={
              <>
                Moments in <span className="italic text-fairway">gold & green.</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <Link
              to="/gallery"
              className="group mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/60 transition-colors hover:text-fairway"
            >
              Open gallery
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-20 md:gap-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((g, i) => (
          <motion.figure
            key={g.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="group relative w-[78vw] shrink-0 overflow-hidden sm:w-[420px]"
          >
            <div className="h-[300px] overflow-hidden md:h-[380px]">
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4">
              <span className="font-serif text-lg font-light">{g.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function TrophyCta() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink">
      <img
        src="/media/trophy.png"
        alt="The Boulders Classic Trophy"
        className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10">
        <Reveal>
          <p className="kicker">The Boulders Classic Trophy</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            One hundred thirty-two arrive.
            <br />
            <span className="italic text-gold">One name is engraved.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/prize-money"
              className="group flex items-center gap-3 border border-cream/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              Prize money breakdown
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/field"
              className="group flex items-center gap-3 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/70 transition-colors hover:text-gold"
            >
              Meet the field
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <Marquee />
      <ChampionshipIntro />
      <LeaderboardSnapshot />
      <EditorialQuote />
      <GalleryStrip />
      <TrophyCta />
    </main>
  );
}
