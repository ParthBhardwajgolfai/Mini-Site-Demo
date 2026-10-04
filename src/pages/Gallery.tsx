import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { cx } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { galleryItems, type GalleryItem } from "@/data/boulder-classic";

const EASE = [0.22, 1, 0.36, 1] as const;

function chipFor(g: GalleryItem): string {
  const parts: string[] = [];
  if (g.round) parts.push(`Round ${g.round}`);
  if (g.type === "video") parts.push("Film");
  else parts.push("Photo");
  if (g.duration) parts.push(g.duration);
  return parts.join(" · ");
}

/** Editorial photo/video tile — no cropping: containers match the source aspect. */
function MediaTile({
  item,
  onOpen,
  className,
}: {
  item: GalleryItem;
  onOpen: () => void;
  className?: string;
}) {
  const square = item.src.includes("portrait") || item.src.includes("rd4-putt");
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
      className={cx("group relative overflow-hidden border border-white/10 text-left", className)}
    >
      {item.type === "video" ? (
        <video
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className={cx(
            "w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]",
            square ? "aspect-square" : "aspect-video",
          )}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-serif text-xl font-light text-cream">{item.title}</p>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
            {chipFor(item)}
          </span>
        </div>
        <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-cream/65 opacity-0 transition-all duration-500 group-hover:opacity-100">
          {item.description}
        </p>
      </div>
    </motion.button>
  );
}

/** Documentary editorial card — full photograph, no crop, caption always visible. */
function EditorialCard({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
      className="group relative mx-auto block w-full max-w-4xl overflow-hidden border border-white/10 text-left"
    >
      <div className="bg-pine/40 p-2 md:p-3">
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className="w-full object-contain"
        />
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 px-5 pt-4">
        <p className="font-serif text-xl font-light text-cream">{item.title}</p>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
          {chipFor(item)}
        </span>
      </div>
      <p className="px-5 pb-5 pt-1.5 text-sm leading-relaxed text-cream/60">
        {item.description}
      </p>
    </motion.button>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
        <h2 className="font-serif text-3xl font-light text-cream md:text-4xl">{title}</h2>
        <p className="kicker">{kicker}</p>
      </div>
    </Reveal>
  );
}

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const activeItem = galleryItems.find((i) => i.id === active);

  const featured = galleryItems.find((g) => g.featured);
  const winning = galleryItems.filter((g) => g.category === "Winner's moments");
  const pressConf = galleryItems.find((g) => g.category === "Press conference");
  const onCourse = galleryItems.filter(
    (g) =>
      g.type === "photo" &&
      ["Round 1", "Round 2", "Round 4", "The Champion"].includes(g.category),
  );
  const film = galleryItems.find((g) => g.category === "Tournament film");

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="Media"
        title={
          <>
            The gallery<span className="text-gold">.</span>
          </>
        }
        meta={
          <span>
            Official championship photography &amp; film · DP World PGTI · Boulder Hills
          </span>
        }
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-14 md:px-10">
        {/* Round 4 highlights — the featured editorial video */}
        {featured && (
          <>
            <SectionHeading kicker={featured.category} title="Round 4 Highlights" />
            <Reveal>
              <motion.button
                onClick={() => setActive(featured.id)}
                className="group relative block w-full overflow-hidden border border-white/10 text-left"
                whileHover={{ scale: 1.004 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <img
                  src={featured.poster}
                  alt={featured.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/70 bg-ink/60 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
                    <span className="ml-1 block h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-current text-cream group-hover:text-ink" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline justify-between gap-3 p-5 md:p-7">
                  <p className="font-serif text-2xl font-light text-cream md:text-3xl">
                    {featured.title}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                    Round 4 · Final day · {featured.duration}
                  </span>
                </div>
              </motion.button>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/55">
                {featured.description}
              </p>
            </Reveal>
          </>
        )}

        {/* The winning moment */}
        {winning.length > 0 && (
          <div className="mt-20">
            <SectionHeading kicker="Winner's moments" title="The winning moment" />
            <div className="grid gap-6 lg:grid-cols-2">
              {winning.map((g) => (
                <EditorialCard key={g.id} item={g} onOpen={() => setActive(g.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Press conference — personalities */}
        {pressConf && (
          <div className="mt-20">
            <SectionHeading kicker="Press conference" title="Voices of the championship" />
            <EditorialCard item={pressConf} onOpen={() => setActive(pressConf.id)} />
          </div>
        )}

        {/* On the course */}
        {onCourse.length > 0 && (
          <div className="mt-20">
            <SectionHeading kicker="Across four days" title="On the course" />
            <div className="grid gap-5 sm:grid-cols-2">
              {onCourse.map((g) => (
                <MediaTile key={g.id} item={g} onOpen={() => setActive(g.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Tournament film */}
        {film && (
          <div className="mt-20">
            <SectionHeading kicker="Tournament film" title="The week in motion" />
            <MediaTile item={film} onOpen={() => setActive(film.id)} />
          </div>
        )}
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
              transition={{ duration: 0.4, ease: EASE }}
              className="max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.type === "video" ? (
                <video
                  src={activeItem.src}
                  poster={activeItem.poster}
                  autoPlay
                  controls
                  playsInline
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
                <span className="font-serif text-2xl font-light text-cream">
                  {activeItem.title}
                </span>
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/60 hover:text-gold"
                >
                  Close ✕
                </button>
              </figcaption>
              <p className="mt-1 text-sm text-cream/60">{activeItem.description}</p>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
