export function shouldSmoothDesktopScroll(finePointer: boolean, hover: boolean, reducedMotion: boolean) {
  return finePointer && hover && !reducedMotion;
}

// Small pixel deltas and horizontal gestures usually come from a trackpad.
export function shouldSmoothWheel(event: { ctrlKey: boolean; deltaMode: number; deltaX: number; deltaY: number }) {
  return !event.ctrlKey && event.deltaX === 0 && (event.deltaMode !== 0 || Math.abs(event.deltaY) >= 50);
}