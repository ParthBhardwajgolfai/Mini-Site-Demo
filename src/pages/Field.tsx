import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { cx } from "@/lib/format";
import { motion } from "framer-motion";
import { tournament, fieldPlayers } from "@/data/boulder-classic";

const STATUS_STYLES: Record<string, string> = {
  "Made Cut": "text-sprig",
  "Missed Cut": "text-ink/35",
  Retired: "text-ink/35",
};

export default function Field() {
  const t = tournament;
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
