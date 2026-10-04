import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tourPartners } from "@/data/boulder-classic";

const ROTATE_MS = 4200;

/**
 * Tour partner logo rotator in the header's top-right. Logos sit directly
 * on the navbar — no label, no chip, no background — and swap with a plain
 * opacity crossfade (both logos briefly overlap, so there is never an empty
 * slot or background flash). Pauses on hover; shorter fade under
 * prefers-reduced-motion.
 */
export default function PartnerRotator() {
  const partners = tourPartners.filter((p) => p.tier === "Tour Partner");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % partners.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, partners.length]);

  const partner = partners[index];

  return (
    <div
      className="relative hidden h-8 w-[124px] lg:flex"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={`Tour partner: ${partner.name}`}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={partner.name}
          src={partner.src}
          alt={partner.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.6, ease: "easeInOut" }}
          className="absolute inset-0 m-auto h-7 w-auto max-w-full object-contain"
        />
      </AnimatePresence>
    </div>
  );
}
