import { expect, test } from "bun:test";
import { shouldSmoothDesktopScroll, shouldSmoothWheel } from "../src/lib/smooth-scroll";

test("desktop mouse scrolling is smoothed", () => {
  expect(shouldSmoothDesktopScroll(true, true, false)).toBe(true);
  expect(shouldSmoothWheel({ ctrlKey: false, deltaMode: 0, deltaX: 0, deltaY: 120 })).toBe(true);
});
test("touch devices keep native scrolling", () => {
  expect(shouldSmoothDesktopScroll(false, false, false)).toBe(false);
});
test("reduced motion disables smoothing", () => {
  expect(shouldSmoothDesktopScroll(true, true, true)).toBe(false);
});
test("trackpad gestures and pinch zoom are not intercepted", () => {
  expect(shouldSmoothWheel({ ctrlKey: false, deltaMode: 0, deltaX: 0, deltaY: 12 })).toBe(false);
  expect(shouldSmoothWheel({ ctrlKey: false, deltaMode: 0, deltaX: 8, deltaY: 120 })).toBe(false);
  expect(shouldSmoothWheel({ ctrlKey: true, deltaMode: 0, deltaX: 0, deltaY: 120 })).toBe(false);
});