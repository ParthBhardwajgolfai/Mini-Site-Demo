import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { cx } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { galleryItems } from "@/data/boulder-classic";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const items = galleryItems;
  const activeItem = items.find((i) => i.id === active);

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="Media"
        title={
          <>
            The gallery<span className="text-gold">.</span>
          </>
        }
        meta={<span>Official championship photography & film</span>}
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g, i) => (
            <motion.button
              key={g.id}
              onClick={() => setActive(g.id)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.8, delay: Math.min(i * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
              className={cx(
                "group relative overflow-hidden text-left",
                g.span === "tall" ? "row-span-2 h-[420px] sm:h-[560px]" : "h-[280px] sm:h-[272px]",
              )}
            >
              {g.kind === "video" ? (
                <video
                  src={g.src}
                  poster="/media/hero-poster.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              ) : (
                <img
                  src={g.src}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-serif text-xl font-light text-cream">{g.title}</p>
                  {g.kind === "video" && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">Film</span>
                  )}
                </div>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-cream/60 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  {g.caption}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-5 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.kind === "video" ? (
                <video
                  src={activeItem.src}
                  poster="/media/hero-poster.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <img
                  src={activeItem.src}
                  alt={activeItem.title}
                  className="max-h-[75vh] w-full object-contain"
                />
              )}
              <figcaption className="mt-4 flex items-baseline justify-between gap-6">
                <span className="font-serif text-2xl font-light text-cream">{activeItem.title}</span>
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/60 hover:text-gold"
                >
                  Close ✕
                </button>
              </figcaption>
              <p className="mt-1 text-sm text-cream/60">{activeItem.caption}</p>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
