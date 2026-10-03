import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll-triggered reveal: fade + rise, once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Image reveal with a clip-path wipe + slow settle zoom. */
export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(12% 6% 12% 6%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={imgClassName ?? "h-full w-full object-cover"}
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      />
    </motion.div>
  );
}

/** Kicker + oversized serif headline block used across pages. */
export function EditorialHeading({
  kicker,
  title,
  dark = false,
  className = "",
}: {
  kicker: string;
  title: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <p className="kicker">{kicker}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-4 font-serif text-4xl leading-[1.04] font-light tracking-tight md:text-6xl ${
            dark ? "text-ink" : "text-cream"
          }`}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
