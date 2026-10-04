import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import PartnerRotator from "@/components/PartnerRotator";

const LINKS = [
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/field", label: "Field" },
  { to: "/draws", label: "Draws" },
  { to: "/scores", label: "Scores" },
  { to: "/results", label: "Results" },
  { to: "/prize-money", label: "Prize Money" },
  { to: "/gallery", label: "Gallery" },
];

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center" aria-label="GOLFAI home">
      <img
        src="/media/golfai-logo.png"
        alt="GOLFAI"
        className="h-7 w-auto transition-opacity duration-300 group-hover:opacity-80 md:h-8"
      />
    </Link>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <Wordmark />
          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 link-underline ${
                    isActive ? "text-gold" : "text-cream/70 hover:text-cream"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <PartnerRotator />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <div className="space-y-1.5">
                <span className="block h-px w-6 bg-cream" />
                <span className="block h-px w-6 bg-cream" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink grain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Wordmark />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center font-mono text-xs uppercase tracking-mega text-cream/70"
              >
                ✕
              </button>
            </div>
            <nav className="mt-6 flex flex-col px-6">
              {[{ to: "/", label: "Tournament" }, ...LINKS].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block border-b border-white/10 py-4 font-serif text-4xl font-light ${
                        isActive ? "text-gold" : "text-cream"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <p className="absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-mega text-cream/40">
              Boulder Hills · Hyderabad
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
