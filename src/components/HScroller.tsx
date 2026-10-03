import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

function ArrowButton({
  dir,
  onClick,
  visible,
}: {
  dir: "left" | "right";
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={cx(
        "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gold/60 bg-ink/85 font-mono text-lg text-gold backdrop-blur transition-all duration-300 hover:bg-gold hover:text-ink",
        dir === "left" ? "left-0" : "right-0",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {dir === "left" ? "←" : "→"}
    </button>
  );
}

/** Horizontal scroller with visible left/right arrows, edge fades and a thin
 *  styled scrollbar — use wherever content overflows off-canvas (player strip,
 *  scorecard tables). Children fill the scroll area; contentClassName carries
 *  the inner layout classes. */
export default function HScroller({
  children,
  contentClassName,
  className,
  label,
}: {
  children: ReactNode;
  contentClassName?: string;
  className?: string;
  label: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = areaRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, children]);

  const nudge = (dir: number) => {
    const el = areaRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.7, 240), behavior: "smooth" });
  };

  return (
    <div className={cx("group relative", className)} role="group" aria-label={label}>
      <ArrowButton dir="left" onClick={() => nudge(-1)} visible={canLeft} />
      <ArrowButton dir="right" onClick={() => nudge(1)} visible={canRight} />
      <div ref={areaRef} className={cx("hscroll-x overflow-x-auto", contentClassName)}>
        {children}
      </div>
      <span
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink to-transparent transition-opacity duration-300",
          canLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent transition-opacity duration-300",
          canRight ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
