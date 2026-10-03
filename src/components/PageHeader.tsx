import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export default function PageHeader({
  kicker,
  title,
  meta,
  image,
}: {
  kicker: string;
  title: ReactNode;
  meta?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink grain">
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </>
      )}
      <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
        <Reveal>
          <p className="kicker">{kicker}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-cream md:text-8xl">
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
    </section>
  );
}
