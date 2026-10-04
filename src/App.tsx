import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Leaderboard from "@/pages/Leaderboard";
import Field from "@/pages/Field";
import Draws from "@/pages/Draws";
import Scores from "@/pages/Scores";
import Results from "@/pages/Results";
import PrizeMoney from "@/pages/PrizeMoney";
import Gallery from "@/pages/Gallery";
import TourPartners from "@/pages/TourPartners";

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="kicker">Out of bounds</p>
      <h1 className="mt-6 font-serif text-6xl font-light text-cream md:text-8xl">404</h1>
      <p className="mt-4 max-w-sm text-sm text-cream/60">
        This hole doesn't exist on the course. Head back to the first tee.
      </p>
      <a
        href="/"
        className="mt-10 border border-cream/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink"
      >
        Tournament home
      </a>
    </main>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-ink text-cream">
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="/field" element={<PageTransition><Field /></PageTransition>} />
          <Route path="/draws" element={<PageTransition><Draws /></PageTransition>} />
          <Route path="/scores" element={<PageTransition><Scores /></PageTransition>} />
          <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
          <Route path="/prize-money" element={<PageTransition><PrizeMoney /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/tour-partners" element={<PageTransition><TourPartners /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
