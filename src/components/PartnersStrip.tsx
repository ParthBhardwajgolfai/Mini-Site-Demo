import { tourPartners } from "@/data/boulder-classic";

/**
 * Official partner presentation: Tour Partners on the first row, Partners on
 * the second — logos sit directly on the cream band, pre-trimmed to their
 * artwork, no boxes or cards.
 */
export default function PartnersStrip() {
  const tour = tourPartners.filter((p) => p.tier === "Tour Partner");
  const partners = tourPartners.filter((p) => p.tier === "Partner");

  const row = (list: typeof tourPartners) => (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
      {list.map((p) => (
        <img
          key={p.name}
          src={p.src}
          alt={p.name}
          title={p.name}
          loading="lazy"
          className="h-9 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 md:h-10"
        />
      ))}
    </div>
  );

  return (
    <section className="border-t border-white/5 bg-bone">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-16">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">
          Tour Partners
        </p>
        <div className="mt-8">{row(tour)}</div>
        <div className="mx-auto mt-10 max-w-3xl border-t border-ink/10 pt-8">
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">
            Partners
          </p>
          {row(partners)}
        </div>
      </div>
    </section>
  );
}
