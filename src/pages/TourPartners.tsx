import { Link } from "react-router";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { tournament, tourPartners, type TourPartner } from "@/data/boulder-classic";

/** Cream plate a partner logo sits on — keeps every logo legible on ink. */
function LogoPlate({ partner, plateClassName }: { partner: TourPartner; plateClassName?: string }) {
  return (
    <div className={`flex items-center justify-center bg-cream ${plateClassName ?? ""}`}>
      <img
        src={partner.src}
        alt={`${partner.name} logo`}
        loading="lazy"
        className="max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}

/** Spotlight band for the featured (title) partner. */
function FeaturedPartner({ partner }: { partner: TourPartner }) {
  const paragraphs = (partner.description ?? "").split("\n\n");
  return (
    <section className="border-b border-white/10 bg-pine/60">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 md:grid-cols-2 md:px-10 md:py-24">
        <Reveal>
          <p className="kicker">{partner.role}</p>
          <div className="mt-8 inline-flex bg-cream px-9 py-6">
            <img
              src={partner.src}
              alt={`${partner.name} logo`}
              className="h-14 w-auto max-w-full object-contain md:h-16"
            />
          </div>
          <h2 className="mt-8 font-serif text-5xl font-light leading-[1.02] tracking-tight text-cream md:text-6xl">
            {partner.name}
          </h2>
          {paragraphs.map((para, i) => (
            <p key={i} className="mt-6 max-w-lg text-sm leading-relaxed text-cream/60 md:text-[15px]">
              {para}
            </p>
          ))}
          {partner.link && (
            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-3 border border-cream/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              dpworld.com
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          )}
        </Reveal>
        <Reveal delay={0.12}>
          <figure>
            <div className="border border-white/10 bg-pine/40 p-2">
              <img
                src="/media/partners/dp-world-feature.png"
                alt="DP World operations at one of its global ports"
                loading="lazy"
                className="w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
              <span>Global trade, in motion</span>
              <span className="text-gold/70">DP World</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/** Standard partner card — logo on cream, role, profile and outbound link. */
function PartnerCard({ partner, index }: { partner: TourPartner; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)} className="h-full">
      <a
        href={partner.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col border border-white/10 bg-pine/40 transition-colors duration-500 hover:border-gold/60"
      >
        <LogoPlate partner={partner} plateClassName="h-32 px-10 py-7 md:h-36" />
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{partner.role}</p>
          <h3 className="mt-3 font-serif text-2xl font-light text-cream">{partner.name}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/55">{partner.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45 transition-colors duration-300 group-hover:text-gold">
            Visit partner
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </a>
    </Reveal>
  );
}

/** Media partners on a light band — mirrors the home partner strip. */
function PartnersBand({ partners }: { partners: TourPartner[] }) {
  return (
    <section className="border-b border-ink/10 bg-bone text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">Partners</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 font-serif text-4xl font-light leading-[1.04] tracking-tight md:text-5xl">
            Media partners<span className="text-gold">.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {partners.map((p, i) => (
            <Reveal key={p.name} delay={Math.min(i * 0.08, 0.2)} className="h-full">
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center gap-7 border border-ink/10 bg-cream p-6 transition-colors duration-500 hover:border-gold/70 md:p-7"
              >
                <div className="flex h-20 w-44 shrink-0 items-center justify-center">
                  <img
                    src={p.src}
                    alt={`${p.name} logo`}
                    loading="lazy"
                    className="max-h-20 w-auto max-w-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{p.role}</p>
                  <p className="mt-2 font-serif text-2xl font-light">{p.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{p.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 transition-colors duration-300 group-hover:text-gold">
                    Visit partner
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Closing invitation band. */
function PartnershipCta() {
  return (
    <section className="bg-pine/60">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="kicker">Partner with the Boulders Classic</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-[1.05] text-cream md:text-6xl">
            The company of
            <br />
            <span className="italic text-gold">champions.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/55 md:text-[15px]">
            The Boulders Classic is presented with the support of partners who share in the
            game — on course and beyond it. Their backing carries professional golf across India.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://www.pgtofindia.com/tour-partners"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 border border-cream/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              The DP World PGTI Tour
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
            <Link
              to="/gallery"
              className="group flex items-center gap-3 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/70 transition-colors hover:text-gold"
            >
              See the week in pictures
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function TourPartners() {
  const t = tournament;
  const featured = tourPartners.find((p) => p.featured && p.tier === "Tour Partner");
  const tourPartnersRest = tourPartners.filter((p) => p.tier === "Tour Partner" && !p.featured);
  const partners = tourPartners.filter((p) => p.tier === "Partner");

  return (
    <main className="min-h-screen bg-ink">
      <PageHeader
        kicker="Partnership"
        title={
          <>
            Tour partners<span className="text-gold">.</span>
          </>
        }
        meta={
          <>
            <span>DP World PGTI Tour</span>
            <span>
              {t.name} · {t.edition}
            </span>
          </>
        }
        image="/media/partners/course-banner.jpg"
        imageAlt="Morning preparations on the course"
        imageCaption="The course, ready for the week"
      />

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
          <Reveal>
            <p className="max-w-3xl font-serif text-2xl font-light leading-snug text-cream/85 md:text-3xl">
              Professional golf in India moves on the backing of its partners — brands that
              carry the tour, and this championship, from the first tee to the last.
            </p>
          </Reveal>
        </div>
      </section>

      {featured && <FeaturedPartner partner={featured} />}

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="kicker">The partnership roster</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 font-serif text-4xl font-light leading-[1.04] tracking-tight text-cream md:text-5xl">
            Tour partners<span className="text-gold">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/45">
            {tourPartnersRest.length + (featured ? 1 : 0)} official partners · {t.edition} season
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tourPartnersRest.map((p, i) => (
            <PartnerCard key={p.name} partner={p} index={i} />
          ))}
        </div>
      </section>

      {partners.length > 0 && <PartnersBand partners={partners} />}

      <PartnershipCta />
    </main>
  );
}
