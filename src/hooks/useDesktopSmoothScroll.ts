import { useEffect } from "react";
import Lenis from "lenis";
import { shouldSmoothDesktopScroll, shouldSmoothWheel } from "@/lib/smooth-scroll";

export function useDesktopSmoothScroll(routeKey: string) {
  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const hover = window.matchMedia("(hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!shouldSmoothDesktopScroll(pointer.matches, hover.matches, reducedMotion.matches)) return;

      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.14,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        virtualScroll: ({ event }) => event instanceof WheelEvent && shouldSmoothWheel(event),
        // Dialogs and fields must retain their own native interactions.
        prevent: (node) => node.matches("input, textarea, select, [contenteditable], [role='dialog'], [data-lenis-prevent]"),
      });
    };

    const queries = [pointer, hover, reducedMotion];
    queries.forEach((query) => query.addEventListener("change", update));
    update();
    return () => {
      queries.forEach((query) => query.removeEventListener("change", update));
      lenis?.destroy();
    };
  }, [routeKey]);
}