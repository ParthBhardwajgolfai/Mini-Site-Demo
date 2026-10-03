import { Link } from "react-router";
import { Reveal } from "./Reveal";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink grain">
      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-20 md:px-10 md:pt-28">
        <Reveal>
          <p className="kicker">Boulders Classic · PGTI Tour</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-4xl font-serif text-4xl font-light leading-[1.05] text-cream md:text-7xl">
            The game, measured.
            <br />
            <span className="italic text-gold">The moment, felt.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">Tournament</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li><Link className="link-underline hover:text-cream" to="/leaderboard">Leaderboard</Link></li>
              <li><Link className="link-underline hover:text-cream" to="/scores">Scores</Link></li>
              <li><Link className="link-underline hover:text-cream" to="/draws">Draws</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">Championship</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li><Link className="link-underline hover:text-cream" to="/field">Field</Link></li>
              <li><Link className="link-underline hover:text-cream" to="/results">Past Results</Link></li>
              <li><Link className="link-underline hover:text-cream" to="/prize-money">Prize Money</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">Media</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li><Link className="link-underline hover:text-cream" to="/gallery">Gallery</Link></li>
              <li><Link className="link-underline hover:text-cream" to="/">Tournament Home</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">Boulder Hills Golf Club</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Hyderabad, Telangana, India
              <br />
              Par 72 · 7,218 yards
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">
            © 2026 GolfAI. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-mega text-cream/40">
            Luxury Golf × Data Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
