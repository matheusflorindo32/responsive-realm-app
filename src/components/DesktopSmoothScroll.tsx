import { useLocation } from "react-router-dom";
import { useDesktopSmoothScroll } from "@/hooks/useDesktopSmoothScroll";

export function DesktopSmoothScroll() {
  const { pathname } = useLocation();
  useDesktopSmoothScroll(pathname);
  return null;
}