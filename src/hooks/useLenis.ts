import { useEffect } from "react";
import Lenis from "lenis";

/** Global Lenis smooth-scroll, once per app. */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
