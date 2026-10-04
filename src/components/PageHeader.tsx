import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export default function PageHeader({
  kicker,
  title,
  meta,
  image,
  imageAlt,
  imageCaption,
}: {
  kicker: string;
  title: ReactNode;
  meta?: ReactNode;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink grain">
      <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
        <div
          className={
            image
              ? "grid gap-10 lg:grid-cols-[1fr_minmax(0,46%)] lg:items-center lg:gap-14"
              : ""
          }
        >
          <div>
            <Reveal>
              <p className="kicker">{kicker}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-cream md:text-7xl xl:text-8xl">
                {title}
              </h1>
            </Reveal>
            {meta && (
              <Reveal delay={0.16}>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/55">
                  {meta}
                </div>
              </Reveal>
            )}
          </div>

          {image && (
            <Reveal delay={0.2}>
              <figure className="relative">
                <div className="border border-white/10 bg-pine/40 p-2 md:p-3">
                  {/* Full photograph, no crop — object-contain keeps players,
                      scoreboards and tournament branding intact. */}
                  <img
                    src={image}
                    alt={imageAlt ?? ""}
                    className="w-full object-contain md:max-h-[400px]"
                    loading="eager"
                  />
                </div>
                {imageCaption && (
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    <span>{imageCaption}</span>
                    <span className="text-gold/70">PGTI</span>
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
